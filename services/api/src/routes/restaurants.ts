import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/helpers';

const router = Router();

/**
 * GET  /restaurants/search   – search via Yelp Fusion
 * GET  /restaurants/:id      – restaurant detail
 * GET  /restaurants/:id/reviews
 *
 * Full implementation wired in Step 2.
 */

router.get('/search', asyncHandler(async (_req: Request, res: Response) => {
  res.status(501).json({ error: { message: 'Restaurant search – implemented in Step 2' } });
}));

router.get('/:id', asyncHandler(async (_req: Request, res: Response) => {
  res.status(501).json({ error: { message: 'Restaurant detail – implemented in Step 2' } });
}));

router.get('/:id/reviews', asyncHandler(async (_req: Request, res: Response) => {
  res.status(501).json({ error: { message: 'Restaurant reviews – implemented in Step 2' } });
}));

export default router;
