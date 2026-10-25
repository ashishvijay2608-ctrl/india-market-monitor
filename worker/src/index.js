<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>India Market Monitor | Pro Terminal</title>
    <style>
        :root {
            --bg: #0a0c10;
            --panel: #12161f;
            --border: #1f2533;
            --text: #e2e8f0;
            --muted: #8b95a5;
            --green: #10b981;
            --red: #ef4444;
            --blue: #3b82f6;
            --yellow: #f59e0b;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background: var(--bg); color: var(--text); padding: 15px; padding-bottom: 50px; }
        
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        h1 { font-size: 1.1rem; font-weight: 700; color: #fff; }
        .time { font-size: 0.75rem; color: var(--muted); }

        /* Grid Cards */
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
        .card { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 15px; position: relative; }
        
        .c-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
        .c-name { font-size: 0.85rem; font-weight: 600; }
        .c-region { font-size: 0.65rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px;}
        .c-status { font-size: 0.6rem; padding: 2px 6px; border-radius: 4px; background: rgba(239, 68, 68, 0.1); color: var(--red); border: 1px solid rgba(239, 68, 68, 0.2); }
        
        .c-price { font-size: 1.4rem; font-weight: 700; margin-bottom: 5px; }
        .c-change { font-size: 0.8rem; font-weight: 600; margin-bottom: 10px;}
        .text-green { color: var(--green); }
        .text-red { color: var(--red); }

        .chart-btn { display: block; width: 100%; text-align: center; padding: 6px; background: var(--bg); border: 1px solid var(--border); color: var(--blue); text-decoration: none; font-size: 0.75rem; border-radius: 6px; font-weight: 600; transition: 0.2s; }
        .chart-btn:hover { background: var(--border); }

        /* Sentiment Gauge */
        .gauge-card { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 20px; text-align: center; }
        .gauge-title { font-size: 0.85rem; color: var(--muted); text-align: left; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; }
        
        .gauge-container { position: relative; width: 200px; height: 100px; margin: 0 auto; overflow: hidden; }
        .gauge-bg { width: 200px; height: 200px; border-radius: 50%; background: conic-gradient(from 270deg, var(--red) 0%, var(--red) 20%, var(--yellow) 30%, var(--yellow) 40%, #2d3748 45%, #2d3748 55%, var(--green) 60%, var(--green) 80%, var(--green) 100%); position: absolute; top: 0; }
        .gauge-inner { width: 160px; height: 160px; border-radius: 50%; background: var(--panel); position: absolute; top: 20px; left: 20px; }
        .gauge-needle { position: absolute; bottom: 0; left: 50%; width: 4px; height: 80px; background: #fff; transform-origin: bottom center; transform: rotate(-45deg); transition: transform 1s ease; z-index: 10; border-radius: 2px; }
        .gauge-value { position: relative; z-index: 20; margin-top: 15px; font-size: 2rem; font-weight: 700; }
        
        .status-text { font-size: 1rem; font-weight: 700; margin-top: 5px; }
        .reason-list { text-align: left; margin-top: 20px; font-size: 0.8rem; color: var(--muted); border-top: 1px solid var(--border); padding-top: 15px; }
        .reason-row { display: flex; justify-content: space-between; margin-bottom: 8px; }

        /* Gap Predictor Panel */
        .pred-card { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 20px; }
        .pred-header { font-size: 0.85rem; color: var(--muted); text-transform: uppercase; margin-bottom: 15px; border-bottom: 1px solid var(--border); padding-bottom: 10px; display: flex; justify-content: space-between;}
        .gap-main { font-size: 2rem; font-weight: 700; margin-bottom: 5px; }
        .gap-sub { font-size: 0.9rem; margin-bottom: 15px; }
        .prob-row { display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 5px; font-weight: 600;}
        .bar-bg { height: 6px; background: var(--border); border-radius: 3px; margin-bottom: 15px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 3px; transition: width 0.5s; }

        /* Options List */
        .opt-list { display: flex; flex-direction: column; gap: 10px; }
        .opt-item { background: var(--bg); padding: 12px; border-radius: 8px; border: 1px solid var(--border); }
        
        .opt-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;}
        .opt-type { font-weight: 700; font-size: 0.8rem; padding: 3px 8px; border-radius: 4px; }
        .type-pe { background: rgba(239, 68, 68, 0.2); color: var(--red); }
        .type-ce { background: rgba(16, 185, 129, 0.2); color: var(--green); }
        
        .opt-strike { font-size: 1rem; font-weight: 700; flex-grow: 1; margin-left: 10px;}
        .opt-prob { font-size: 1rem; font-weight: 700; color: var(--blue); }
        
        .opt-meta-row { display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--muted); margin-bottom: 10px; }
        .opt-meta-row span { color: #fff; font-weight: 600;}
        
        /* Mini Speedometer */
        .mini-gauge-bg { width: 100%; height: 8px; background: linear-gradient(to right, var(--red), var(--yellow) 30%, var(--green)); border-radius: 4px; position: relative; margin-top: 10px;}
        .mini-gauge-marker { width: 3px; height: 14px; background: white; position: absolute; top: -3px; border-radius: 2px; box-shadow: 0 0 3px #000;}
    </style>
</head>
<body>

    <div class="header">
        <h1>India Market Monitor</h1>
        <div class="time" id="current-time">Loading...</div>
    </div>

    <!-- INDIAN INDICES (NIFTY & SENSEX) -->
    <div class="grid-2" style="margin-bottom: 20px;">
        <div class="card" style="border-color: var(--border); background: linear-gradient(180deg, var(--panel) 0%, #0f131a 100%);">
            <div class="c-header">
                <div>
                    <div class="c-name">NIFTY 50</div>
                    <div class="c-region">NSE Spot</div>
                </div>
                <div class="c-status">CLOSED</div>
            </div>
            <div class="c-price">22,150.20</div>
            <div class="c-change text-red">▼ -87.65 (-0.39%)</div>
            <a href="https://www.tradingview.com/chart/?symbol=NSE%3ANIFTY" target="_blank" class="chart-btn">View Live Chart ↗</a>
        </div>

        <div class="card" style="border-color: var(--border); background: linear-gradient(180deg, var(--panel) 0%, #0f131a 100%);">
            <div class="c-header">
                <div>
                    <div class="c-name">SENSEX</div>
                    <div class="c-region">BSE Spot</div>
                </div>
                <div class="c-status">CLOSED</div>
            </div>
            <div class="c-price">73,125.40</div>
            <div class="c-change text-red">▼ -210.50 (-0.29%)</div>
            <a href="https://www.tradingview.com/chart/?symbol=BSE%3ASENSEX" target="_blank" class="chart-btn">View Live Chart ↗</a>
        </div>
    </div>

    <!-- GLOBAL MARKETS GRID -->
    <div class="grid-2" id="global-grid">
        <!-- Javascript will populate this -->
    </div>

    <!-- SENTIMENT GAUGE -->
    <div class="gauge-card">
        <div class="gauge-title">Bearish Sentiment Gauge</div>
        <div class="gauge-container">
            <div class="gauge-bg"></div>
            <div class="gauge-inner"></div>
            <div class="gauge-needle" id="needle" style="transform: rotate(-45deg);"></div>
        </div>
        <div class="gauge-value" id="score-val">-11.5</div>
        <div class="status-text text-red" id="status-val">Mildly bearish</div>
        
        <div class="reason-list" id="reasons">
            <!-- Reasons injected here -->
        </div>
    </div>

    <!-- GAP PREDICTOR -->
    <div class="pred-card">
        <div class="pred-header">Next-Day Gap Predictor</div>
        <div class="gap-main text-red" id="gap-dir">GAP DOWN</div>
        <div class="gap-sub text-red" id="gap-sub">▼ -72 pts (-0.32%)</div>
        
        <div class="prob-row"><span>Gap Up</span> <span id="up-p">15%</span></div>
        <div class="bar-bg"><div class="bar-fill" style="background: var(--green); width: 15%;" id="up-bar"></div></div>
        
        <div class="prob-row"><span>Gap Down</span> <span id="down-p">75%</span></div>
        <div class="bar-bg"><div class="bar-fill" style="background: var(--red); width: 75%;" id="down-bar"></div></div>
    </div>

    <!-- HIGH PROB OPTIONS -->
    <div class="pred-card">
        <div class="pred-header">High-Probability Options</div>
        <div class="opt-list" id="options-list">
            <!-- Options injected here -->
        </div>
    </div>

    <script>
        const API_BASE = "https://india-market-api.ashishvijay2608.workers.dev/api";

        setInterval(() => {
            document.getElementById('current-time').innerText = new Date().toLocaleTimeString() + " IST";
        }, 1000);

        // 1. Fetch Global Data
        async function fetchGlobal() {
            const res = await fetch(`${API_BASE}/global`);
            const json = await res.json();
            if(json.success) {
                const grid = document.getElementById('global-grid');
                grid.innerHTML = '';
                json.data.forEach(d => {
                    const colorClass = d.trend === 'up' ? 'text-green' : 'text-red';
                    const icon = d.trend === 'up' ? '▲' : '▼';
                    grid.innerHTML += `
                        <div class="card">
                            <div class="c-header">
                                <div>
                                    <div class="c-name">${d.name}</div>
                                    <div class="c-region">${d.region}</div>
                                </div>
                                <div class="c-status">CLOSED</div>
                            </div>
                            <div class="c-price">${d.price}</div>
                            <div class="c-change ${colorClass}">${icon} ${d.change}</div>
                            <a href="https://www.tradingview.com/chart/?symbol=${d.symbol}" target="_blank" class="chart-btn">View Live Chart ↗</a>
                        </div>
                    `;
                });
            }
        }

        // 2. Fetch Sentiment
        async function fetchSentiment() {
            const res = await fetch(`${API_BASE}/sentiment`);
            const json = await res.json();
            if(json.success) {
                const d = json.data;
                document.getElementById('score-val').innerText = d.score;
                document.getElementById('status-val').innerText = d.status;
                
                let rotation = (d.score / 100) * 90; 
                document.getElementById('needle').style.transform = `rotate(${rotation}deg)`;

                const reasonsDiv = document.getElementById('reasons');
                reasonsDiv.innerHTML = '';
                d.triggers.forEach(t => {
                    const color = t.active ? 'text-red' : 'text-muted';
                    reasonsDiv.innerHTML += `
                        <div class="reason-row">
                            <span>${t.name}</span>
                            <span class="${color}">${t.value}</span>
                        </div>
                    `;
                });
            }
        }

        // 3. Fetch Predictor & Options
        async function fetchPredictor() {
            const res = await fetch(`${API_BASE}/predictor`);
            const json = await res.json();
            if(json.success) {
                const d = json.data;
                
                document.getElementById('gap-dir').innerText = d.gap.direction;
                document.getElementById('gap-sub').innerText = `▼ ${d.gap.points} (${d.gap.percent})`;
                
                document.getElementById('up-p').innerText = d.gap.gapUpProb + "%";
                document.getElementById('up-bar').style.width = d.gap.gapUpProb + "%";
                
                document.getElementById('down-p').innerText = d.gap.gapDownProb + "%";
                document.getElementById('down-bar').style.width = d.gap.gapDownProb + "%";

                const optList = document.getElementById('options-list');
                optList.innerHTML = '';
                d.options.forEach(o => {
                    const typeClass = o.type === 'PUT' ? 'type-pe' : 'type-ce';
                    const typeColor = o.type === 'PUT' ? 'var(--red)' : 'var(--green)';
                    
                    optList.innerHTML += `
                        <div class="opt-item">
                            <div class="opt-top">
                                <span class="opt-type ${typeClass}">${o.type}</span>
                                <span class="opt-strike">Strike: ${o.strike}</span>
                                <span class="opt-prob" style="color: ${typeColor};">${o.prob}</span>
                            </div>
                            
                            <div class="opt-meta-row">
                                <span>Prem: ₹${o.premium}</span>
                                <span>SL: ₹${o.sl}</span>
                                <span>Target: ₹${o.target}</span>
                            </div>

                            <!-- Speedometer for Target Progress -->
                            <div style="font-size:0.6rem; color:var(--muted); display:flex; justify-content:space-between;">
                                <span>Entry</span>
                                <span>Target</span>
                            </div>
                            <div class="mini-gauge-bg">
                                <!-- Marker position simulates progress -->
                                <div class="mini-gauge-marker" style="left: 40%;"></div>
                            </div>
                        </div>
                    `;
                });
            }
        }

        fetchGlobal();
        fetchSentiment();
        fetchPredictor();
    </script>
</body>
</html>
