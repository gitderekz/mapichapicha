const Sequelize = require('sequelize');
const config = require('../config/config');
const User = require('./User');
const Photo = require('./Photo');
const Like = require('./Like');
const Category = require('./Category');

const sequelize = new Sequelize(config.development);

const db = {
  sequelize,
  Sequelize,
  User: User(sequelize, Sequelize),
  Photo: Photo(sequelize, Sequelize),
  Like: Like(sequelize, Sequelize),
  Category: Category(sequelize, Sequelize),
};

// Define associations
db.User.hasMany(db.Photo, { foreignKey: 'userId', onDelete: 'CASCADE' });
db.Photo.belongsTo(db.User, { foreignKey: 'userId', onDelete: 'CASCADE' });

db.User.hasMany(db.Like, { foreignKey: 'userId', onDelete: 'CASCADE' });
db.Like.belongsTo(db.User, { foreignKey: 'userId', onDelete: 'CASCADE' });

db.Photo.hasMany(db.Like, { foreignKey: 'photoId', onDelete: 'CASCADE' });
db.Like.belongsTo(db.Photo, { foreignKey: 'photoId', onDelete: 'CASCADE' });

// Self-referencing associations for Category
db.Category.belongsTo(db.Category, { foreignKey: 'parentId', as: 'parent' });
db.Category.hasMany(db.Category, { foreignKey: 'parentId', as: 'children' });

module.exports = db;