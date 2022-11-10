export default function userType({
  title,
  description,
  createdAt,
  deleted = false
}) {
  return {
    getTitle: () => title,
    getDescription: () => description,
    getCreatedAt: () => createdAt,
    isDeleted: () => deleted
  };
}
