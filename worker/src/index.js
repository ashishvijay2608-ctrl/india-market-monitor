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
          { name: "Nikkei 225", price: "62,693.16", change: "-0.34%", trend: "down", region: "Japan" },
          { name: "KOSPI", price: "5,550.30", change: "+0.30%", trend: "up", region: "South Korea" },
          { name: "Brent Crude", price: "$111.70", change: "-1.30%", trend: "down", region: "ICE futures" },
          { name: "GIFT Nifty", price: "22,535.5", change: "-0.32%", trend: "down", region: "NSE IX" },
          { name: "India VIX", price: "16.86", change: "+6.98%", trend: "up", region: "NSE" },
          { name: "Hang Seng", price: "23,093.37", change: "+0.69%", trend: "up", region: "Hong Kong" },
          { name: "USD/INR", price: "94.930", change: "+0.23%", trend: "up", region: "FX" },
          { name: "S&P 500 Fut", price: "7,659.75", change: "-0.58%", trend: "down", region: "CME futures" }
        ]
      }, { headers: corsHeaders });
    }

    // 2. Sentiment, Breakdown & FII/DII
    if (url.pathname === "/api/sentiment") {
      return Response.json({
        success: true,
        data: {
          score: -11.5,
          status: "Mildly bearish",
          triggers: [
            { name: "GIFT Nifty move", weight: "28%", value: "-0.32%", type: "drag", pos: 40 },
            { name: "Nikkei 225", weight: "12%", value: "-0.34%", type: "drag", pos: 42 },
            { name: "KOSPI", weight: "12%", value: "+0.30%", type: "support", pos: 60 },
            { name: "Hang Seng", weight: "6%", value: "+0.69%", type: "support", pos: 70 },
            { name: "Brent crude", weight: "14%", value: "$111.70 (-1.30%)", type: "drag", pos: 45 },
            { name: "India VIX", weight: "8%", value: "16.86 (+7.0%)", type: "drag", pos: 35 },
            { name: "USD/INR", weight: "4%", value: "94.930 (+0.23%)", type: "drag", pos: 40 }
          ],
          fiidii: {
            latest: { fii: "+888", dii: "+3,235", combined: "+4,123" },
            s5: { fii: "-1,531", dii: "+7,281", combined: "+5,749" },
            s10: { fii: "-15,257", dii: "+23,498", combined: "+8,241" },
            s20: { fii: "-80,642", dii: "+85,362", combined: "+4,720" }
          }
        }
      }, { headers: corsHeaders });
    }

    // 3. Predictor & Options
    if (url.pathname === "/api/predictor") {
      return Response.json({
        success: true,
        data: {
          gap: { direction: "GAP DOWN", points: "-72 pts", percent: "-0.32%", gapUpProb: 15, gapDownProb: 75 },
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
