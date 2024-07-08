const Sequelize = require('sequelize');
const sequelize = require('../util/dbconfig');

const Forgotpassword = sequelize.define('forgotpassword', {
    fpid: {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull: false,
        primaryKey: true
    },
    UserDetails:Sequelize.INTEGER,
    active: Sequelize.BOOLEAN,
    expiresby: Sequelize.DATE
})

module.exports = Forgotpassword;