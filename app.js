require('dotenv').config();

const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const Razorpay = require('razorpay');
const sequelize = require('./util/dbconfig');

const User = require('./module/user');
const UserExpense = require('./module/Expenstable');
const Order = require('./module/order');
const { authenticateToken } = require('./middleware/auth');

const signup = require('./router/signup');
const login = require('./router/login');
const expense = require('./router/expenese');

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

app.get('/Premium/payment', authenticateToken, async (req, res) => {
    try {
        console.log('Razorpay Key ID:', process.env.key_id);
        console.log('Razorpay Key Secret:', process.env.key_secret);

        var rzp = new Razorpay({
            key_id: process.env.key_id,
            key_secret: process.env.key_secret
        });

        const amount = 100; // amount in paise (₹1.00)

        rzp.orders.create({ amount, currency: "INR" }, async (error, order) => {
            if (error) {
                throw new Error(JSON.stringify(error));
            }

            await Order.create({
                pay_orderid: order.id,
                status: 'pending',
                userUserid: req.user.userid
            });

            res.status(200).json({order,key_id:rzp.key_id});
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

app.post('/Premium/success', authenticateToken, async (req, res) => {
    const { payment_id, order_id } = req.body;

    try {
        const order = await Order.findOne({ where: { pay_orderid: order_id } });
        if (!order) {
            return res.status(404).send('Order not found');
        }

        order.paymentid = payment_id;
        order.status = 'completed';
        await order.save();

        res.status(200).send('Payment success and status updated');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating payment status');
    }
});

app.get('/', signup);

sequelize.sync();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
