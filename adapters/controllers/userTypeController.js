import findAndCountAll from '../../application/use_cases/userType/findAndCountAll';
import addUserType from '../../application/use_cases/userType/add';
import findById from '../../application/use_cases/userType/findById';
import updateById from '../../application/use_cases/userType/updateById';
import deleteById from '../../application/use_cases/userType/deleteΒyId';

const { enhanceTranslate } = require('../../src/utils/util');

const { headers } = require('../../config/config');

export default function userTypeController(
  userTypeDbRepository,
  userTypeDbRepositoryImpl,
  cachingClient,
  userTypeCachingRepository,
  userTypeCachingRepositoryImpl
) {
  const userTypeRepository = userTypeDbRepository(userTypeDbRepositoryImpl());
  const cachingRepository = userTypeCachingRepository(
    userTypeCachingRepositoryImpl()(cachingClient)
  );

  // Fetch all the userTypes of the logged in user
  const fetchAllUserTypes = async (req) => {
    const params = {};
    const response = {};

    // Dynamically created query params based on endpoint params
    for (const key in req.query) {
      if (Object.prototype.hasOwnProperty.call(req.query, key)) {
        params[key] = req.query[key];
      }
    }
    // predefined query params (apart from dynamically) for pagination
    // and current logged in user
    params.page = params.page ? parseInt(params.page, 10) : 1;
    params.perPage = params.perPage ? parseInt(params.perPage, 10) : 10;
    // params.userId = req.user.id;

    const [result] = await Promise.all([
      findAndCountAll(params, userTypeRepository)
    ]);
    response.userTypes = enhanceTranslate(
      JSON.parse(JSON.stringify(result.rows, null, 2)),
      'originalLanguage',
      'LanguageId',
      true
    );
    // response.userTypes = result.rows;
    const cachingOptions = {
      key: 'userTypes_',
      expireTimeSec: 30,
      data: JSON.stringify(response.userTypes)
    };
    // cache the result to redis
    cachingRepository.setCache(cachingOptions);
    const totalItems = result.count;

    response.totalItems = totalItems;
    response.totalPages = Math.ceil(totalItems / params.perPage);
    response.itemsPerPage = params.perPage;
    return {
      headers,
      statusCode: 200,
      body: response
    };
  };

  const fetchUserTypeById = async (req) => {
    let userType = await findById(req.params.id, userTypeRepository);
    userType = enhanceTranslate(
      JSON.parse(JSON.stringify(userType, null, 2)),
      'originalLanguage',
      'LanguageId',
      true
    );
    return {
      headers,
      statusCode: 200,
      body: {
        userType
      }
    };
  };

  const addNewUserType = (req, res, next) => {
    const { title, description } = req.body;

    addUserType({
      title,
      description,
      userTypeRepository
    })
      .then((userType) => {
        const cachingOptions = {
          key: 'userTypes_',
          expireTimeSec: 30,
          data: JSON.stringify(userType)
        };
        // cache the result to redis
        cachingRepository.setCache(cachingOptions);
        return {
          headers,
          statusCode: 200,
          body: {
            message: 'userType added'
          }
        };
      })
      .catch((error) => next(error));
  };

  const deleteUserTypeById = (req, res, next) => {
    deleteById(req.params.id, userTypeRepository)
      .then(() => ({
        headers,
        statusCode: 200,
        body: {
          message: 'userType successfully deleted!'
        }
      }))
      .catch((error) => next(error));
  };

  const updateUserTypeById = async (req) => {
    const { title, description, isDeleted } = req.body;

    const userIdType = await updateById({
      id: req.params.id,
      title,
      description,
      isDeleted,
      userTypeRepository
    });
    return {
      headers,
      statusCode: 200,
      body: {
        message: userIdType
      }
    };
  };

  return {
    fetchAllUserTypes,
    addNewUserType,
    fetchUserTypeById,
    updateUserTypeById,
    deleteUserTypeById
  };
}
