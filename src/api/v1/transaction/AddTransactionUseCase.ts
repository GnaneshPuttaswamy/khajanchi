import { Request, Response } from 'express';
import { TransactionRepository } from '../../../repositories/TransactionRepository.js';
import { BaseUseCase } from '../../BaseUseCase.js';
import { AddTransactionRequest, AddTransactionData } from './types.js';
import DateUtil from '../../../core/dateUtil/DateUtil.js';

export class AddTransactionUseCase extends BaseUseCase<{}, {}, AddTransactionRequest, {}, AddTransactionData> {
  transactionRepository: TransactionRepository;
  dateUtil: DateUtil;

  constructor(
    request: Request<{}, {}, AddTransactionRequest, {}>,
    response: Response,
    transactionRepository: TransactionRepository,
    dateUtil: DateUtil
  ) {
    super(request, response);
    this.transactionRepository = transactionRepository;
    this.dateUtil = dateUtil;
  }

  async validate() {
    AddTransactionUseCase.logger.debug('Validating', {
      className: this.constructor.name,
      method: 'validate',
      request: this.request.body,
    });

    const { date, amount, category, description } = this.request.body;

    if (!date) {
      throw new Error('Date is required');
    }

    try {
      this.dateUtil.validateDate(date);
    } catch (error) {
      throw new Error(`Invalid date: ${(error as Error).message}`);
    }

    if (!amount || typeof amount !== 'number') {
      throw new Error('Invalid amount');
    }

    if (!category || typeof category !== 'string') {
      throw new Error('Invalid category');
    }

    if (!description || typeof description !== 'string') {
      throw new Error('Invalid description');
    }
  }

  async execute() {
    const transaction = await this.transactionRepository.add({
      ...this.request.body,
      date: this.dateUtil.toUTCDate(this.request.body.date),
      isConfirmed: this.request.body.isConfirmed !== undefined ? this.request.body.isConfirmed : false,
    });

    return transaction as unknown as AddTransactionData;
  }

  static create(request: Request<{}, {}, AddTransactionRequest, {}>, response: Response) {
    return new AddTransactionUseCase(request, response, new TransactionRepository(), new DateUtil());
  }
}
