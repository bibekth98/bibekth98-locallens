import { Router } from 'express';

const router = Router();

/**
 * GET /health
 * Liveness probe – returns 200 when the server is up.
 */
router.get('/', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
