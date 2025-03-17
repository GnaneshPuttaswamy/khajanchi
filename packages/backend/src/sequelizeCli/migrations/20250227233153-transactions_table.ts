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

      await queryInterface.createTable(
        DATABASE_CONSTANTS.TABLES.TRANSACTION,
        {
          id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          date: {
            type: DataTypes.DATE,
            allowNull: false,
          },
          amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
          },
          category: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          description: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          isConfirmed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
          },
          deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
          },
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

      await queryInterface.dropTable(DATABASE_CONSTANTS.TABLES.TRANSACTION, {
        transaction: dbTransaction,
      });

      await dbTransaction.commit();
    } catch (error) {
      await dbTransaction!.rollback();
      throw error;
    }
  },
};
