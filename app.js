require('dotenv').config();

const nodemailer = require('nodemailer');
const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const  Sequelize = require('sequelize');
const moment = require('moment');
const fs = require('fs');

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
app.use('/password',password);
app.use('/reset',password);

app.use('/download', authenticateToken, async (req, res) => {
    try {
        const dataa = await UserExpense.findAndCountAll({
            where: { userUserid: req.user.userid }
        });

        console.log(dataa);

        const filedataPath = path.join(__dirname, 'filedata');
        if (!fs.existsSync(filedataPath)) {
            fs.mkdirSync(filedataPath, { recursive: true });
        }

        const fileName = `expenses_${moment().format('YYYYMMDD_HHmmss')}.csv`;
        const fullFilePath = path.join(filedataPath, fileName);

        const csvData = dataa.rows.map(expense => {
            return `${expense.createdAt.toDateString().split("GMT+0530")[0]},${expense.amount},${expense.category},${expense.description}`;

        }).join('\n');

        fs.writeFileSync(fullFilePath, csvData);

        
        const filePath = `D:\\MEAN\\Expense-Tracker\\filedata\\${fileName}`;  // Double backslashes for Windows path
             await ExpenseFile.create({
                userIddata: req.user.userid, // Use camelCase for consistency
                fileUrl: filePath
                 });

                 res.status(201).json({ fileUrl: `/filedata/${fileName}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.get('/', signup);

sequelize.sync();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
