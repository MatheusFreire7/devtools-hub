import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/ping', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
  });
});
