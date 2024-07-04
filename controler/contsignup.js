const path = require('path');
const user = require('../module/user');

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

    const newData = await user.create({
      name: name,
      email: email,
      password: password
    });

    console.log(newData);
    res.status(400).send('Record Created Successfully');

  } catch (error) {
    console.log(error);
    res.status(500).send('Error processing request');
  }
};
