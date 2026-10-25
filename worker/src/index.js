// India Market Monitor - Professional API Worker
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (url.pathname === "/health") {
      return Response.json({ status: "ok", service: "india-market-api" }, { headers: corsHeaders });
    }

    if (url.pathname === "/api/market-data") {
      try {
        const secret = env.GROWW_TOTP_SECRET;
        const apiKey = env.GROWW_API_KEY;
        
        if (!secret || !apiKey) {
          return Response.json({ error: "Secrets missing" }, { status: 500, headers: corsHeaders });
        }

        const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        let bits = "";
        for (let i = 0; i < secret.length; i++) {
          const val = base32chars.indexOf(secret.charAt(i).toUpperCase());
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

        const tokenRes = await fetch("https://api.groww.in/v1/token/api/access", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ api_key: apiKey, totp: totpCode })
        });
        
        const tokenData = await tokenRes.json();
        if (tokenRes.status !== 200) return Response.json({ error: "Token fail", details: tokenData }, { status: 500, headers: corsHeaders });

        const accessToken = tokenData.access_token || tokenData.token;
        if (!accessToken) return Response.json({ error: "No token" }, { status: 500, headers: corsHeaders });

        const ltpRes = await fetch("https://api.groww.in/v1/live-data/ltp?segment=CASH&exchange_symbols=NSE_NIFTY,BSE_SENSEX", {
          headers: { "Authorization": "Bearer " + accessToken, "Accept": "application/json" }
        });
        
        const ltpData = await ltpRes.json();

        return Response.json({ status: "success", data: ltpData }, { headers: corsHeaders });

      } catch (error) {
        return Response.json({ status: "error", message: error.message }, { status: 500, headers: corsHeaders });
      }
    }

    return new Response("API running. Visit /api/market-data", { headers: corsHeaders });
  }
};
