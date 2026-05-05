import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/helpers';

const router = Router();

/**
 * GET  /itineraries         – list user's itineraries
 * POST /itineraries         – create itinerary
 * GET  /itineraries/:id     – get itinerary detail
 * PUT  /itineraries/:id     – update itinerary
 * DELETE /itineraries/:id   – delete itinerary
 *
 * Placeholder routes – full implementation in Step 4 (auth + persistence).
 */

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
  res.status(501).json({ error: { message: 'List itineraries – implemented in Step 4' } });
}));

router.post('/', asyncHandler(async (_req: Request, res: Response) => {
  res.status(501).json({ error: { message: 'Create itinerary – implemented in Step 4' } });
}));

router.get('/:id', asyncHandler(async (_req: Request, res: Response) => {
  res.status(501).json({ error: { message: 'Itinerary detail – implemented in Step 4' } });
}));

router.put('/:id', asyncHandler(async (_req: Request, res: Response) => {
  res.status(501).json({ error: { message: 'Update itinerary – implemented in Step 4' } });
}));

router.delete('/:id', asyncHandler(async (_req: Request, res: Response) => {
  res.status(501).json({ error: { message: 'Delete itinerary – implemented in Step 4' } });
}));

export default router;
