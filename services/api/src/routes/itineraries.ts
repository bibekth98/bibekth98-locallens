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
 * Full implementation wired in Step 2.
 */

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
  res.status(501).json({ error: { message: 'List itineraries – implemented in Step 2' } });
}));

router.post('/', asyncHandler(async (_req: Request, res: Response) => {
  res.status(501).json({ error: { message: 'Create itinerary – implemented in Step 2' } });
}));

router.get('/:id', asyncHandler(async (_req: Request, res: Response) => {
  res.status(501).json({ error: { message: 'Itinerary detail – implemented in Step 2' } });
}));

router.put('/:id', asyncHandler(async (_req: Request, res: Response) => {
  res.status(501).json({ error: { message: 'Update itinerary – implemented in Step 2' } });
}));

router.delete('/:id', asyncHandler(async (_req: Request, res: Response) => {
  res.status(501).json({ error: { message: 'Delete itinerary – implemented in Step 2' } });
}));

export default router;
