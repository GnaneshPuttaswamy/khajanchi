import { DataTypes, Model, Optional } from 'sequelize';
import database from '../core/sequelize/Database.js';
import { DATABASE_CONSTANTS } from '../domain/constants/dbConstants.js';

export interface ITransactionAttributes {
  id: number;
  date: Date;
  amount: number;
  category: string;
  description: string;
  isConfirmed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface ITransactionCreationAttributes extends Optional<ITransactionAttributes, 'id'> {}

export class TransactionModel extends Model<ITransactionAttributes, ITransactionCreationAttributes> {}

TransactionModel.init(
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
    sequelize: database,
    modelName: DATABASE_CONSTANTS.MODELS.TRANSACTION,
    tableName: DATABASE_CONSTANTS.TABLES.TRANSACTION,
  }
);
