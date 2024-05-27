const dbInstance = require('@/database/db');
const { DataTypes, Model } = require('sequelize');

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true 
        }
    },
    password: DataTypes.STRING,
    confirmed: {type: DataTypes.BOOLEAN, defaultValue: false,},
  }, 
  { 
    sequelize: dbInstance(), 
    modelName: 'User', 
    // defaultScope: {
    //   attributes: { exclude: ['password'] },
    // },
    scopes: {
      withPassword: {
        attributes: {},
      },
    },
  }
);

User.prototype.toJSON =  function () {
  var values = Object.assign({}, this.get());

  delete values.password;
  return values;
}

module.exports = User;