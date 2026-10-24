
'use strict';

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigin = process.env.FRONTEND_ORIGIN;

app.disable('x-powered-by');
app.use(express.json({ limit: '20kb' }));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigin && origin === allowedOrigin) {
      return callback(null, true);
    }

    if (
      !allowedOrigin &&
      /^http:\/\/localhost(:\d+)?$/.test(origin)
    ) {
      return callback(null, true);
    }

    return callback(new Error('Origin not allowed by CORS'));
  },
  methods: ['GET'],
  allowedHeaders: ['Accept']
}));

app.get('/', (req, res) => {
  res.json({
    name: 'India Market Monitor API',
    status: 'running',
    endpoints: ['/api/health', '/api/market']
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    marketData: 'not_configured',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/market', (req, res) => {
  res.status(503).json({
    status: 'not_configured',
    mode: 'unavailable',
    message: 'Market data provider is not configured.',
    timestamp: new Date().toISOString(),
    indices: {}
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path
  });
});

app.use((err, req, res, next) => {
  if (err.message === 'Origin not allowed by CORS') {
    return res.status(403).json({
      error: 'Origin not allowed'
    });
  }

  console.error('API error:', err.message);

  res.status(500).json({
    error: 'Internal server error'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('India Market Monitor API listening on port ' + PORT);
});
