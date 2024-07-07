const express = require('express');

const router = express.Router();

const { authenticateToken } = require('../middleware/auth');

const contexpense = require('../controler/contexpense');

router.use('/add',authenticateToken,contexpense.add);
router.use('/history',authenticateToken,contexpense.history);
router.use('/delete',authenticateToken,contexpense.delete );


module.exports=router;
