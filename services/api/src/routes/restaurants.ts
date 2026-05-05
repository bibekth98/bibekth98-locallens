import { Router, Request, Response } from 'express';
import { asyncHandler, sendError, sendAxiosError } from '../middleware/helpers';
import { searchRestaurants, restaurantDetail, restaurantReviews } from '../services/yelp';

const router = Router();

/** Yelp business IDs are alphanumeric strings with hyphens and underscores.
 *  Validated before URL interpolation to prevent SSRF / request forgery. */
const BUSINESS_ID_RE = /^[A-Za-z0-9_-]+$/;

/** GET /restaurants/search – search via Yelp Fusion */
router.get('/search', asyncHandler(async (req: Request, res: Response) => {
  const { q, lat, lng, location, radius, limit, offset } = req.query as {
    q?: string;
    lat?: string;
    lng?: string;
    location?: string;
    radius?: string;
    limit?: string;
    offset?: string;
  };

  const latNum = lat !== undefined ? parseFloat(lat) : undefined;
  const lngNum = lng !== undefined ? parseFloat(lng) : undefined;
  const hasCoords = latNum !== undefined && !isNaN(latNum) && lngNum !== undefined && !isNaN(lngNum);

  if (!hasCoords && !location) {
    return sendError(res, 400, 'Either lat+lng or location is required');
  }

  try {
    const data = await searchRestaurants({
      term: q,
      location: hasCoords ? undefined : location,
      latitude: hasCoords ? latNum : undefined,
      longitude: hasCoords ? lngNum : undefined,
      radius: radius !== undefined ? parseInt(radius, 10) : 2000,
      limit: limit !== undefined ? parseInt(limit, 10) : 20,
      offset: offset !== undefined ? parseInt(offset, 10) : 0,
    });

    const typed = data as { businesses?: unknown; total?: unknown };
    res.json({ restaurants: typed.businesses, total: typed.total });
  } catch (err: unknown) {
    sendAxiosError(res, err);
  }
}));

/** GET /restaurants/:id – restaurant detail */
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!BUSINESS_ID_RE.test(id)) {
    return sendError(res, 400, 'Invalid restaurant ID');
  }

  try {
    const restaurant = await restaurantDetail(id);
    res.json({ restaurant });
  } catch (err: unknown) {
    sendAxiosError(res, err);
  }
}));

/** GET /restaurants/:id/reviews */
router.get('/:id/reviews', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!BUSINESS_ID_RE.test(id)) {
    return sendError(res, 400, 'Invalid restaurant ID');
  }

  try {
    const reviews = await restaurantReviews(id);
    res.json({ reviews });
  } catch (err: unknown) {
    sendAxiosError(res, err);
  }
}));

export default router;
