import { DataTypes, Model, Optional } from 'sequelize';
import database from '../core/sequelize/Database.js';
import { DATABASE_CONSTANTS } from '../domain/constants/dbConstants.js';

export interface IUserAttributes {
  id: number;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface IUserCreationAttributes extends Optional<IUserAttributes, 'id'> {}

export class UserModel extends Model<IUserAttributes, IUserCreationAttributes> {}

UserModel.init(
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
    sequelize: database,
    modelName: DATABASE_CONSTANTS.MODELS.USER,
    tableName: DATABASE_CONSTANTS.TABLES.USER,
  }
);
