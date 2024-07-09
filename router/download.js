const express = require('express');
const router = express.Router();

const countdownload =  require('../controler/contdownload')
const { authenticateToken } = require('../middleware/auth',);

router.use('/',authenticateToken,countdownload.download);
module.exports=router;