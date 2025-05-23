import { Request, Response } from 'express';
import { TransactionRepository } from '../../../repositories/TransactionRepository.js';
import { BaseUseCase } from '../../BaseUseCase.js';
import {
  AddTransactionRequest,
  UpdateTransactionParams,
  UpdateTransactionRequest,
  updateTransactionRequestSchema,
} from './types.js';
import { idParamsSchema } from '../../../core/zodSchemas/zodSchemas.js';
import { logger } from '../../../core/logger/logger.js';

export class UpdateTransactionUseCase extends BaseUseCase<
  UpdateTransactionParams,
  {},
  UpdateTransactionRequest,
  {},
  void
> {
  transactionRepository: TransactionRepository;

  constructor(
    request: Request<UpdateTransactionParams, {}, UpdateTransactionRequest, {}>,
    response: Response,
    transactionRepository: TransactionRepository
  ) {
    super(request, response);
    this.transactionRepository = transactionRepository;
  }

  async validate() {
    this.request.params = idParamsSchema.parse(this.request.params);
    this.request.body = updateTransactionRequestSchema.parse(this.request.body);
  }

  async execute() {
    try {
      const user: any = await this.authenticate();

      await this.transactionRepository.model().update(
        {
          ...this.request.body,
          userId: user.id,
        },
        {
          where: {
            id: this.request.params.id,
            userId: user.id,
          },
        }
      );
    } catch (error) {
      logger.error('UpdateTransactionUseCase.execute() :: error', error);
      throw error;
    }
  }

  static create(request: Request<UpdateTransactionParams, {}, AddTransactionRequest, {}>, response: Response) {
    return new UpdateTransactionUseCase(request, response, new TransactionRepository());
  }
}
