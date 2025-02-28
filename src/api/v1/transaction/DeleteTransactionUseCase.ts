import { Request, Response } from 'express';
import { TransactionRepository } from '../../../repositories/TransactionRepository.js';
import { BaseUseCase } from '../../BaseUseCase.js';
import { DeleteTransactionData, DeleteTransactionParams } from './types.js';

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
    DeleteTransactionUseCase.logger.debug('Validating', {
      className: this.constructor.name,
      method: 'validate',
      params: this.request.params,
    });

    if (!this.request.params.id) {
      throw new Error('Transaction id is required');
    }
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
