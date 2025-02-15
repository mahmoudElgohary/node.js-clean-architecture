import addUser from '../../application/use_cases/user/add';
import findByProperty from '../../application/use_cases/user/findByProperty';
import countAll from '../../application/use_cases/user/countAll';
import findById from '../../application/use_cases/user/findById';

const { headers } = require('../../config/config');

export default function userController(
  userDbRepository,
  userDbRepositoryImpl,
  authServiceInterface,
  authServiceImpl
) {
  const dbRepository = userDbRepository(userDbRepositoryImpl());
  const authService = authServiceInterface(authServiceImpl());

  const fetchUsersByProperty = (req, res, next) => {
    const params = {};
    const response = {};

    // Dynamically created query params based on endpoint params
    for (const key in req.query) {
      if (Object.prototype.hasOwnProperty.call(req.query, key)) {
        params[key] = req.query[key];
      }
    }
    // predefined query params (apart from dynamically) for pagination
    params.page = params.page ? parseInt(params.page, 10) : 1;
    params.perPage = params.perPage ? parseInt(params.perPage, 10) : 10;

    findByProperty(params, dbRepository)
      .then((users) => {
        response.users = users;
        return countAll(params, dbRepository);
      })
      .then((totalItems) => {
        response.totalItems = totalItems;
        response.totalPages = Math.ceil(totalItems / params.perPage);
        response.itemsPerPage = params.perPage;
        return {
          headers,
          statusCode: 200,
          body: {
            data: response
          }
        };
      })
      .catch((error) => error);
  };

  const fetchUserById = (req, res, next) => {
    findById(req.params.id, dbRepository)
      .then((user) => res.json(user))
      .catch((error) => error);
  };

  const addNewUser = async (req) => {
    const { username, password, email, role, createdAt } = req.body;

    try {
      const [user] = await Promise.all([
        addUser(
          username,
          password,
          email,
          role,
          createdAt,
          dbRepository,
          authService
        )
      ]);
      return {
        headers,
        statusCode: 200,
        body: {
          data: user
        }
      };
    } catch (e) {
      throw e;
    }
  };

  return {
    fetchUsersByProperty,
    fetchUserById,
    addNewUser
  };
}
