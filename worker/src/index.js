export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    // Health Check
    if (url.pathname === "/health") {
      return Response.json({ status: "ok" }, { headers: corsHeaders });
    }

    // API Endpoint for 15-sec polling
    if (url.pathname === "/api/live-data") {
      // FAKE DATA for testing (will be replaced with Angel One later)
      const basePrice = 21500;
      const randomMove = Math.floor(Math.random() * 40) - 20; // -20 to +20
      const currentPrice = basePrice + randomMove;
      
      // Simple Logic: If price goes above 21515, send BUY signal
      let signal = "NEUTRAL";
      let message = "Market is ranging. No clear trend.";
      
      if (currentPrice > 21515) {
        signal = "BULLISH";
        message = "Strong momentum detected. Target 21600 looks possible.";
      } else if (currentPrice < 21485) {
        signal = "BEARISH";
        message = "Selling pressure. Support at 21400.";
      }

      return Response.json({
        success: true,
        timestamp: new Date().toISOString(),
        data: {
          symbol: "NIFTY 50",
          price: currentPrice,
          signal: signal,
          message: message
        }
      }, { headers: corsHeaders });
    }

    return new Response("API running", { headers: corsHeaders });
  }
};
