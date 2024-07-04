const Sequelize = require('sequelize');


const sequelize = new Sequelize('expense','root','S3cure#1',
    {
           dialect:'mysql',
           host:'localhost'
    }
);

module.exports = sequelize;