import { Request, Response } from 'express';
import { TransactionRepository } from '../../../repositories/TransactionRepository.js';
import { BaseUseCase } from '../../BaseUseCase.js';
import { GetAllTransactionsData, GetAllTransactionsQuery, getAllTransactionsQuerySchema } from './types.js';
import { logger } from '../../../core/logger/logger.js';
import { Op } from 'sequelize';
import DateUtil from '../../../core/dateUtil/DateUtil.js';

export class GetAllTransactionsUseCase extends BaseUseCase<
  {},
  {},
  {},
  GetAllTransactionsQuery,
  GetAllTransactionsData[]
> {
  transactionRepository: TransactionRepository;

  constructor(
    request: Request<{}, {}, {}, GetAllTransactionsQuery>,
    response: Response,
    transactionRepository: TransactionRepository
  ) {
    super(request, response);
    this.transactionRepository = transactionRepository;
  }

  async validate() {
    this.parsedRequestQuery = getAllTransactionsQuerySchema.parse(this.request.query);
  }

  async execute() {
    let user: any;
    let dateUtil: DateUtil;
    let whereClause: any;
    try {
      user = await this.authenticate();
      dateUtil = DateUtil.getInstance();

      logger.debug('GetAllTransactionsUseCase.execute() :: startDate and endDate', {
        startDate: this.parsedRequestQuery.startDate,
        endDate: this.parsedRequestQuery.endDate,
      });

      whereClause = {
        isConfirmed: this.parsedRequestQuery.isConfirmed,
        userId: user.id,
      };

      if (this.parsedRequestQuery.startDate && this.parsedRequestQuery.endDate) {
        whereClause.date = {
          [Op.between]: [this.parsedRequestQuery.startDate, this.parsedRequestQuery.endDate],
        };
      }

      if (this.parsedRequestQuery.categories) {
        whereClause.category = {
          [Op.in]: this.parsedRequestQuery.categories,
        };
      }

      const transactions = await this.transactionRepository.model().findAndCountAll({
        where: whereClause,
        limit: this.limit,
        offset: this.offset,
        order: this.sequelizeOrderArray,
      });

      return transactions as unknown as GetAllTransactionsData[];
    } catch (error) {
      logger.error('GetAllTransactionsUseCase.execute() :: error', error);
      throw error;
    }
  }

  static create(request: Request<{}, {}, {}, GetAllTransactionsQuery>, response: Response) {
    return new GetAllTransactionsUseCase(request, response, new TransactionRepository());
  }
}
