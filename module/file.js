const Sequelize = require('sequelize');
const sequelize = require('../util/dbconfig');

const ExpenseFile = sequelize.define('ExpenseFile', {  // Use 'ExpenseFile' for clarity
  userIddata: { 
    type: Sequelize.INTEGER,
    allowNull: false,
    
  },
  fileUrl: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = ExpenseFile;
