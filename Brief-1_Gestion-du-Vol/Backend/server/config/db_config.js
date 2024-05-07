const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize with your database connection details
const sequelize = new Sequelize('vol_management', 'root', '', {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',
  
});

exports.sequelize = sequelize;