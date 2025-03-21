export default {
  development: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'mydbpwd',
    database: process.env.DB_DATABASE || 'khajanchi',
    host: process.env.DB_HOST || 'db',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: process.env.DB_DIALECT || 'mysql',
    seederStorage: 'sequelize',
  },
  test: {
    username: process.env.CI_DB_USERNAME,
    password: process.env.CI_DB_PASSWORD,
    database: process.env.CI_DB_NAME,
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
    dialectOptions: {
      bigNumberStrings: true,
    },
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: process.env.DB_DIALECT || 'mysql',
    seederStorage: 'sequelize',
    dialectOptions: {
      bigNumberStrings: true,
    },
  },
};
