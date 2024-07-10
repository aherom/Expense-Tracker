const UserExpense = require('../module/Expenstable');
const ExpenseFile = require('../module/file');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

exports.download = async (req, res) => {
    try {
        const dataa = await UserExpense.findAndCountAll({
            where: { userUserid: req.user.userid }
        });

      
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

        
        await ExpenseFile.create({
            userIddata: req.user.userid, 
            fileUrl: fullFilePath
        });

       
        res.status(201).json({ fileUrl: `controler/filedata/${fileName}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
