import { Request, Response } from 'express';
import { TransactionRepository } from '../../../repositories/TransactionRepository.js';
import { BaseUseCase } from '../../BaseUseCase.js';
import { ParseTransactionsData, ParseTransactionsRequest } from './types.js';

export class ParseTransactionsUseCase extends BaseUseCase<
  {},
  {},
  ParseTransactionsRequest,
  {},
  ParseTransactionsData[]
> {
  transactionRepository: TransactionRepository;

  constructor(
    request: Request<{}, {}, ParseTransactionsRequest, {}>,
    response: Response,
    transactionRepository: TransactionRepository
  ) {
    super(request, response);
    this.transactionRepository = transactionRepository;
  }

  async validate() {
    if (!this.request.body.transactionsDescription) {
      throw new Error('Transactions description is required');
    }
  }

  async execute() {
    return [
      {
        date: new Date(),
        amount: 100,
        category: 'Food',
        description: 'This is a test transaction',
      },
    ];
  }

  static create(request: Request<{}, {}, ParseTransactionsRequest, {}>, response: Response) {
    return new ParseTransactionsUseCase(request, response, new TransactionRepository());
  }
}
