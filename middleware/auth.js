const jwt = require('jsonwebtoken');
const User = require('../module/user');

const JWT_SECRET = 'your_secret_key';

const authenticateToken =  (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).send('Access Denied');
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;

    
     User.findByPk(req.user.userid)
     .then(next());
    
    
  } catch (error) {
    console.error('Error:', error);
    res.status(400).send('Invalid Token');
  }
};

module.exports = { authenticateToken };
