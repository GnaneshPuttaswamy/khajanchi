/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataTypes, QueryInterface, Sequelize, Transaction } from 'sequelize';
import { DATABASE_CONSTANTS } from '../../domain/constants/dbConstants.js';

export default {
  /**
   * Applies the migration
   * @param {QueryInterface} queryInterface - Interface for making database changes
   * @param {Sequelize} Sequelize - Sequelize instance for accessing data types and utilities
   */
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    let dbTransaction: Transaction;

    try {
      dbTransaction = await queryInterface.sequelize.transaction();

      await queryInterface.changeColumn(
        DATABASE_CONSTANTS.TABLES.TRANSACTION,
        'amount',
        {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        {
          transaction: dbTransaction,
        }
      );

      await queryInterface.removeColumn(DATABASE_CONSTANTS.TABLES.TRANSACTION, 'deletedAt', {
        transaction: dbTransaction,
      });

      await queryInterface.removeColumn(DATABASE_CONSTANTS.TABLES.USER, 'deletedAt', {
        transaction: dbTransaction,
      });

      await dbTransaction.commit();
    } catch (error) {
      console.error('Error in up migration: 20250429131600-unnamed-migration.ts :: error ==> ', error);
      await dbTransaction!.rollback();
      throw error;
    }
  },

  /**
   * Reverts the migration
   * @param {QueryInterface} queryInterface - Interface for making database changes
   * @param {Sequelize} Sequelize - Sequelize instance for accessing data types and utilities
   */
  async down(queryInterface: QueryInterface, Sequelize: Sequelize) {
    let dbTransaction: Transaction;

    try {
      dbTransaction = await queryInterface.sequelize.transaction();

      await queryInterface.addColumn(
        DATABASE_CONSTANTS.TABLES.TRANSACTION,
        'deletedAt',
        {
          type: DataTypes.DATE,
          allowNull: true,
        },
        {
          transaction: dbTransaction,
        }
      );

      await queryInterface.addColumn(
        DATABASE_CONSTANTS.TABLES.USER,
        'deletedAt',
        {
          type: DataTypes.DATE,
          allowNull: true,
        },
        {
          transaction: dbTransaction,
        }
      );

      await queryInterface.changeColumn(
        DATABASE_CONSTANTS.TABLES.TRANSACTION,
        'amount',
        {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        {
          transaction: dbTransaction,
        }
      );

      await dbTransaction.commit();
    } catch (error) {
      console.error('Error in up migration: 20250429131600-unnamed-migration.ts :: error ==> ', error);
      await dbTransaction!.rollback();
      throw error;
    }
  },
};
