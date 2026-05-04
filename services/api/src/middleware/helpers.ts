import { Request, Response, NextFunction } from 'express';

/** Wraps async route handlers to forward errors to Express error middleware */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

/** Standard JSON error response */
export function sendError(
  res: Response,
  status: number,
  message: string,
  details?: unknown,
): void {
  res.status(status).json({ error: { message, details } });
}
