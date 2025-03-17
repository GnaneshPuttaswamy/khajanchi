/* eslint-disable @typescript-eslint/no-unused-vars */
import { QueryInterface, Sequelize, Transaction } from 'sequelize';
import { DATABASE_CONSTANTS } from '../../domain/constants/dbConstants.js';
import DateUtil from '../../core/dateUtil/DateUtil.js';

export default {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    let dbTransaction: Transaction;
    const dateUtil = new DateUtil();

    try {
      dbTransaction = await queryInterface.sequelize.transaction();

      await queryInterface.bulkInsert(
        DATABASE_CONSTANTS.TABLES.TRANSACTION,
        [
          {
            date: dateUtil.toUTCDate(new Date('2025-01-15')),
            amount: 125.5,
            category: 'groceries',
            description: 'Weekly grocery shopping',
            isConfirmed: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            date: dateUtil.toUTCDate(new Date('2025-01-20')),
            amount: 45.99,
            category: 'utilities',
            description: 'Internet bill',
            isConfirmed: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            date: dateUtil.toUTCDate(new Date('2025-01-25')),
            amount: 300.0,
            category: 'rent',
            description: 'Monthly rent payment',
            isConfirmed: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            date: dateUtil.toUTCDate(new Date('2025-02-01')),
            amount: 85.75,
            category: 'dining',
            description: 'Dinner with friends',
            isConfirmed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            date: dateUtil.toUTCDate(new Date('2025-02-05')),
            amount: 199.99,
            category: 'shopping',
            description: 'New headphones',
            isConfirmed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { transaction: dbTransaction }
      );

      await dbTransaction.commit();
    } catch (error) {
      await dbTransaction!.rollback();
      throw error;
    }
  },

  async down(queryInterface: QueryInterface, Sequelize: Sequelize) {
    let dbTransaction: Transaction;

    try {
      dbTransaction = await queryInterface.sequelize.transaction();

      await queryInterface.bulkDelete(DATABASE_CONSTANTS.TABLES.TRANSACTION, {}, { transaction: dbTransaction });

      await dbTransaction.commit();
    } catch (error) {
      await dbTransaction!.rollback();
      throw error;
    }
  },
};
