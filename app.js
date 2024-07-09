require('dotenv').config();


const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const  Sequelize = require('sequelize');
const moment = require('moment');
const fs = require('fs');
const helmet = require('helmet');
const morgan = require('morgan');


const sequelize = require('./util/dbconfig');
const User = require('./module/user');
const UserExpense = require('./module/Expenstable');
const Order = require('./module/order');
const Forgotpassword = require('./module/forgotpassword')
const ExpenseFile = require('./module/file')

const { authenticateToken } = require('./middleware/auth');

const signup = require('./router/signup');
const login = require('./router/login');
const expense = require('./router/expenese');
const premium = require('./router/premium')
const password = require('./router/password');
const download = require('./router/download')
const app = express();

User.hasMany(UserExpense);
UserExpense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'view')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'filedata')));

app.use('/user', login);
app.use('/user', signup);
app.use('/expense', expense);
app.use('/Premium',premium);
app.use('/password',password);
app.use('/reset',password);

app.use('/download', authenticateToken,download );


app.get('/', signup);

sequelize.sync();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});