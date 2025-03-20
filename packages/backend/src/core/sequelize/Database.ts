import { Dialect, Sequelize } from 'sequelize';

class Database {
  private static instance: Database;
  public sequelize: Sequelize;

  private constructor() {
    this.sequelize = new Sequelize(process.env.DB_DATABASE!, process.env.DB_USERNAME!, process.env.DB_PASSWORD!, {
      host: process.env.DB_HOST!,
      dialect: process.env.DB_DIALECT! as Dialect,
      logging: process.env.NODE_ENV === 'development',
      define: {
        timestamps: true,
        paranoid: false,
      },
      timezone: '+00:00',
      dialectOptions: {
        dateStrings: true,
        typeCast: true,
        timezone: '+00:00',
        decimalNumbers: true,
      },
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const database = Database.getInstance().sequelize;
export default database;
