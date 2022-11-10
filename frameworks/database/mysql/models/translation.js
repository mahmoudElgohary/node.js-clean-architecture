module.exports = (sequelize, DataTypes) => {
  const Translation = sequelize.define('Translation', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    translation: { type: DataTypes.STRING }
  });

  Translation.associate = ({ Language, TextContent }) => {
    Translation.belongsTo(Language);
    Translation.belongsTo(TextContent);
  };
  return Translation;
};
