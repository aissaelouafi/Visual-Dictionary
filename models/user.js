// Require all the stuff
var Sequelize = require('sequelize');
var config = require('../config/config')
var bcrypt = require('bcrypt-nodejs')

// Setup sequelize db connection
var sequelize = new Sequelize(config.database);

// A helper to define the User model with username, password fields
var User = sequelize.define('user',{
  id : {
    type : Sequelize.INTEGER,
    allowNull : false,
    unique: true,
    primaryKey : true
  },
  username : {
    type : Sequelize.STRING,
    unique : true,
    allowNull : false
  },
  password : {
    type : Sequelize.STRING,
  }
})

// User.sync();
// var user = User.create({id:1,username: "admin",password: "admin"});
module.exports = User;
