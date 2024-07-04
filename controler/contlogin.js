const user = require('../module/user');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  try {
    console.log(req.body);
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

    console.log(userRecord.id);
    res.status(200).send('Login successful');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error processing request');
  }
};
