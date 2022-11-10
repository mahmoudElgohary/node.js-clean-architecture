'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const appDir = path.dirname(require.main.filename);

import config from '../../../../config/config';
const database_config = config.database_config;
const db = {};
function resetAttributes(options) {
  if (options.originalAttributes !== undefined) {
    options.attributes = options.originalAttributes;
    if (options.include) {
      options.include.forEach(resetAttributes);
    }
  }
}

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    ...database_config,
    host: process.env.DATABASE_HOST,
    hooks: {
      beforeFindAfterOptions: function (options) {
        if (options.raw) resetAttributes(options);
      }
    }
  }
);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
