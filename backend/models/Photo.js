// module.exports = (sequelize, DataTypes) => {
//     const Photo = sequelize.define('photo', {
//       name: DataTypes.STRING,
//       category: DataTypes.STRING,
//       event: DataTypes.STRING,
//       displayOnHome: DataTypes.BOOLEAN,
//       userId: DataTypes.INTEGER,
//       imageUrl: DataTypes.STRING,
//       likes: DataTypes.INTEGER,
//     });
//     return Photo;
//   };
  // models/Photo.js
module.exports = (sequelize, DataTypes) => {
    const Photo = sequelize.define('Photo', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      event: {
        type: DataTypes.STRING,
        defaultValue: 'none',
      },
      displayOnHome: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      photoLikes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: 'photos', // Explicitly set the table name to lowercase
    });
  
    // Define associations
    Photo.associate = (models) => {
      // A photo belongs to a user
      Photo.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
  
      // A photo can have many likes
      Photo.hasMany(models.Like, { foreignKey: 'photoId', onDelete: 'CASCADE' });
    };
  
    return Photo;
  };