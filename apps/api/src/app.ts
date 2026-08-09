import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { healthRouter } from './routes/health.js';

export const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? '*',
    methods: ['GET', 'POST'],
  }),
);
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
  res.json({
    name: 'devtools-hub-api',
    version: '0.1.0',
    health: '/api/v1/ping',
  });
});

app.use('/api/v1', healthRouter);
