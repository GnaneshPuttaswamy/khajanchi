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
        DATABASE_CONSTANTS.TABLES.USER,
        {
          id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
              isEmail: true,
              notEmpty: true,
            },
          },
          password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              notEmpty: true,
            },
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
            validate: {
              notEmpty: true,
            },
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
          userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'users',
              key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
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
      console.error('Error in up migration: 20250227233153-user_and_transactions_table.ts :: error ==> ', error);
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

      await queryInterface.dropTable(DATABASE_CONSTANTS.TABLES.USER, {
        transaction: dbTransaction,
      });

      await dbTransaction.commit();
    } catch (error) {
      console.error('Error in down migration: 20250227233153-user_and_transactions_table.ts :: error ==> ', error);
      await dbTransaction!.rollback();
      throw error;
    }
  },
};
