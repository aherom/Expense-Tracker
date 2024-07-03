const express = require('express');
const router = express.Router();
const contlogin = require('../controler/contlogin')
router.use('/login',contlogin.login);
module.exports=router;