import { DataTypes, Model, Optional } from 'sequelize';
import database from '../core/sequelize/Database.js';
import { DATABASE_CONSTANTS } from '../domain/constants/dbConstants.js';

export interface IUserAttributes {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  googleSub: string;
  avatarUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserCreationAttributes
  extends Optional<IUserAttributes, 'id' | 'password' | 'firstName' | 'lastName' | 'googleSub' | 'avatarUrl'> {}

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
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    googleSub: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true,
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
    modelName: DATABASE_CONSTANTS.MODELS.USER,
    tableName: DATABASE_CONSTANTS.TABLES.USER,
  }
);
