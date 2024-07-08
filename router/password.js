const express = require('express');
const router = express.Router();

const contpassword = require('../controler/contpassword');

router.use('/forgotpassword',contpassword.forgotpassword);
 
router.use('/password/:id',contpassword.password);

router.use('/updatepassword/:id',contpassword.updatepassword);

module.exports=router;