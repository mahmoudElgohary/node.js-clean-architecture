import userController from '../../../adapters/controllers/userController';
import userDbRepository from '../../../application/repositories/userDbRepository';
import userDbRepositoryMongoDB from '../../database/mysql/repositories/userRepository';
import authServiceInterface from '../../../application/services/authService';
import authServiceImpl from '../../services/authService';
import authMiddleware from '../middlewares/authMiddleware';

const ControllerCallback = require('../middlewares/controllerCallback');

export default function userRouter(express) {
  const router = express.Router();

  // load controller with dependencies
  const controller = userController(
    userDbRepository,
    userDbRepositoryMongoDB,
    authServiceInterface,
    authServiceImpl
  );

  // GET enpdpoints
  router
    .route('/:id')
    .get(authMiddleware, ControllerCallback(controller.fetchUserById));
  router.route('/').get(authMiddleware, controller.fetchUsersByProperty);

  // POST enpdpoints
  router.route('/').post(ControllerCallback(controller.addNewUser));

  return router;
}
