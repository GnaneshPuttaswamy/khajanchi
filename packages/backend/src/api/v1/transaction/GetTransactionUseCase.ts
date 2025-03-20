import { Request, Response } from 'express';
import { TransactionRepository } from '../../../repositories/TransactionRepository.js';
import { BaseUseCase } from '../../BaseUseCase.js';
import { GetTransactionData, GetTransactionParams } from './types.js';
import { idParamsSchema } from '../../../core/zodSchemas/zodSchemas.js';

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
    this.request.params = idParamsSchema.parse(this.request.params);
  }

  async execute() {
    const user: any = await this.authenticate();

    const transaction = await this.transactionRepository.model().findOne({
      where: {
        id: this.request.params.id,
        userId: user.id,
      },
    });

    return transaction as unknown as GetTransactionData;
  }

  static create(request: Request<GetTransactionParams, {}, {}, {}>, response: Response) {
    return new GetTransactionUseCase(request, response, new TransactionRepository());
  }
}
