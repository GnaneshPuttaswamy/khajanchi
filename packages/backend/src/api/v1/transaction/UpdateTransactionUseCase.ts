import { Request, Response } from 'express';
import { TransactionRepository } from '../../../repositories/TransactionRepository.js';
import { BaseUseCase } from '../../BaseUseCase.js';
import {
  AddTransactionRequest,
  UpdateTransactionParams,
  UpdateTransactionRequest,
  updateTransactionRequestSchema,
} from './types.js';
import DateUtil from '../../../core/dateUtil/DateUtil.js';
import { idParamsSchema } from '../../../core/zodSchemas/zodSchemas.js';

export class UpdateTransactionUseCase extends BaseUseCase<
  UpdateTransactionParams,
  {},
  UpdateTransactionRequest,
  {},
  void
> {
  transactionRepository: TransactionRepository;
  dateUtil: DateUtil;

  constructor(
    request: Request<UpdateTransactionParams, {}, UpdateTransactionRequest, {}>,
    response: Response,
    transactionRepository: TransactionRepository,
    dateUtil: DateUtil
  ) {
    super(request, response);
    this.transactionRepository = transactionRepository;
    this.dateUtil = dateUtil;
  }

  async validate() {
    this.request.params = idParamsSchema.parse(this.request.params);
    this.request.body = updateTransactionRequestSchema.parse(this.request.body);
  }

  async execute() {
    await this.transactionRepository.updateById(this.request.params.id, this.request.body);
  }

  static create(request: Request<UpdateTransactionParams, {}, AddTransactionRequest, {}>, response: Response) {
    return new UpdateTransactionUseCase(request, response, new TransactionRepository(), new DateUtil());
  }
}
