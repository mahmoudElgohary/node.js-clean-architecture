import { logger } from '../src/utils/logger';

export default {
  headers: {
    'Content-Type': 'application/json'
  },
  originalLanguage: 'en',
  port: process.env.PORT || 1234,
  ip: process.env.HOST || '0.0.0.0',
  database_config: {
    dialect: 'mysql',
    timezone: '+02:00',
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      underscored: true,
      freezeTableName: true
    },
    pool: {
      min: 0,
      max: 5
    },
    logQueryParameters: process.env.NODE_ENV === 'development',
    logging: (query, time) => {
      logger.info(`${time}ms  ${query}`);
    },
    benchmark: true
  },
  redis: {
    uri: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  jwtSecret: process.env.JWT_SECRET || 'jkl!±@£!@ghj1237'
};
