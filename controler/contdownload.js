const UserExpense = require('../module/Expenstable');
const ExpenseFile = require('../module/file');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

exports.download = async (req, res) => {
    try {
        // Query expenses for the user
        const data = await UserExpense.findAll({
            where: { userUserid: req.user.userid }
        });

        // Prepare CSV content
        const csvData = data.map(expense => {
            return `${expense.createdAt.toDateString()},${expense.amount},${expense.category},${expense.description}`;
        }).join('\n');

        // Generate unique filename
        const fileName = `expenses_${moment().format('YYYYMMDD_HHmmss')}.csv`;
        const filePath = path.join(__dirname, 'filedata', fileName);

        // Write CSV content to file
        fs.writeFileSync(filePath, csvData);

        // Save file info to database (if needed)
        await ExpenseFile.create({
            userIddata: req.user.userid,
            fileUrl: filePath // Store the full path, adjust as per your file storage setup
        });

        // Send response with file URL
        res.status(200).json({ expenses: data }); // Adjust URL as per your server setup
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
