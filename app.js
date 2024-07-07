require('dotenv').config();


const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const  Sequelize = require('sequelize');

const sequelize = require('./util/dbconfig');
const User = require('./module/user');
const UserExpense = require('./module/Expenstable');
const Order = require('./module/order');
const { authenticateToken } = require('./middleware/auth');

const signup = require('./router/signup');
const login = require('./router/login');
const expense = require('./router/expenese');
const premium = require('./router/premium')

const app = express();

User.hasMany(UserExpense);
UserExpense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use(express.static(path.join(__dirname, 'view')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', login);
app.use('/user', signup);
app.use('/expense', expense);
app.use('/Premium',premium);
  
app.get('/', signup);

sequelize.sync();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
