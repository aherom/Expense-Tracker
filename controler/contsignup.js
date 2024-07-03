const path = require('path');
const user = require('../module/user');

exports.filesignup = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'view', 'Signup.html'));
};

exports.filecheck = (req, res) => {
  console.log(req.body); 
  const { name, email, password } = req.body;

  if (!email) {
    return res.status(400).send('Email is required');
  }

  user.findOne({
    where: { email: email }
  }).then(record => {
    if (record) {
      res.json({ exists: true, email: email });
    } else {
      // Create a new record 
      user.create({
        name: name,
        email: email,
        password: password
      }).then(data => {
        console.log(data);
        res.send('<h1>Record Created Successfully</h1>');
      }).catch(error => {
        console.log(error);
        res.status(500).send('Error creating record');
      });
    }
  }).catch(error => {
    console.log(error);
    res.status(500).send('Error finding record');
  });
};
