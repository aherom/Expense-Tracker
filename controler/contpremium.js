require('dotenv').config();
const jwt = require('jsonwebtoken');

const Order = require('../module/order');

const User = require('../module/user');

const Razorpay = require('razorpay');

exports.payment = async (req, res) => {
    try {
        console.log('Razorpay Key ID:', process.env.key_id);
        console.log('Razorpay Key Secret:', process.env.key_secret);

        var rzp = new Razorpay({
            key_id: process.env.key_id,
            key_secret: process.env.key_secret
        });

        const amount = 100; 

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
}



exports.success = async (req, res) => {
    const { payment_id, order_id } = req.body;

    try {
        const JWT_SECRET = 'your_secret_key';

        
        const order = await Order.findOne({ where: { pay_orderid: order_id } });
        if (!order) {
            return res.status(404).send('Order not found');
        }

       
        order.paymentid = payment_id;
        order.status = 'completed';
        await order.save();

       
        const user = await User.findByPk(order.userUserid);
        if (!user) {
            return res.status(404).send('User not found');
        }
        user.isPremium = true;
        await user.save();

     
        const token = jwt.sign({
            userid: user.userid,
            email: user.email,
            isPremium: user.isPremium
        }, JWT_SECRET);

       
        res.status(200).json({ message: 'Payment success and status updated', token: token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating payment status');
    }
}



exports.Leaderboard = async(req, res)=>{
    try {
        const leaderboardData = await User.findAll({
            attributes: [
              'name',
              'totalamount'
            ],
            order: [['totalamount', 'DESC']] // Order by total amount in descending order
          });
      return res.json(leaderboardData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }