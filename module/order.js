const Sequelize = require('sequelize');
const sequelize = require('../util/dbconfig');

const Order = sequelize.define('order',
    {
        orderid:{
            type:Sequelize.INTEGER,
            autoIncrement:true,
            allowNull:false,
            primaryKey:true
          },
        paymentid:Sequelize.STRING,
        pay_orderid:Sequelize.STRING,
        status: Sequelize.STRING 
    });

    module.exports = Order;