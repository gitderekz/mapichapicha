// models/Category.js
module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: 'categories', // Explicitly set the table name to lowercase
    });
  
    Category.associate = (models) => {
      Category.belongsTo(models.Category, { foreignKey: 'parentId', as: 'parent' });
      Category.hasMany(models.Category, { foreignKey: 'parentId', as: 'children' });
    };
  
    return Category;
  };