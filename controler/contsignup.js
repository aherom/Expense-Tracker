const path = require('path');

exports.filesignup=(req,res)=>
    {
        res.sendFile(path.join(__dirname,'..','view','Signup.html'));  
    }

exports.filecheck=(req,res)=>
    {
            console.log(req.body);
    }