const Sequelize = require('sequelize');
const config = require('../config/config');
const user = require('./User');
const photo = require('./Photo');
const like = require('./Like');
const category = require('./Category');
const refresh_token = require('./RefreshToken')

// const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
//   host: dbConfig.HOST,
//   dialect: dbConfig.dialect,
//   pool: {
//     max: dbConfig.pool.max,
//     min: dbConfig.pool.min,
//     acquire: dbConfig.pool.acquire,
//     idle: dbConfig.pool.idle,
//   },
// });
const sequelize = new Sequelize(config.development);

const db = {
  sequelize,
  Sequelize,
  user: user(sequelize, Sequelize),
  photo: photo(sequelize, Sequelize),
  like: like(sequelize, Sequelize),
  category: category(sequelize, Sequelize),
  refresh_token: refresh_token(sequelize, Sequelize),
};

// Define associations
db.user.hasMany(db.photo, { foreignKey: 'userId', onDelete: 'CASCADE' });
db.user.hasMany(db.photo, { foreignKey: 'clientId', onDelete: 'CASCADE' });
db.photo.belongsTo(db.user, { foreignKey: 'userId', onDelete: 'CASCADE' });

db.user.hasMany(db.like, { foreignKey: 'userId', onDelete: 'CASCADE' });
db.like.belongsTo(db.user, { foreignKey: 'userId', onDelete: 'CASCADE' });

db.photo.hasMany(db.like, { foreignKey: 'photoId', onDelete: 'CASCADE' });
db.like.belongsTo(db.photo, { foreignKey: 'photoId', onDelete: 'CASCADE' });

// Self-referencing associations for category
db.category.belongsTo(db.category, { foreignKey: 'parentId', as: 'parent' });
db.category.hasMany(db.category, { foreignKey: 'parentId', as: 'children' });

db.user.hasMany(db.refresh_token, { foreignKey: 'userId', onDelete: 'CASCADE' });
db.refresh_token.belongsTo(db.user, { foreignKey: 'userId', onDelete: 'CASCADE' });

// db.photo.belongsTo(db.user, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });
// db.photo.hasMany(db.like, { foreignKey: 'photoId', as: 'likes', onDelete: 'CASCADE' });


module.exports = db;