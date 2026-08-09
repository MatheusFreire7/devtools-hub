import type { ErrorRequestHandler } from 'express';
import cors from 'cors';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';

import { dnsRouter } from './routes/dns.js';
import { healthRouter } from './routes/health.js';
import { httpHeadersRouter } from './routes/httpHeaders.js';

export const app = express();

app.disable('x-powered-by');
app.use(helmet());

const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (origin === undefined || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Origin not allowed by CORS'));
    },
    methods: ['GET', 'POST'],
  }),
);
app.use(express.json({ limit: '1mb' }));

const apiLimiter = rateLimit({
  windowMs: 60_000,
  limit: 60,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: { code: 'RATE_LIMITED', message: 'Too many requests, please try again later.' },
  },
});

app.get('/', (_req, res) => {
  res.json({
    name: 'devtools-hub-api',
    version: '0.1.0',
    health: '/api/v1/ping',
  });
});

app.use('/api/v1', apiLimiter);
app.use('/api/v1', healthRouter);
app.use('/api/v1', dnsRouter);
app.use('/api/v1', httpHeadersRouter);

app.use('/api/v1', (_req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'API route not found.' } });
});

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof SyntaxError && 'status' in err && err.status === 400) {
    res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Malformed JSON body.' } });
    return;
  }
  if ('status' in err && typeof err.status === 'number' && err.status >= 400 && err.status < 500) {
    res.status(err.status).json({
      error: {
        code: 'REQUEST_REJECTED',
        message: err instanceof Error ? err.message : 'Request rejected.',
      },
    });
    return;
  }
  console.error('[api] unhandled error:', err);
  res.status(500).json({ error: { code: 'SYSTEM_ERROR', message: 'Unexpected server error.' } });
};

app.use(errorHandler);
