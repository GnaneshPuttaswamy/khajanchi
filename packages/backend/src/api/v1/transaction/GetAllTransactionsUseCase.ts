import { Request, Response } from 'express';
import { TransactionRepository } from '../../../repositories/TransactionRepository.js';
import { BaseUseCase } from '../../BaseUseCase.js';
import { GetAllTransactionsData, GetAllTransactionsQuery, getAllTransactionsQuerySchema } from './types.js';

export class GetAllTransactionsUseCase extends BaseUseCase<{}, {}, {}, {}, GetAllTransactionsData[]> {
  transactionRepository: TransactionRepository;

  constructor(
    request: Request<{}, {}, GetAllTransactionsQuery, {}>,
    response: Response,
    transactionRepository: TransactionRepository
  ) {
    super(request, response);
    this.transactionRepository = transactionRepository;
  }

  async validate() {
    this.request.query = getAllTransactionsQuerySchema.parse(this.request.query);
  }

  async execute() {
    const transactions = await this.transactionRepository.findAll({
      where: this.request.query,
    });

    return transactions as unknown as GetAllTransactionsData[];
  }

  static create(request: Request<{}, {}, GetAllTransactionsQuery, {}>, response: Response) {
    return new GetAllTransactionsUseCase(request, response, new TransactionRepository());
  }
}
