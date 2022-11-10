import user from '../../../src/entities/user';

export default function addUser(
  username,
  password,
  email,
  role,
  createdAt,
  userRepository,
  authService
) {
  // TODO: add a proper validation (consider using @hapi/joi)
  if (!username || !password || !email) {
    throw new Error('username, password and email fields cannot be empty');
  }
  const newUser = user(
    username,
    authService.encryptPassword(password),
    email,
    role,
    createdAt
  );
  return userRepository.add(newUser);
}
