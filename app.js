const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');

const sequelize = require('./util/dbconfig');
const user = require('./module/user');
const signup = require('./router/signup');
const login = require('./router/login')

const app = express();

app.use(bodyparser.urlencoded({extended:false}));

app.use(bodyparser.json());

app.use(express.static(path.join(__dirname,'view')));

app.use(express.static(path.join(__dirname,'public')));

app.use('/user',login);

app.use('/user',signup);

app.get('/',signup);

sequelize.sync();

app.listen(3000);