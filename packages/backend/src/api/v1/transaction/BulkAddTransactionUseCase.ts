import { Request, Response } from 'express';
import { TransactionRepository } from '../../../repositories/TransactionRepository.js';
import { BaseUseCase } from '../../BaseUseCase.js';
import { BulkAddTransactionData, bulkAddTransactionRequestSchema, BulkAddTransactionRequest } from './types.js';
import { logger } from '../../../core/logger/logger.js';

export class BulkAddTransactionUseCase extends BaseUseCase<
  {},
  {},
  BulkAddTransactionRequest,
  {},
  BulkAddTransactionData[]
> {
  transactionRepository: TransactionRepository;

  constructor(
    request: Request<{}, {}, BulkAddTransactionRequest, {}>,
    response: Response,
    transactionRepository: TransactionRepository
  ) {
    super(request, response);
    this.transactionRepository = transactionRepository;
  }

  async validate() {
    logger.debug('BulkAddTransactionUseCase.validate()', {
      body: this.request.body,
    });

    this.request.body = bulkAddTransactionRequestSchema.parse(this.request.body);
  }

  async execute() {
    try {
      const user: any = await this.authenticate();

      const transactions = await this.transactionRepository.model().bulkCreate(
        this.request.body.transactions.map((transaction) => ({
          ...transaction,
          userId: user?.id,
        }))
      );

      logger.info('BulkAddTransactionUseCase.validate() :: Transactions added successfully', {
        transactionIds: transactions.map((transaction) => transaction.get('id')),
        userId: user?.id,
        amount: transactions.map((transaction) => transaction.get('amount')),
      });

      return transactions as unknown as BulkAddTransactionData[];
    } catch (error) {
      logger.error('BulkAddTransactionUseCase.execute() :: error', error);
      throw error;
    }
  }

  static create(request: Request<{}, {}, BulkAddTransactionRequest, {}>, response: Response) {
    return new BulkAddTransactionUseCase(request, response, new TransactionRepository());
  }
}
