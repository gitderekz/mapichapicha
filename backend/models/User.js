// models/user.js
module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define('user', {
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
    user.associate = (models) => {
      // A user can upload many photos
      user.hasMany(models.Photo, { foreignKey: 'userId', onDelete: 'CASCADE' });
  
      // A user can like many photos
      user.hasMany(models.Like, { foreignKey: 'userId', onDelete: 'CASCADE' });

      user.hasMany(models.refresh_token, {
        foreignKey: 'userId',
        as: 'refresh_tokens',
      });
    };
  
    return user;
  };