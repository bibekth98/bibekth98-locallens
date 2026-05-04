import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import Env from './config/env';
import healthRouter from './routes/health';
import aiRouter from './routes/ai';
import placesRouter from './routes/places';
import restaurantsRouter from './routes/restaurants';
import transportRouter from './routes/transport';
import itinerariesRouter from './routes/itineraries';

const app: Application = express();

// ─── Security & Middleware ────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: Env.ALLOWED_ORIGINS.length ? Env.ALLOWED_ORIGINS : '*',
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(Env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/', healthRouter);
app.use('/v1/ai', aiRouter);
app.use('/v1/places', placesRouter);
app.use('/v1/restaurants', restaurantsRouter);
app.use('/v1/transport', transportRouter);
app.use('/v1/itineraries', itinerariesRouter);

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: { message: 'Not found' } });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: { message: 'Internal server error' } });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(Env.PORT, () => {
  console.log(`SydneyGo API listening on port ${Env.PORT} [${Env.NODE_ENV}]`);
});

export default app;
