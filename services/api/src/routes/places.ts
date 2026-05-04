import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/helpers';

const router = Router();

/**
 * GET /places/search    – full-text search via Google Places
 * GET /places/nearby    – places near a lat/lng
 * GET /places/categories – taxonomy list
 * GET /places/:id       – place detail
 *
 * Full implementation wired in Step 2.
 */

router.get('/search', asyncHandler(async (_req: Request, res: Response) => {
  res.status(501).json({ error: { message: 'Places search – implemented in Step 2' } });
}));

router.get('/nearby', asyncHandler(async (_req: Request, res: Response) => {
  res.status(501).json({ error: { message: 'Places nearby – implemented in Step 2' } });
}));

router.get('/categories', asyncHandler(async (_req: Request, res: Response) => {
  res.status(501).json({ error: { message: 'Places categories – implemented in Step 2' } });
}));

router.get('/:id', asyncHandler(async (_req: Request, res: Response) => {
  res.status(501).json({ error: { message: 'Place detail – implemented in Step 2' } });
}));

export default router;
