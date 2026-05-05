import { Router, Request, Response } from 'express';
import { asyncHandler, sendError, sendAxiosError } from '../middleware/helpers';
import { chatCompletion, onboardingChat, Message } from '../services/openai';

const router = Router();

/** POST /ai/chat – proxies a conversation turn to OpenAI */
router.post(
  '/chat',
  asyncHandler(async (req: Request, res: Response) => {
    const { messages, systemPrompt } = req.body as {
      messages?: Message[];
      systemPrompt?: string;
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return sendError(res, 400, 'messages must be a non-empty array');
    }

    try {
      const reply = await chatCompletion(messages, systemPrompt);
      res.json({ reply });
    } catch (err: unknown) {
      sendAxiosError(res, err);
    }
  }),
);

/** POST /ai/onboarding – handles the onboarding conversation flow */
router.post(
  '/onboarding',
  asyncHandler(async (req: Request, res: Response) => {
    const { messages } = req.body as { messages?: Message[] };

    if (!Array.isArray(messages)) {
      return sendError(res, 400, 'messages must be an array');
    }

    try {
      const reply = await onboardingChat(messages);
      res.json({ reply });
    } catch (err: unknown) {
      sendAxiosError(res, err);
    }
  }),
);

/** POST /ai/recommendations – AI-powered personalised Sydney recommendations */
router.post(
  '/recommendations',
  asyncHandler(async (req: Request, res: Response) => {
    const { preferences, location } = req.body as {
      preferences?: unknown;
      location?: { lat: number; lng: number };
    };

    if (preferences === undefined || preferences === null) {
      return sendError(res, 400, 'preferences must be present');
    }

    const systemPrompt =
      'You are a Sydney tourism expert. Given the user preferences and location, suggest 5 personalized places/activities. Return a JSON array with objects: {name, type, description, address, why}.';

    const userMessage = JSON.stringify({ preferences, location });

    try {
      const raw = await chatCompletion([{ role: 'user', content: userMessage }], systemPrompt);

      let recommendations: unknown;
      try {
        recommendations = JSON.parse(raw);
      } catch {
        recommendations = raw;
      }

      res.json({ recommendations });
    } catch (err: unknown) {
      sendAxiosError(res, err);
    }
  }),
);

export default router;
