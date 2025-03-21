import { NextFunction, Request, Response } from 'express';
import { logger } from '../logger/logger.js';

const httpLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();
  const { method, originalUrl, requestId } = req;

  // Log incoming request
  logger.http('Request started', {
    requestId,
    method,
    url: originalUrl,
    userAgent: req.headers['user-agent'] || '',
    referrer: req.headers.referer || '',
    ...(process.env.NODE_ENV === 'development' && { body: req.body }), // Include body only in development for debugging
  });

  // Log when response finishes
  res.on('finish', () => {
    const durationInMs = getDurationInMs(start);
    logger.http('Request completed', {
      requestId,
      method,
      url: originalUrl,
      status: res.statusCode,
      contentLength: res.get('content-length') || 0,
      durationInMs,
      userAgent: req.headers['user-agent'] || '',
    });
  });

  next();
};

function getDurationInMs(start: [number, number]): number {
  const diff = process.hrtime(start);
  return Math.round((diff[0] * 1e9 + diff[1]) / 1e6); // Convert to milliseconds
}

export default httpLoggerMiddleware;
