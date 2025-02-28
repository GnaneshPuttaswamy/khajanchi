import { Request, Response } from 'express';
import { TransactionRepository } from '../../../repositories/TransactionRepository.js';
import { BaseUseCase } from '../../BaseUseCase.js';
import { GetTransactionData, GetTransactionParams } from './types.js';

export class GetTransactionUseCase extends BaseUseCase<GetTransactionParams, {}, {}, {}, GetTransactionData> {
  transactionRepository: TransactionRepository;

  constructor(
    request: Request<GetTransactionParams, {}, {}, {}>,
    response: Response,
    transactionRepository: TransactionRepository
  ) {
    super(request, response);
    this.transactionRepository = transactionRepository;
  }

  async validate() {
    if (!this.request.params.id) {
      throw new Error('Transaction id is required');
    }
  }

  async execute() {
    const transaction = await this.transactionRepository.findById(this.request.params.id);
    return transaction as unknown as GetTransactionData;
  }

  static create(request: Request<GetTransactionParams, {}, {}, {}>, response: Response) {
    return new GetTransactionUseCase(request, response, new TransactionRepository());
  }
}
