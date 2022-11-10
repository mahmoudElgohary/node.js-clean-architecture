module.exports = (sequelize, DataTypes) => {
  const Language = sequelize.define('Language', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    languageName: { type: DataTypes.STRING },
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true }
  });

  Language.associate = ({ TextContent, Translation }) => {
    Language.hasMany(TextContent, { foreignKey: { name: 'originalLanguage' } });
    Language.hasMany(Translation);
  };
  return Language;
};
