const { DataTypes, Model } = require('sequelize');
const dbInstance = require('@/database/db');
// const Product = require('@/models/product.model');

class Category extends Model {}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    short_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
  },
  {
    sequelize: dbInstance(), // Pass the connection instance
    modelName: 'Category', // We need to choose the model name
  }
);

module.exports = Category;