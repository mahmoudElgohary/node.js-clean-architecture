import userTypeController from '../../../adapters/controllers/userTypeController';
import userTypeDbRepository from '../../../application/repositories/userTypeDbRepository';
import userTypeDbRepositoryMongoDB from '../../database/mysql/repositories/userTypeRepository';
import redisUserTypeRepository from '../../../application/repositories/userTypeRedisRepository';
import userTypeRedisRepositoryImpl from '../../database/redis/userTypeRepositoryRedis';
import redisCachingMiddleware from '../middlewares/redisCachingMiddleware';
import authMiddleware from '../middlewares/authMiddleware';

const ControllerCallback = require('../middlewares/controllerCallback');

export default function userTypeRouter(express, redisClient) {
  const router = express.Router();

  // load controller with dependencies
  const controller = userTypeController(
    userTypeDbRepository,
    userTypeDbRepositoryMongoDB,
    redisClient,
    redisUserTypeRepository,
    userTypeRedisRepositoryImpl
  );

  // GET endpoints
  router
    .route('/')
    .get(
      [authMiddleware, redisCachingMiddleware(redisClient, 'userTypes')],
      ControllerCallback(controller.fetchAllUserTypes)
    );
  router
    .route('/:id')
    .get(
      [authMiddleware, redisCachingMiddleware(redisClient, 'userType')],
      ControllerCallback(controller.fetchUserTypeById)
    );

  // POST endpoints
  router
    .route('/')
    .post(authMiddleware, ControllerCallback(controller.addNewUserType));

  // PUT endpoints
  router
    .route('/:id')
    .put(authMiddleware, ControllerCallback(controller.updateUserTypeById));

  // DELETE endpoints
  router.route('/:id').delete(authMiddleware, controller.deleteUserTypeById);

  return router;
}
