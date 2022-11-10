import login from '../../application/use_cases/auth/login';

const { headers } = require('../../config/config');

export default function authController(
  userDbRepository,
  userDbRepositoryImpl,
  authServiceInterface,
  authServiceImpl
) {
  const dbRepository = userDbRepository(userDbRepositoryImpl());
  const authService = authServiceInterface(authServiceImpl());

  const loginUser = async (req) => {
    try {
      const { email, password } = req.body;
      const [token] = await Promise.all([
        login(email, password, dbRepository, authService)
      ]);
      return {
        headers,
        statusCode: 200,
        body: {
          token
        }
      };
    } catch (e) {
      throw e;
    }
  };
  return {
    loginUser
  };
}
