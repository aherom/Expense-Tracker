const user = require('../module/user');

exports.login = async(req,res)=>
    {
        console.log(req.body);
       const respons = await user.findOne({where:{email:req.body.email}});

          if(!respons)
                      res.status(400).send('Email id not exist');

          else  if (respons.password !== req.body.password) { 
            console.log('Incorrect password');
            res.status(401).send('Incorrect password');
        } else {
            console.log(respons.id);
            res.status(200).send('Login successful');
        }
                      
        
    }

