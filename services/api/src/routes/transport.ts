import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/helpers';

const router = Router();

/**
 * GET /transport/trip        – trip planner via Transport NSW
 * GET /transport/departures  – real-time departures
 * GET /transport/alerts      – service alerts
 *
 * Full implementation wired in Step 2.
 */

router.get('/trip', asyncHandler(async (_req: Request, res: Response) => {
  res.status(501).json({ error: { message: 'Transport trip planner – implemented in Step 2' } });
}));

router.get('/departures', asyncHandler(async (_req: Request, res: Response) => {
  res.status(501).json({ error: { message: 'Transport departures – implemented in Step 2' } });
}));

router.get('/alerts', asyncHandler(async (_req: Request, res: Response) => {
  res.status(501).json({ error: { message: 'Transport alerts – implemented in Step 2' } });
}));

export default router;
