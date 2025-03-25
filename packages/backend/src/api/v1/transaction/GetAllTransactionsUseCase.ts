import { Request, Response } from 'express';
import { TransactionRepository } from '../../../repositories/TransactionRepository.js';
import { BaseUseCase } from '../../BaseUseCase.js';
import { GetAllTransactionsData, GetAllTransactionsQuery, getAllTransactionsQuerySchema } from './types.js';
import { logger } from '../../../core/logger/logger.js';

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
    let user: any;
    try {
      user = await this.authenticate();

      const transactions = await this.transactionRepository.findAll({
        where: {
          ...this.request.query,
          userId: user.id,
        },
      });

      return transactions as unknown as GetAllTransactionsData[];
    } catch (error) {
      logger.error('GetAllTransactionsUseCase.execute() :: error', error);
      throw error;
    }
  }

  static create(request: Request<{}, {}, GetAllTransactionsQuery, {}>, response: Response) {
    return new GetAllTransactionsUseCase(request, response, new TransactionRepository());
  }
}
