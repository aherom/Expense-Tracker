const express = require('express');
const router = express.Router();
const contsignup = require('../controler/contsignup')


router.use('/Signup',contsignup.filecheck);

 router.use(contsignup.filesignup);

    module.exports=router;