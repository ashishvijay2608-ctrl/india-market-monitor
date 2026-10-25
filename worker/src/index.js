export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    // 1. Global Markets Data
    if (url.pathname === "/api/global") {
      return Response.json({
        success: true,
        data: [
          { name: "Nikkei 225", price: "62,693.16", change: "-0.34%", trend: "down", region: "Japan", symbol: "TVC%3ANI225" },
          { name: "KOSPI", price: "5,550.30", change: "+0.30%", trend: "up", region: "South Korea", symbol: "KRX%3AKOSPI" },
          { name: "Brent Crude", price: "$111.70", change: "-1.30%", trend: "down", region: "ICE futures", symbol: "TVC%3AUKOIL" },
          { name: "GIFT Nifty", price: "22,535.5", change: "-0.32%", trend: "down", region: "NSE IX", symbol: "NSE%3ANIFTY1!" },
          { name: "India VIX", price: "16.86", change: "+6.98%", trend: "up", region: "NSE", symbol: "NSE%3AINDIAVIX" },
          { name: "Hang Seng", price: "23,093.37", change: "+0.69%", trend: "up", region: "Hong Kong", symbol: "TVC%3AHSI" }
        ]
      }, { headers: corsHeaders });
    }

    // 2. Sentiment & Crash Triggers
    if (url.pathname === "/api/sentiment") {
      return Response.json({
        success: true,
        data: {
          score: -11.5,
          status: "Mildly bearish",
          triggers: [
            { name: "Nikkei down > 2%", active: false, value: "-0.34%" },
            { name: "KOSPI down > 2%", active: false, value: "+0.30%" },
            { name: "GIFT Nifty down > 1%", active: false, value: "-0.32%" },
            { name: "Brent above $100", active: true, value: "$111.70" }
          ]
        }
      }, { headers: corsHeaders });
    }

    // 3. Gap Predictor & Options
    if (url.pathname === "/api/predictor") {
      return Response.json({
        success: true,
        data: {
          gap: {
            direction: "GAP DOWN",
            impliedOpen: "22,528",
            points: "-72 pts",
            percent: "-0.32%",
            gapUpProb: 15,
            gapDownProb: 75,
            flatProb: 10
          },
          options: [
            { id: 1, type: "PUT", strike: 22500, premium: 85.2, sl: 60, prob: "85%", target: "150" },
            { id: 2, type: "CALL", strike: 22700, premium: 45.0, sl: 30, prob: "60%", target: "80" }
          ]
        }
      }, { headers: corsHeaders });
    }

    return new Response("API running", { headers: corsHeaders });
  }
};
