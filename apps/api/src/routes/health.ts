import type { PingResponse } from '@devtools-hub/shared';
import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/ping', (_req, res) => {
  const start = process.hrtime.bigint();
  const latencyMs = Number(process.hrtime.bigint() - start) / 1e6;

  const body: PingResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    latencyMs: Math.round(latencyMs * 100) / 100,
  };

  res.json(body);
});
