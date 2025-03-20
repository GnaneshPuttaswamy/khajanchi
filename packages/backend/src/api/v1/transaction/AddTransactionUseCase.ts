import { Request, Response } from 'express';
import { TransactionRepository } from '../../../repositories/TransactionRepository.js';
import { BaseUseCase } from '../../BaseUseCase.js';
import { AddTransactionRequest, AddTransactionData, addTransactionRequestSchema } from './types.js';
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
    this.request.body = addTransactionRequestSchema.parse(this.request.body);
  }

  async execute() {
    const user: any = await this.authenticate();

    const transaction = await this.transactionRepository.add({
      ...this.request.body,
      userId: user?.id,
    });

    return transaction as unknown as AddTransactionData;
  }

  static create(request: Request<{}, {}, AddTransactionRequest, {}>, response: Response) {
    return new AddTransactionUseCase(request, response, new TransactionRepository(), new DateUtil());
  }
}
