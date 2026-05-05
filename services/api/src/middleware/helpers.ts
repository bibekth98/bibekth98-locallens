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

/** Normalizes an axios error and sends a JSON error response */
export function sendAxiosError(res: Response, err: unknown): void {
  const axiosErr = err as { response?: { status?: number; data?: unknown }; message?: string };
  const status = axiosErr.response?.status ?? 500;
  const message =
    (axiosErr.response?.data as { message?: string })?.message ??
    axiosErr.message ??
    'Provider error';
  sendError(res, status >= 400 && status < 600 ? status : 500, message);
}
