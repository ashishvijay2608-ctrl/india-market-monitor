export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return Response.json({ status: "ok" });
    }

    if (url.pathname === "/api/market-data") {
      try {
        const apiKey = env.GROWW_API_KEY;
        const totpSecret = env.GROWW_TOTP_SECRET;

        if (!apiKey || !totpSecret) {
          return Response.json({ error: "Secrets missing" }, { status: 500 });
        }

        // 1. Generate TOTP Code (6 digits)
        const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        let bits = "";
        for (let i = 0; i < totpSecret.length; i++) {
          const val = base32chars.indexOf(totpSecret.charAt(i).toUpperCase());
          if (val >= 0) bits += val.toString(2).padStart(5, '0');
        }
        const bytes = new Uint8Array(bits.match(/.{1,8}/g).map(b => parseInt(b, 2)));
        const epoch = Math.floor(Date.now() / 1000);
        const timeHex = Math.floor(epoch / 30).toString(16).padStart(16, '0');
        const timeBytes = new Uint8Array(timeHex.match(/.{1,2}/g).map(b => parseInt(b, 16)));
        const cryptoKey = await crypto.subtle.importKey("raw", bytes, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
        const signature = await crypto.subtle.sign("HMAC", cryptoKey, timeBytes);
        const hmac = new Uint8Array(signature);
        const offset = hmac[hmac.length - 1] & 0xf;
        const code = ((hmac[offset] & 0x7f) << 24 | (hmac[offset + 1] & 0xff) << 16 | (hmac[offset + 2] & 0xff) << 8 | (hmac[offset + 3] & 0xff)) % 1000000;
        const totpCode = code.toString().padStart(6, '0');

        // 2. Get Access Token (Correct Groww API Format)
        const tokenRes = await fetch("https://api.groww.in/v1/token/api/access", {
          method: "POST",
          headers: { 
            "Authorization": "Bearer " + apiKey, // Groww needs API key in Bearer
            "Content-Type": "application/json" 
          },
          body: JSON.stringify({ 
            key_type: "totp",
            totp: totpCode 
          })
        });
        
        const tokenData = await tokenRes.json();
        
        // Agar token fail ho toh error bhejo
        if (tokenRes.status !== 200) {
          return Response.json({ error: "Token generation failed", details: tokenData }, { status: 500 });
        }

        const accessToken = tokenData.access_token || tokenData.token;
        if (!accessToken) {
          return Response.json({ error: "No access token", raw: tokenData }, { status: 500 });
        }

        // 3. Fetch Market Data
        const ltpRes = await fetch("https://api.groww.in/v1/live-data/ltp?segment=CASH&exchange_symbols=NSE_NIFTY,BSE_SENSEX", {
          headers: { 
            "Authorization": "Bearer " + accessToken, 
            "Accept": "application/json" 
          }
        });
        
        const ltpData = await ltpRes.json();

        return Response.json({ 
          status: "success", 
          timestamp: new Date().toISOString(),
          data: ltpData 
        });

      } catch (error) {
        return Response.json({ status: "error", message: error.message }, { status: 500 });
      }
    }

    return new Response("API is running. Visit /api/market-data");
  }
};
