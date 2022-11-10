import userType from '../../../src/entities/userType';

export default function updateById({
  id,
  title,
  description,
  isDeleted,
  userTypeRepository
}) {
  // validate
  if (!title || !description) {
    throw new Error('title and description fields are mandatory');
  }
  const updatedPost = userType({
    title,
    description,
    isDeleted
  });
  console.log(id);
  return userTypeRepository.updateById(id, updatedPost);
}
