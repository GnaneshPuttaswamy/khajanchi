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
        DATABASE_CONSTANTS.TABLES.USER,
        'password',
        {
          type: DataTypes.STRING,
          allowNull: true,
        },
        {
          transaction: dbTransaction,
        }
      );

      await queryInterface.addColumn(
        DATABASE_CONSTANTS.TABLES.USER,
        'firstName',
        {
          type: DataTypes.STRING,
          allowNull: true,
        },
        {
          transaction: dbTransaction,
        }
      );

      await queryInterface.addColumn(
        DATABASE_CONSTANTS.TABLES.USER,
        'lastName',
        {
          type: DataTypes.STRING,
          allowNull: true,
        },
        {
          transaction: dbTransaction,
        }
      );

      await queryInterface.addColumn(
        DATABASE_CONSTANTS.TABLES.USER,
        'googleSub',
        {
          type: DataTypes.STRING,
          allowNull: true,
        },
        {
          transaction: dbTransaction,
        }
      );

      await queryInterface.addColumn(
        DATABASE_CONSTANTS.TABLES.USER,
        'avatarUrl',
        {
          type: DataTypes.STRING,
          allowNull: true,
        },
        {
          transaction: dbTransaction,
        }
      );

      await dbTransaction.commit();
    } catch (error) {
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

      await queryInterface.sequelize.query(`
        DROP INDEX unique_google_sub
        ON ${DATABASE_CONSTANTS.TABLES.USER}
      `);

      await queryInterface.removeColumn(DATABASE_CONSTANTS.TABLES.USER, 'firstName');

      await queryInterface.removeColumn(DATABASE_CONSTANTS.TABLES.USER, 'lastName');

      await queryInterface.removeColumn(DATABASE_CONSTANTS.TABLES.USER, 'googleSub');

      await queryInterface.removeColumn(DATABASE_CONSTANTS.TABLES.USER, 'avatarUrl');

      await queryInterface.changeColumn(DATABASE_CONSTANTS.TABLES.USER, 'password', {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      });

      await dbTransaction.commit();
    } catch (error) {
      await dbTransaction!.rollback();
      throw error;
    }
  },
};
