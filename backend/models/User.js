// models/User.js
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('publisher', 'visitor'),
        allowNull: false,
        defaultValue: 'visitor',
      },
    },
    {
      tableName: 'users', // Explicitly set the table name to lowercase
    });
  
    // Define associations
    User.associate = (models) => {
      // A user can upload many photos
      User.hasMany(models.Photo, { foreignKey: 'userId', onDelete: 'CASCADE' });
  
      // A user can like many photos
      User.hasMany(models.Like, { foreignKey: 'userId', onDelete: 'CASCADE' });
    };
  
    return User;
  };