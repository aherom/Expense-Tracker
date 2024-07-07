const Userexpense = require('../module/Expenstable');
const User = require('../module/user');
const sequelize = require('../util/dbconfig');

exports.add = async (req, res) => {
    const { amount, description, category } = req.body;
    if (!category) {
        return res.status(400).send('Missing required field: category');
    }

    const transaction = await sequelize.transaction();

    try {
        console.log('Received request body:', req.body);

        if (amount) {
            const expense = await Userexpense.create({
                amount,
                description,
                category,
                userUserid: req.user.userid
            }, { transaction });

            const user = await User.findByPk(req.user.userid, { transaction });

            if (user) {
                // Update the total amount
                user.totalamount += parseInt(amount, 10);
                await user.save({ transaction });
            }

            await transaction.commit();
            res.status(201).send('Expense added successfully');
        } else {
            await transaction.rollback();
            res.status(400).send('Amount is required');
        }
    } catch (error) {
        await transaction.rollback();
        console.error('Error adding expense:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.history = async (req, res) => {
    try {
        const expenses = await Userexpense.findAll({ where: { userUserid: req.user.userid } });
        res.json(expenses);
    } catch (error) {
        console.error('Error fetching expense history:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.delete = async (req, res) => {
    const { id } = req.body;
    const transaction = await sequelize.transaction();
    
    try {
        // Fetch the expense to get the amount and user ID
        const expense = await Userexpense.findByPk(id, { transaction });
        
        if (!expense) {
            await transaction.rollback();
            return res.status(404).send('Expense not found');
        }

        const amount = expense.amount;
        const userId = expense.userUserid;

        // Delete the expense
        await Userexpense.destroy({ where: { id: id }, transaction });

        // Update user's total amount
        const user = await User.findByPk(userId, { transaction });
        
        if (user) {
            user.totalamount -= amount;
            await user.save({ transaction });
        }

        await transaction.commit();
        res.status(200).send('Expense deleted successfully');
    } catch (error) {
        await transaction.rollback();
        console.error('Error deleting expense:', error);
        res.status(500).send('Internal Server Error');
    }
};