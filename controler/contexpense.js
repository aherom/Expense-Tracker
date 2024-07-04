const Userexpense = require('../module/Expenstable');

exports.add = async (req,res)=>
    {
        
        const { amount, description, category } = req.body;
        console.log(amount,description,category);
        if (!category) {
            return res.status(400).send('Missing required field: category');
          }
        
          console.log('Received request body:', req.body);
    
        if(amount){
            await Userexpense.create({
                amount,
                description,
                category,
                userUserid: req.user.userid
              })
    }
    
        res.status(201).send('Expense added successfully');
    }



exports.history = async(req,res)=>
    { 
        try {
            const expenses = await Userexpense.findAll({where:{userUserid:req.user.userid}});
            res.json(expenses);
        } catch (error) {
            console.error('Error fetching expense history:', error);
            res.status(500).send('Internal Server Error');
        }
    }  

exports.delete = async (req, res) => {
    const { id } = req.body;
    try {
        await Userexpense.destroy({ where: { id: id } });
        res.status(200).send('Expense deleted successfully');
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).send('Internal Server Error');
    }
}    