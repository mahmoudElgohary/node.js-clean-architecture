const { User } = require('../models');

// move it to a proper place
function omit(obj, ...props) {
  const result = {
    ...(obj.perPage && { offset: obj.perPage * obj.page - obj.perPage }),
    ...(obj.perPage && { limit: obj.perPage }),
    where: { ...obj }
  };
  props.forEach((prop) => delete result[prop]);
  return result;
}

export default function userRepository() {
  const findByProperty = (params) =>
    User.findAll(omit(params, 'page', 'perPage'));

  const findAndCountAll = (params) =>
    User.findAndCountAll(omit(params, 'page', 'perPage'));
  const countAll = (params) => User.count(omit(params, 'page', 'perPage'));

  const findById = (id) => User.findById(id).select('-password');

  const add = (userEntity) => {
    const newUser = new User({
      username: userEntity.getUserName(),
      password: userEntity.getPassword(),
      email: userEntity.getEmail(),
      role: userEntity.getRole(),
      createdAt: new Date()
    });
    console.log(newUser);
    return User.create(newUser);
  };

  return {
    findByProperty,
    countAll,
    findAndCountAll,
    findById,
    add
  };
}
