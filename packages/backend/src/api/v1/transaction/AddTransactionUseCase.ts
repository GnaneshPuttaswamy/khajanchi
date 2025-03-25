import { Request, Response } from 'express';
import { TransactionRepository } from '../../../repositories/TransactionRepository.js';
import { BaseUseCase } from '../../BaseUseCase.js';
import { AddTransactionRequest, AddTransactionData, addTransactionRequestSchema } from './types.js';
import { logger } from '../../../core/logger/logger.js';

export class AddTransactionUseCase extends BaseUseCase<{}, {}, AddTransactionRequest, {}, AddTransactionData> {
  transactionRepository: TransactionRepository;

  constructor(
    request: Request<{}, {}, AddTransactionRequest, {}>,
    response: Response,
    transactionRepository: TransactionRepository
  ) {
    super(request, response);
    this.transactionRepository = transactionRepository;
  }

  async validate() {
    logger.debug('AddTransactionUseCase.validate()', {
      body: this.request.body,
    });

    this.request.body = addTransactionRequestSchema.parse(this.request.body);
  }

  async execute() {
    try {
      const user: any = await this.authenticate();

      const transaction = await this.transactionRepository.add({
        ...this.request.body,
        userId: user?.id,
      });

      logger.info('AddTransactionUseCase.validate() :: Transaction added successfully', {
        transactionId: transaction.get('id'),
        userId: user?.id,
        amount: transaction.get('amount'),
      });

      return transaction as unknown as AddTransactionData;
    } catch (error) {
      logger.error('AddTransactionUseCase.execute() :: error', error);
      throw error;
    }
  }

  static create(request: Request<{}, {}, AddTransactionRequest, {}>, response: Response) {
    return new AddTransactionUseCase(request, response, new TransactionRepository());
  }
}
