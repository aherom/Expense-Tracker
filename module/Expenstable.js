const Sequelize = require('sequelize');
const sequelize = require('../util/dbconfig');

const Userexpense = sequelize.define('userexpenes',
    {
        id:{
              type:Sequelize.INTEGER,
              autoIncrement:true,
              allowNull:false,
              primaryKey:true
           },

         amount:{
            type:Sequelize.INTEGER,
            allowNull:false
           },
           
         category:{
            type:Sequelize.STRING,
            allowNull:false
         },


         description:{
            type:Sequelize.STRING,
            allowNull:false
         }
    }

);

module.exports=Userexpense;