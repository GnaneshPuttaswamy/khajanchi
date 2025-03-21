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

export abstract class BaseUseCase<
  TRequestParams = any,
  TResponseBody = any,
  TRequestBody = any,
  TRequestQuery = any,
  TData = any,
> {
  request: Request<TRequestParams, TResponseBody, TRequestBody, TRequestQuery>;
  response: Response;

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

  async authenticate() {
    try {
      let token = this.request.headers.authorization?.split(' ')[1];

      if (!token) {
        logger.warn('Authentication attempt with missing token');
        throw new Error('Unauthorized request');
      }

      const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
      logger.debug('User authenticated successfully', { payload });

      const userRepository = new UserRepository();
      const user = await userRepository.model().findByPk(payload?.id, {
        attributes: { exclude: ['password'] },
        raw: true,
      });

      if (!user) {
        throw new Error("User doesn't exist");
      }

      return user;
    } catch (error) {
      logger.error('Authentication error', { error: (error as Error).message });
      throw error;
    }
  }

  async executeAndHandleErrors(): Promise<void> {
    try {
      await this.validate();

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

      logger.error(`Unhandled error: ${(error as Error).message}`, { stack: (error as Error).stack });

      this.response
        .status(500)
        .json(
          BaseUseCase.error(
            'INTERNAL_SERVER_ERROR',
            process.env.NODE_ENV === 'production' ? 'Something went wrong' : (error as Error).message
          )
        );
    }
  }
}
