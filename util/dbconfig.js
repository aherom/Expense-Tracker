const Sequelize = require('sequelize');


const sequelize = new Sequelize('expense','root','ANE412410@om',
    {
           dialect:'mysql',
           host:'localhost'
    }
);

module.exports = sequelize;