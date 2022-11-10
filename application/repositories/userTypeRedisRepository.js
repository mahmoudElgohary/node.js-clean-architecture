export default function redisUserTypeRepository(repository) {
  const setCache = (options) => repository.setCache(options);
  return {
    setCache
  };
}
