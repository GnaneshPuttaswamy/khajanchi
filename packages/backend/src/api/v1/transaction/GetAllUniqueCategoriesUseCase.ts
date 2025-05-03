import { Request, Response } from 'express';
import { TransactionRepository } from '../../../repositories/TransactionRepository.js';
import { BaseUseCase } from '../../BaseUseCase.js';
import { logger } from '../../../core/logger/logger.js';
import { QueryTypes } from 'sequelize';

export class GetAllUniqueCategoriesUseCase extends BaseUseCase<{}, {}, {}, {}, {}> {
  transactionRepository: TransactionRepository;

  constructor(request: Request<{}, {}, {}, {}>, response: Response, transactionRepository: TransactionRepository) {
    super(request, response);
    this.transactionRepository = transactionRepository;
  }

  async validate() {}

  async execute() {
    try {
      const user: any = await this.authenticate();

      logger.debug('GetAllUniqueCategoriesUseCase.execute() :: user.id =====> ', {
        userId: user.id,
      });

      const categories = await this.transactionRepository.model().sequelize?.query(
        `SELECT ARRAY_AGG(DISTINCT category) as categories 
         FROM (SELECT DISTINCT category FROM "transactions" WHERE "userId" = :userId) t`,
        {
          replacements: { userId: user.id },
          type: QueryTypes.SELECT,
          raw: true,
          plain: true,
        }
      );

      return categories as unknown as any;
    } catch (error) {
      logger.error('GetAllUniqueCategoriesUseCase.execute() :: error', error);
      throw error;
    }
  }

  static create(request: Request<{}, {}, {}, {}>, response: Response) {
    return new GetAllUniqueCategoriesUseCase(request, response, new TransactionRepository());
  }
}
