import authController from '../../../adapters/controllers/authController';
import userDbRepository from '../../../application/repositories/userDbRepository';
import userDbRepositoryMongoDB from '../../database/mysql/repositories/userRepository';
import authServiceInterface from '../../../application/services/authService';
import authServiceImpl from '../../services/authService';
const ControllerCallback=require('../middlewares/controllerCallback.js')

export default function authRouter(express) {
  const router = express.Router();

  // load controller with dependencies
  const controller = authController(
    userDbRepository,
    userDbRepositoryMongoDB,
    authServiceInterface,
    authServiceImpl
  );

  // POST enpdpoints
  router.route('/').post(ControllerCallback(controller.loginUser));

  return router;
}
