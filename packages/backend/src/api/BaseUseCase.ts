import { Request, Response } from 'express';
import { z } from 'zod';
import { UserRepository } from '../repositories/UserRepository.js';
import jwt from 'jsonwebtoken';
import { logger } from '../core/logger/logger.js';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  metadata: {
    timestamp: string;
    version: string;
  };
}

interface DefaultPaginationQuery {
  pageSize?: string | number;
  pageNumber?: string | number;
}

interface DefaultSortQuery {
  sortBy?: string | string[];
  sortOrder?: string | string[];
}

export abstract class BaseUseCase<
  TRequestParams = any,
  TResponseBody = any,
  TRequestBody = any,
  TRequestQuery extends DefaultPaginationQuery & DefaultSortQuery = DefaultPaginationQuery & DefaultSortQuery,
  TData = any,
> {
  request: Request<TRequestParams, TResponseBody, TRequestBody, TRequestQuery>;
  response: Response;

  parsedRequestQuery!: TRequestQuery;

  limit: number | undefined;
  offset: number | undefined;
  sequelizeOrderArray!: [string, 'ASC' | 'DESC'][];

  static success<T>(data: T): ApiResponse<T> {
    return {
      success: true,
      data,
      metadata: {
        timestamp: new Date().toISOString(),
        version: 'v1',
      },
    };
  }

  static error(code: string, message: string): ApiResponse<null> {
    return {
      success: false,
      error: {
        code,
        message,
      },
      metadata: {
        timestamp: new Date().toISOString(),
        version: 'v1',
      },
    };
  }

  abstract validate(): Promise<void>;
  abstract execute(): Promise<TData>;

  constructor(request: Request<TRequestParams, TResponseBody, TRequestBody, TRequestQuery>, response: Response) {
    this.request = request;
    this.response = response;
  }

  initializeLimitAndOffset() {
    const numberRegex = /^\d+$/;

    const pageSizeRes = numberRegex.exec(this.parsedRequestQuery?.pageSize as any);
    const pageNumberRes = numberRegex.exec(this.parsedRequestQuery?.pageNumber as any);

    if (!pageSizeRes || !pageNumberRes) {
      this.limit = undefined;
      this.offset = undefined;
    }

    if (pageSizeRes || pageNumberRes) {
      this.limit = +pageSizeRes![0];
      this.offset = (+pageNumberRes![0] - 1) * this.limit;
    }

    if (this.limit === 0) {
      this.limit = undefined;
      this.offset = undefined;
    }
  }

  initializeSequelizeOrderArray() {
    const { sortBy, sortOrder } = this.parsedRequestQuery || {};

    const sortByArray = Array.isArray(sortBy) ? sortBy : sortBy ? [sortBy] : [];
    const sortOrderArray = Array.isArray(sortOrder) ? sortOrder : sortOrder ? [sortOrder] : [];

    const sortCriteria: [string, 'ASC' | 'DESC'][] = [];
    const minLength = Math.min(sortByArray.length, sortOrderArray.length);

    for (let i = 0; i < minLength; i++) {
      const field = sortByArray[i];
      const order = sortOrderArray[i]?.toUpperCase();

      if (field && (order === 'ASC' || order === 'DESC')) {
        sortCriteria.push([field, order]);
      } else {
        console.warn(`Invalid sort pair at index ${i}:`, { field, order });
      }
    }

    this.sequelizeOrderArray = sortCriteria;
  }

  async authenticate() {
    try {
      let token = this.request.headers.authorization?.split(' ')[1];

      if (!token) {
        logger.warn('Authentication attempt with missing token');
        throw new Error('AUTH_NO_TOKEN');
      }

      try {
        const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
        logger.debug('User authenticated successfully', { payload });

        const userRepository = new UserRepository();
        const user = await userRepository.model().findByPk(payload?.id, {
          attributes: { exclude: ['password'] },
          raw: true,
        });

        if (!user) {
          throw new Error('AUTH_USER_NOT_FOUND');
        }

        return user;
      } catch (jwtError) {
        if ((jwtError as Error).name === 'TokenExpiredError') {
          logger.warn('Authentication attempt with expired token');
          throw new Error('AUTH_TOKEN_EXPIRED');
        } else if ((jwtError as Error).name === 'JsonWebTokenError') {
          logger.warn('Authentication attempt with invalid token');
          throw new Error('AUTH_TOKEN_INVALID');
        } else {
          logger.warn('Authentication error', { error: (jwtError as Error).message });
          throw new Error('AUTH_FAILED');
        }
      }
    } catch (error) {
      logger.error('Authentication error', { error: (error as Error).message });
      throw error;
    }
  }

  async executeAndHandleErrors(): Promise<void> {
    try {
      await this.validate();
      this.initializeLimitAndOffset();
      this.initializeSequelizeOrderArray();

      const result = await this.execute();

      if (!result) {
        this.response.status(200).json(BaseUseCase.success(null));
      } else {
        this.response.status(200).json(BaseUseCase.success(result));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        logger.warn(`Validation error: ${errorMessage}`);
        this.response.status(400).json(BaseUseCase.error('VALIDATION_ERROR', `Validation failed: ${errorMessage}`));
        return;
      }

      // Handle authentication errors with appropriate status codes and messages
      const errorMessage = (error as Error).message;

      switch (errorMessage) {
        case 'AUTH_NO_TOKEN':
          this.response.status(401).json(BaseUseCase.error('AUTH_NO_TOKEN', 'Authentication token is missing'));
          return;
        case 'AUTH_TOKEN_EXPIRED':
          this.response.status(401).json(BaseUseCase.error('AUTH_TOKEN_EXPIRED', 'Authentication token has expired'));
          return;
        case 'AUTH_TOKEN_INVALID':
          this.response.status(401).json(BaseUseCase.error('AUTH_TOKEN_INVALID', 'Authentication token is invalid'));
          return;
        case 'AUTH_USER_NOT_FOUND':
          this.response
            .status(401)
            .json(BaseUseCase.error('AUTH_USER_NOT_FOUND', 'User associated with token not found'));
          return;
        case 'AUTH_FAILED':
          this.response.status(401).json(BaseUseCase.error('AUTH_FAILED', 'Authentication failed'));
          return;
        default:
          logger.error(`Unhandled error: ${errorMessage}`, { stack: (error as Error).stack });
          this.response
            .status(500)
            .json(
              BaseUseCase.error(
                'INTERNAL_SERVER_ERROR',
                process.env.NODE_ENV === 'production' ? 'Something went wrong' : errorMessage
              )
            );
      }
    }
  }
}
