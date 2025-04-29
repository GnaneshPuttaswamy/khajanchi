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
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
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
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
  },
  {
    sequelize: database,
    modelName: DATABASE_CONSTANTS.MODELS.TRANSACTION,
    tableName: DATABASE_CONSTANTS.TABLES.TRANSACTION,
  }
);
