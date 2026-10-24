# India Live Market Monitor — installable web app (PWA)

This is an installable Android-friendly web app prototype. It is **not connected to live market data by default**. The screen deliberately avoids inventing prices/signals. For actual data, deploy it over HTTPS and connect a server-side API adapter.

## Files
- `index.html` — mobile-first dashboard, gap scenarios, sentiment and conditional CE/PE sections.
- `manifest.webmanifest` — install metadata.
- `sw.js` — basic offline shell cache.
- `backend-example/` — small Node server showing a secure provider-adapter pattern. It returns `not configured` until you implement a licensed/provider-specific adapter.

## Install on Android
1. Download and unzip the package.
2. Host the folder on an HTTPS static host (for example, a static hosting service you control). Service workers/PWA installation generally require HTTPS; opening the file directly may not enable installation.
3. Open the hosted URL in Chrome on Android.
4. Browser menu (`⋮`) → **Install app** or **Add to Home screen**.
5. The app icon opens in a standalone window. Offline mode caches the shell only; live data needs internet.

## Free-data reality
There is no universal promise of unlimited, exchange-authorized, real-time Nifty/Bank Nifty/Sensex plus options-chain data for free. Public feeds can be delayed, rate-limited, incomplete or subject to terms. Use free tiers for learning/prototyping, and label each field with provider timestamp and delay.

Possible starting points to investigate:
- Tapetide developer docs advertise a free tier with 50 calls/day; check whether its current plan covers the exact indices, option-chain and delay you need: https://developers.tapetide.com/
- TrueData advertises a free workspace with 15-minute delayed data; confirm API availability and terms for your use case: https://www.truedata.in/Home/Index
- NSE official market-data products list paid real-time and delayed/snapshot products: https://www.nseindia.com/static/market-data/real-time-data-subscription
- NSE's official data vending information: https://www.nse.in/static/nse-data-and-analytics/data-information-vending

Do not scrape unofficial exchange endpoints or redistribute market data without checking the provider/exchange terms.

## Connect data (safe architecture)
1. Create a provider account and read its documentation/terms.
2. Get a key/token if required. Keep it in your backend environment variables, never in `index.html`.
3. Implement an adapter in `backend-example/server.js` (or your own server) to call the provider from the server, normalize fields, and return the JSON schema below.
4. Deploy the backend with HTTPS and set `PROVIDER_API_KEY` in the host's secret/environment settings.
5. Deploy the frontend on HTTPS. In the app, paste your backend URL into **Data connection settings** and press Connect.
6. Verify provider timestamps, data delay, index symbols, timezone (IST), and rate limits. If any are missing/stale, do not show a confident signal.
7. For live updates, add polling or WebSocket support server-side at the provider's allowed interval. Do not poll more often than allowed by your plan.
8. Backtest the gap model out-of-sample before relying on forecasts. Keep model confidence separate from probability and never guarantee direction.

## Frontend JSON schema
`GET /api/market` should return an object shaped like this (values below are schema examples, not market values):

```json
{
  "mode": "live",
  "asOf": "2026-10-26T09:00:00+05:30",
  "quality": "provider timestamp verified",
  "indices": {
    "nifty": {"last": 0, "changePct": 0, "timestamp": "ISO-8601"},
    "bankNifty": {"last": 0, "changePct": 0, "timestamp": "ISO-8601"},
    "sensex": {"last": 0, "changePct": 0, "timestamp": "ISO-8601"},
    "indiaVix": {"last": 0, "changePct": 0, "timestamp": "ISO-8601"}
  },
  "sentiment": {"score": 0, "label": "Neutral / Mixed"},
  "cues": {
    "giftNifty": "provider value + timestamp",
    "globalSummary": "summary",
    "fiiDii": "latest published value/date",
    "marketBreadth": "advancers / decliners",
    "usIndices": "summary",
    "asianIndices": "summary",
    "brent": "value + timestamp",
    "usdInr": "value + timestamp"
  },
  "gapScenarios": {
    "nifty": {"label": "base-case range", "points": "points range"},
    "bankNifty": {"label": "base-case range", "points": "points range"},
    "sensex": {"label": "base-case range", "points": "points range"}
  },
  "levels": {
    "niftySupport": 0, "niftyResistance": 0,
    "bankNiftySupport": 0, "bankNiftyResistance": 0
  }
}
```

The sample numbers above are placeholders for the schema. Do not return zero as a fallback for missing real data; return `null` and display "not available".

## CE/PE targets and stop-loss
The current UI includes a conditional setup area, but it intentionally does not fabricate option entries or targets. To activate these calculations, add a rules engine based on verified candles, options quotes, strike/expiry, liquidity, spreads, and risk limits. Calculate entry, stop-loss, targets and risk/reward only when conditions are met. A signal is not a guarantee and should never automatically place orders.

## Important
- Do not store broker passwords or API keys in the frontend.
- Do not use demo values for live trading.
- For public/commercial use, check market-data licensing and applicable regulatory obligations.
