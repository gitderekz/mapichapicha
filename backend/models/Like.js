// models/Like.js
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // References the Users table
        key: 'id',
      },
    },
    photoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Photos', // References the Photos table
        key: 'id',
      },
    },
  },
  {
    tableName: 'likes', // Explicitly set the table name to lowercase
  });

  // Define associations
  Like.associate = (models) => {
    // A like belongs to a user
    Like.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });

    // A like belongs to a photo
    Like.belongsTo(models.Photo, { foreignKey: 'photoId', onDelete: 'CASCADE' });
  };

  return Like;
};