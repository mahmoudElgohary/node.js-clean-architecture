import userType from '../../../src/entities/userType';

export default function addUserType({
  title,
  description,
  isDeleted,
  userTypeRepository
}) {
  // TODO: add a proper validation (consider using @hapi/joi)
  if (!title || !description) {
    throw new Error('title and description fields cannot be empty');
  }

  const newUserType = userType({
    title,
    description,
    isDeleted
  });

  return userTypeRepository.add(newUserType);
}
