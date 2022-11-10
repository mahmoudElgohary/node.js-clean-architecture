module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: DataTypes.STRING,

    forgetPasswordCode: DataTypes.STRING,
    forgetPasswordDate: DataTypes.DATE,
    forgetPasswordCodeValidated: { type: DataTypes.BOOLEAN, allowNull: true },

    recieveUpdateNotif: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: true
    },
    recieveExperiemntNotif: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: true
    },
    recieveNewExperiemntNotif: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: true
    },
    language: DataTypes.ENUM(['ar', 'en']),

    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    avatar: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING },
    user_id: { type: DataTypes.STRING },
    product_family: { type: DataTypes.STRING },
    password: DataTypes.STRING,
    isIndividual: { type: DataTypes.BOOLEAN, defaultValue: false },
    active: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: true },
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true }
  });

  User.associate = ({ UserType }) => {
    User.belongsTo(UserType, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: true
      }
    });
  };

  return User;
};
