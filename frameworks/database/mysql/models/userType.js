module.exports = (sequelize, DataTypes) => {
  const UserType = sequelize.define('UserType', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true }
  });

  UserType.associate = ({ User, TextContent }) => {
    UserType.hasMany(User);
    UserType.belongsTo(TextContent, {
      as: 'title',
      foreignKey: { name: 'titleId' }
    });
    UserType.belongsTo(TextContent, {
      as: 'description',
      foreignKey: {
        name: 'descriptionId'
      }
    });
  };
  return UserType;
};
