const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');

const signup = require('./router/signup')
const app = express();

app.use(bodyparser.urlencoded({extended:false}));

app.use('/user',signup);

app.get('/',signup);



app.listen(3000);