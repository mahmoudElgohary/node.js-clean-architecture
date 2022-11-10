import express from 'express';
import redis from 'redis';
import config from './config/config';
import expressConfig from './frameworks/webserver/express';
import routes from './frameworks/webserver/routes';
import redisConnection from './frameworks/database/redis/connection';
// middlewares
import errorHandlingMiddleware from './frameworks/webserver/middlewares/errorHandlingMiddleware';

const app = express();

// express.js configuration (middlewares etc.)
expressConfig(app);

const redisClient = redisConnection(redis, config).createRedisClient();

// routes for each endpoint
routes(app, express, redisClient);

// error handling middleware
app.use(errorHandlingMiddleware);

// Expose app
module.exports = app;
