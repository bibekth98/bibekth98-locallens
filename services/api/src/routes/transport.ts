import { Router, Request, Response } from 'express';
import { asyncHandler, sendError, sendAxiosError } from '../middleware/helpers';
import { planTrip, getDepartures, getAlerts } from '../services/transportNSW';

const router = Router();

/** GET /transport/trip – trip planner via Transport NSW */
router.get('/trip', asyncHandler(async (req: Request, res: Response) => {
  const { originId, destinationId, depArrMacro, itdDate, itdTime } = req.query as {
    originId?: string;
    destinationId?: string;
    depArrMacro?: string;
    itdDate?: string;
    itdTime?: string;
  };

  if (!originId || !destinationId) {
    return sendError(res, 400, 'originId and destinationId are required');
  }

  try {
    const trip = await planTrip({ originId, destinationId, depArrMacro, itdDate, itdTime });
    res.json({ trip });
  } catch (err: unknown) {
    sendAxiosError(res, err);
  }
}));

/** GET /transport/departures – real-time departures */
router.get('/departures', asyncHandler(async (req: Request, res: Response) => {
  const { stopId, limit } = req.query as { stopId?: string; limit?: string };

  if (!stopId) {
    return sendError(res, 400, 'stopId is required');
  }

  try {
    const departures = await getDepartures({
      stopId,
      limit: limit !== undefined ? parseInt(limit, 10) : 10,
    });
    res.json({ departures });
  } catch (err: unknown) {
    sendAxiosError(res, err);
  }
}));

/** GET /transport/alerts – service alerts */
router.get('/alerts', asyncHandler(async (_req: Request, res: Response) => {
  try {
    const alerts = await getAlerts();
    res.json({ alerts });
  } catch (err: unknown) {
    sendAxiosError(res, err);
  }
}));

export default router;
