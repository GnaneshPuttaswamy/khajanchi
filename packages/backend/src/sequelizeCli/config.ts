export default {
  development: {
    username: process.env.DB_USERNAME || 'khajanchi',
    password: process.env.DB_PASSWORD || 'khajanchi',
    database: process.env.DB_DATABASE || 'khajanchi',
    host: process.env.DB_HOST || 'khajanchi-db',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: process.env.DB_DIALECT || 'postgres',
    seederStorage: 'sequelize',
  },
  test: {
    username: process.env.CI_DB_USERNAME,
    password: process.env.CI_DB_PASSWORD,
    database: process.env.CI_DB_NAME,
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres',
    dialectOptions: {
      bigNumberStrings: true,
    },
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: process.env.DB_DIALECT || 'postgres',
    seederStorage: 'sequelize',
    dialectOptions: {
      bigNumberStrings: true,
    },
  },
};
