import { Request, Response } from 'express';
import { TransactionRepository } from '../../../repositories/TransactionRepository.js';
import { BaseUseCase } from '../../BaseUseCase.js';
import { GetAllTransactionsData } from './types.js';

export class GetAllTransactionsUseCase extends BaseUseCase<{}, {}, {}, {}, GetAllTransactionsData[]> {
  transactionRepository: TransactionRepository;

  constructor(request: Request<{}, {}, {}, {}>, response: Response, transactionRepository: TransactionRepository) {
    super(request, response);
    this.transactionRepository = transactionRepository;
  }

  async validate() {}

  async execute() {
    const transactions = await this.transactionRepository.findAll({
      where: this.request.query,
    });

    return transactions as unknown as GetAllTransactionsData[];
  }

  static create(request: Request<{}, {}, {}, {}>, response: Response) {
    return new GetAllTransactionsUseCase(request, response, new TransactionRepository());
  }
}
