import { Request, Response } from 'express';
import { Logger } from 'winston';
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
  static logger: Logger = logger;

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

  async executeAndHandleErrors(): Promise<void> {
    try {
      await this.validate();
      const result = await this.execute();
      this.response.status(200).json(BaseUseCase.success(result));
    } catch (error) {
      this.response.status(500).json(BaseUseCase.error('INTERNAL_SERVER_ERROR', (error as Error).message));
    }
  }
}
