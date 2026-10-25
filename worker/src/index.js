export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    // 1. Health Check
    if (url.pathname === "/health") {
      return Response.json({ status: "ok", service: "india-market-api-pro" }, { headers: corsHeaders });
    }

    // 2. Gap Predictor Logic (Simulated for now)
    if (url.pathname === "/api/gap-predictor") {
      const gapUpProb = Math.floor(Math.random() * 20) + 60; // 60-80%
      const gapDownProb = Math.floor(Math.random() * 20) + 10; // 10-30%
      const flatProb = 100 - gapUpProb - gapDownProb;

      return Response.json({
        success: true,
        data: {
          direction: "GAP UP",
          gapUpProb: gapUpProb,
          gapDownProb: gapDownProb,
          flatProb: flatProb,
          reasons: [
            "US Markets closed positive (+0.5%)",
            "Crude Oil prices dropped (-1.2%)",
            "GIFT NIFTY trading higher by 0.4%"
          ]
        }
      }, { headers: corsHeaders });
    }

    // 3. Live Option Premium (Simulated for Speedometer test)
    if (url.pathname === "/api/premium") {
      const basePremium = 100;
      const randomMove = Math.floor(Math.random() * 10) - 3; 
      const currentPremium = basePremium + randomMove;
      
      return Response.json({
        success: true,
        data: {
          symbol: "NIFTY 21500 CE",
          premium: currentPremium,
          timestamp: new Date().toLocaleTimeString()
        }
      }, { headers: corsHeaders });
    }

    return new Response("API running. Endpoints: /health, /api/gap-predictor, /api/premium", { headers: corsHeaders });
  }
}; 
