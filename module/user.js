const Sequelize = require('sequelize');
const sequelize = require('../util/dbconfig');

const User = sequelize.define('user',
    {
        userid:{
             type:Sequelize.INTEGER,
             autoIncrement:true,
             allowNull:false,
             primaryKey:true
           },

        name:{
                 type:Sequelize.STRING,
                 allowNull:false,
                
        },
        email:{
                  type:Sequelize.STRING,
                  allowNull:false
              },

        password:{
                     type:Sequelize.STRING,
                    allowNull:false
                 }      
    }
);

module.exports=User;