const { authenticateToken } = require('../middleware/auth');

const express = require('express');

const contexpense = require('../controler/contpremium');

const router = express.Router();

router.use('/payment', authenticateToken,contexpense.payment );

router.use('/success', authenticateToken,contexpense.success);
module.exports=router;