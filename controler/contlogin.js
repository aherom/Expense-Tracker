const user = require('../module/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Secret key for JWT
const JWT_SECRET = 'your_secret_key'; // Replace with your actual secret key

exports.login = async (req, res) => {
  try {
     
    const { email, password } = req.body;

    const userRecord = await user.findOne({ where: { email: email } });

    if (!userRecord) {
      return res.status(400).send('Email id does not exist');
    }

    const passwordMatch = await bcrypt.compare(password, userRecord.password);

    if (!passwordMatch) {
      console.log('Incorrect password');
      return res.status(401).send('Incorrect password');
    }
         
    const token = jwt.sign({ 
      userid: userRecord.userid, 
      email: userRecord.email, 
      isPremium: userRecord.isPremium 
    }, JWT_SECRET);
    
    console.log(userRecord.id);
    res.status(200).json({ message: 'Login successful', token: token });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error processing request');
  }
};
