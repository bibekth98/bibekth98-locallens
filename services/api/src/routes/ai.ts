import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/helpers';

const router = Router();

/**
 * POST /ai/chat
 * Proxies a conversation turn to OpenAI.
 * Full implementation wired in Step 2.
 */
router.post(
  '/chat',
  asyncHandler(async (_req: Request, res: Response) => {
    // TODO: validate body, call OpenAI API with conversation history
    res.status(501).json({ error: { message: 'AI chat endpoint – implemented in Step 2' } });
  }),
);

/**
 * POST /ai/onboarding
 * Handles the onboarding conversation flow.
 * Full implementation wired in Step 2.
 */
router.post(
  '/onboarding',
  asyncHandler(async (_req: Request, res: Response) => {
    res.status(501).json({ error: { message: 'AI onboarding endpoint – implemented in Step 2' } });
  }),
);

/**
 * POST /ai/recommendations
 * Returns AI-powered recommendations for a user.
 * Full implementation wired in Step 2.
 */
router.post(
  '/recommendations',
  asyncHandler(async (_req: Request, res: Response) => {
    res.status(501).json({ error: { message: 'AI recommendations – implemented in Step 2' } });
  }),
);

export default router;
