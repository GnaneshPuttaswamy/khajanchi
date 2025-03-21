import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { requestContextStorage, HttpRequestContext } from '../contexts/contexts.js';

export const REQUEST_ID_HEADER = 'X-Request-ID';

const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = (req.headers[REQUEST_ID_HEADER.toLowerCase()] as string) || uuidv4();

  req.requestId = requestId;
  res.setHeader(REQUEST_ID_HEADER, requestId);

  const request: HttpRequestContext = {
    requestId,
  };

  requestContextStorage.run(request, next);
};

export default requestIdMiddleware;
