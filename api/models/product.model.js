
const dbInstance = require('@/database/db');
const { DataTypes, Model } = require('sequelize');
const Category = require('@/models/category.model');

class Product extends Model {}
Product.init(
  {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      // allowNull defaults to true
    },
    price: {
      type: DataTypes.FLOAT(10, 2),
      allowNull: false,
    },
    countInStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    // Other model options go here
    sequelize:  dbInstance(), // We need to pass the connection instance
    modelName: 'Product', // We need to choose the model name
  },
);

Product.belongsTo(Category, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE',
});

module.exports = Product;