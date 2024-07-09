require('dotenv').config();
const express = require('express');
const User = require('../module/user');
const Forgotpassword = require('../module/forgotpassword');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
 exports.forgotpassword = async(req, res) => {
    // console.log(req.body.email);
 
     const userRecord = await User.findOne({ where: { email:req.body.email } });
 
   if(userRecord){
 
      const sampleData = {
         UserDetails: userRecord.userid, // Use the generated UUID
         active: true, // Set active to true
         expiresby: new Date(Date.now() +300 * 1000), // Set expiry 24 hours from now
        };
 
         await Forgotpassword.create(sampleData);
          const transporter = nodemailer.createTransport({
           service: 'gmail',
           auth: {
              user: 'mitlab104@gmail.com', 
              pass:  process.env.pass 
              }
    });
 
     const mailOptions = {
         from: 'mitlab104@gmail.com',
         to: req.body.email,
         subject: 'Password Reset Request',
         text: 'This is a password reset request message.',
         html: `<a href="http://3.26.217.185:3000/reset/password/${userRecord.userid}">Reset password</a>`,
     };
 
     transporter.sendMail(mailOptions, (error, info) => {
         if (error) {
             console.log(error);
             res.status(500).send('Error sending email');
         } else {
             console.log('Email sent: ' + info.response);
             res.status(200).send('Email sent');
         }
     });
 }//if
 }


 exports.password = async (req, res) => {
    // console.log(req.params); // This will log { id: '1' }
 
    try { 
    const fordata= await Forgotpassword.findOne({ where : {UserDetails:req.params.id}});
    fordata.update({ active: false});
   // console.log(fordata);
    res.status(200).send(`<html>
     <script>
         function formsubmitted(e){
             e.preventDefault();
             console.log('called')
         }
     </script>
 
     <form action="/password/updatepassword/${fordata.UserDetails}" method="POST">
         <label for="newpassword">Enter New password</label>
         <input name="newpassword" type="password" required></input>
         <button>reset password</button>
     </form>
 </html>`
    
 )
 
 res.end()
    }
    catch (error) {
     console.error(error);
     res.status(500).send('An error occurred while resetting the password.');
 }
   }


   exports.updatepassword = async(req,res)=>{

    try {
    const fordata= await Forgotpassword.findOne({ where : {UserDetails:req.params.id ,active:false}});
     // console.log(req.params);
      //console.log(req.body.newpassword);
      
      const hashPassword = await bcrypt.hash(req.body.newpassword,10);
      const uurr = await User.findOne({wher:{userid:req.params.id}});
      uurr.update({password: hashPassword});
      //console.log(uurr);
      Forgotpassword.destroy({where:{UserDetails:req.params.id}});
      res.send('<h1>Password updated</h1>');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while updating the password.');
    }
  }
