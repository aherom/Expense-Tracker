const path = require('path');
const user = require('../module/user');
const bcrypt = require('bcrypt');
exports.filesignup = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'view', 'Signup.html'));
};

exports.filecheck = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;

    if (!email) {
      return res.status(400).send('Email is required');
    }

    const record = await user.findOne({ where: { email: email } });

    if (record) {
      return res.status(400).send(`${email} all ready exist `);
    }
    const hashPassword = await bcrypt.hash(password,10);
    const newData = await user.create({
      name: name,
      email: email,
      password: hashPassword
    });

    console.log(newData);
    res.status(400).send('Record Created Successfully');

  } catch (error) {
    console.log(error);
    res.status(500).send('Error processing request');
  }
};
