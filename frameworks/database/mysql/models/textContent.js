module.exports = (sequelize, DataTypes) => {
  const TextContent = sequelize.define('TextContent', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    originalText: { type: DataTypes.STRING },
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true }
  });

  TextContent.associate = ({ Translation, Language }) => {
    TextContent.hasMany(Translation, { as: 'translations' });
    TextContent.belongsTo(Language, {
      as: 'language',
      foreignKey: {
        name: 'originalLanguage'
      }
    });
  };
  return TextContent;
};
