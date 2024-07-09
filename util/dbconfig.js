
const Sequelize = require('sequelize');


const sequelize = new Sequelize(process.env.dtabasename,process.env.dbuser,process.env.dbpassword,
    {
           dialect:'mysql',
           host:process.env.dbhost
    }
);

module.exports = sequelize;