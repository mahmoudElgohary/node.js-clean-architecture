const { sequelize, UserType, TextContent, Translation } = require('../models');
const { originalLanguage } = require('../../../../config/config');

function omit(obj, ...props) {
  const result = {
    ...(obj.perPage && { offset: obj.perPage * obj.page - obj.perPage }),
    ...(obj.perPage && { limit: obj.perPage }),
    where: { ...obj },
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deleted']
    },
    include: [
      {
        model: TextContent,
        as: 'description',
        attributes: ['originalText', 'originalLanguage'],
        include: [
          {
            model: Translation,
            as: 'translations',
            attributes: ['translation', 'LanguageId']
          }
        ]
      },
      {
        model: TextContent,
        as: 'title',
        attributes: ['originalText', 'originalLanguage'],
        include: [
          {
            model: Translation,
            as: 'translations',
            attributes: ['translation', 'LanguageId']
          }
        ]
      }
    ]
  };
  props.forEach((prop) => delete result.where[prop]);
  return result;
}
const assosciation = {
  include: [
    {
      model: TextContent,
      as: 'description'
    },
    {
      model: TextContent,
      as: 'title'
    }
  ]
};
export default function userTypeRepository() {
  const findAll = (params) => UserType.findAll(omit(params, 'page', 'perPage'));
  const findAndCountAll = (params) =>
    UserType.findAndCountAll(omit(params, 'page', 'perPage'));
  const countAll = (params) => UserType.count(omit(params, 'page', 'perPage'));

  const findById = (id) => UserType.findByPk(id, omit({}));

  const add = (userTypeEntity) => {
    const newUserType = {
      title: {
        originalText: userTypeEntity.getTitle(),
        originalLanguage
      },
      description: {
        originalText: userTypeEntity.getDescription(),
        originalLanguage
      },
      createdAt: new Date(),
      deleted: userTypeEntity.isDeleted()
    };

    return UserType.create(newUserType, assosciation);
  };

  const updateById = (id, userTypeEntity) => {
    const userTypeToUpdate = {
      title: { originalText: userTypeEntity.getTitle() },
      description: { originalText: userTypeEntity.getDescription() },
      updatedAt: new Date()
    };

    UserType.findByPk(id, assosciation)
      .then((userType) => {
        if (!userType) {
          throw new Error(`UserType with id ${id} not found`);
        }
        console.log(JSON.parse(JSON.stringify(userType, null, 2)));
        userType.description.set(userTypeToUpdate.description, null);
        userType.title.set(userTypeToUpdate.title, null);
        delete userTypeToUpdate.description; // We have to delete this object to not reassign values
        delete userTypeToUpdate.title; // We have to delete this object to not reassign values
        userType.set(userTypeToUpdate);

        return sequelize.transaction((t) =>
          userType
            .save({ transaction: t })
            .then((updatedUserType) =>
              Promise.all([
                updatedUserType.title.save(),
                updatedUserType.description.save()
              ])
            )
        );
      })
      .then(() => console.log(`UserType & description updated!`));
  };

  const deleteById = (id) => UserType.findByIdAndRemove(id);

  return {
    findAll,
    findAndCountAll,
    countAll,
    findById,
    add,
    updateById,
    deleteById
  };
}
