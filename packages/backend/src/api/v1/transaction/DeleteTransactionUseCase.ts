import { Request, Response } from 'express';
import { TransactionRepository } from '../../../repositories/TransactionRepository.js';
import { BaseUseCase } from '../../BaseUseCase.js';
import { DeleteTransactionData, DeleteTransactionParams } from './types.js';
import { idParamsSchema } from '../../../core/zodSchemas/zodSchemas.js';

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
    const deleteCount = await this.transactionRepository.delete(this.request.params.id, {
      force: true,
    });

    if (deleteCount === 0) {
      throw new Error('Transaction not found');
    }

    return {
      deletedCount: deleteCount,
    };
  }

  static create(request: Request<DeleteTransactionParams, {}, {}, {}>, response: Response) {
    return new DeleteTransactionUseCase(request, response, new TransactionRepository());
  }
}
