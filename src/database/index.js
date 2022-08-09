const Sequelize = require("sequelize");
const dbConfig = require("../config/database");

// includes models
const User = require("../model/User");

const connection = new Sequelize(dbConfig);

// init Models
User.init(connection);

module.exports = connection;
