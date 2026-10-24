const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    app: "India Market Monitor",
    status: "running",
    message: "Backend is online"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    marketData: "not_configured"
  });
});

app.get("/api/market", (req, res) => {
  res.status(503).json({
    status: "not_configured",
    message:
      "Live market data API has not been connected yet."
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`India Market Monitor running on port ${PORT}`);
});
