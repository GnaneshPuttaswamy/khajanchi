import { Dialect, Sequelize } from 'sequelize';
import { logger } from '../logger/logger.js';

class Database {
  private static instance: Database;
  public sequelize: Sequelize;

  private constructor() {
    this.sequelize = new Sequelize(process.env.DB_DATABASE!, process.env.DB_USERNAME!, process.env.DB_PASSWORD!, {
      host: process.env.DB_HOST!,
      dialect: process.env.DB_DIALECT! as Dialect,
      logging:
        process.env.NODE_ENV === 'development'
          ? (sql: string, timing?: number) => {
              // This preserves the async context when Sequelize calls the logging function
              logger.debug(sql, timing);
            }
          : false,
      define: {
        timestamps: true,
        paranoid: false,
      },
      timezone: '+00:00',
      dialectOptions: {
        application_name: 'khajanchi-postgres',
        client_encoding: 'UTF8',
      },
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
      logger.info('Database connection initialized');
    }
    return Database.instance;
  }
}

const database = Database.getInstance().sequelize;
export default database;
