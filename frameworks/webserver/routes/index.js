import userTypeRouter from './userType';
import userRouter from './user';
import authRouter from './auth';

export default function routes(app, express, redisClient) {
  app.use('/api/v1/user-type', userTypeRouter(express, redisClient));
  app.use('/api/v1/users', userRouter(express, redisClient));
  app.use('/api/v1/login', authRouter(express, redisClient));
}
