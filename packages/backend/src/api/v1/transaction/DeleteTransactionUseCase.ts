import { Request, Response } from 'express';
import { TransactionRepository } from '../../../repositories/TransactionRepository.js';
import { BaseUseCase } from '../../BaseUseCase.js';
import { DeleteTransactionData, DeleteTransactionParams } from './types.js';
import { idParamsSchema } from '../../../core/zodSchemas/zodSchemas.js';
import { logger } from '../../../core/logger/logger.js';

export class DeleteTransactionUseCase extends BaseUseCase<DeleteTransactionParams, {}, {}, {}, DeleteTransactionData> {
  transactionRepository: TransactionRepository;

  constructor(
    request: Request<DeleteTransactionParams, {}, {}, {}>,
    response: Response,
    transactionRepository: TransactionRepository
  ) {
    super(request, response);
    this.transactionRepository = transactionRepository;
  }

  async validate() {
    this.request.params = idParamsSchema.parse(this.request.params);
  }

  async execute() {
    try {
      const user: any = await this.authenticate();

      const deleteCount = await this.transactionRepository.model().destroy({
        where: {
          id: this.request.params.id,
          userId: user.id,
        },
      });

      if (deleteCount === 0) {
        throw new Error('Transaction not found');
      }

      return {
        deletedCount: deleteCount,
      };
    } catch (error) {
      logger.error('DeleteTransactionUseCase.execute() error', error);
      throw error;
    }
  }

  static create(request: Request<DeleteTransactionParams, {}, {}, {}>, response: Response) {
    return new DeleteTransactionUseCase(request, response, new TransactionRepository());
  }
}
