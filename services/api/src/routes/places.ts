import { Router, Request, Response } from 'express';
import { asyncHandler, sendError, sendAxiosError } from '../middleware/helpers';
import { searchPlaces, nearbyPlaces, placeDetail } from '../services/googlePlaces';

const router = Router();

const CATEGORIES = [
  { id: 'tourist_attraction', label: 'Attractions', icon: '🏛️' },
  { id: 'restaurant', label: 'Restaurants', icon: '🍽️' },
  { id: 'park', label: 'Parks', icon: '🌿' },
  { id: 'shopping_mall', label: 'Shopping', icon: '🛍️' },
  { id: 'museum', label: 'Museums', icon: '🎨' },
  { id: 'beach', label: 'Beaches', icon: '🏖️' },
  { id: 'night_club', label: 'Nightlife', icon: '🎭' },
  { id: 'spa', label: 'Wellness', icon: '💆' },
  { id: 'lodging', label: 'Hotels', icon: '🏨' },
  { id: 'transit_station', label: 'Transport', icon: '🚉' },
];

/** GET /places/search – full-text search via Google Places */
router.get('/search', asyncHandler(async (req: Request, res: Response) => {
  const { q, location, radius } = req.query as {
    q?: string;
    location?: string;
    radius?: string;
  };

  if (!q) {
    return sendError(res, 400, 'q (search query) is required');
  }

  const radiusNum = radius !== undefined ? parseInt(radius, 10) : 5000;

  try {
    const places = await searchPlaces(q, location, radiusNum);
    res.json({ places });
  } catch (err: unknown) {
    sendAxiosError(res, err);
  }
}));

/** GET /places/nearby – places near a lat/lng */
router.get('/nearby', asyncHandler(async (req: Request, res: Response) => {
  const { lat, lng, radius, type } = req.query as {
    lat?: string;
    lng?: string;
    radius?: string;
    type?: string;
  };

  const latNum = parseFloat(lat ?? '');
  const lngNum = parseFloat(lng ?? '');

  if (isNaN(latNum) || isNaN(lngNum)) {
    return sendError(res, 400, 'lat and lng must be valid numbers');
  }

  const radiusNum = radius !== undefined ? parseInt(radius, 10) : 1000;

  try {
    const places = await nearbyPlaces(latNum, lngNum, radiusNum, type);
    res.json({ places });
  } catch (err: unknown) {
    sendAxiosError(res, err);
  }
}));

/** GET /places/categories – taxonomy list */
router.get('/categories', asyncHandler(async (_req: Request, res: Response) => {
  res.json({ categories: CATEGORIES });
}));

/** GET /places/:id – place detail */
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const place = await placeDetail(id);
    res.json({ place });
  } catch (err: unknown) {
    sendAxiosError(res, err);
  }
}));

export default router;
