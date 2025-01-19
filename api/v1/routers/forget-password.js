const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const forgetPasswordModel = require('../models/forget-password');
const userModel = require('../models/user');
const common = require('../common/common');
const jwt = require('jsonwebtoken');
const resetPassTokenVerify = require('../middlewares/forgetPasswordToken');
const bcrypt = require('bcrypt');
require('dotenv').config();



router.post('/send-otp', async (req, res) => {

    let email =  req.body.email

    let existingEmail = await userModel.getUserByEmail(email);
    if (!existingEmail.length) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "This email not register.",

        });
    }

   let otp = await common.rendomGenerator()

   let otpData = {
     user_id : existingEmail[0].id,
     otp : otp
   }

   let emailData = {
   name : existingEmail[0].name,
    otp : otp
  }
   let result = await forgetPasswordModel.addNew(otpData);

    await common.forgetPasswordSendOtp(email, 'Password Reset Request', emailData );

    if (result.affectedRows == undefined || result.affectedRows < 1) {
        return res.status(500).send({
            "success": false,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    }

    return res.status(201).send({
        "success": true,
        "status": 201,
        "message": "Successfully send email otp.Please check your email.",
        "data" : {
            email : email
        }
    });

});


router.post('/verify-otp', async (req, res) => {

    let reqData =  {
        email : req.body.email,
        otp : parseInt(req.body.otp)
    }

    let existingEmail = await userModel.getUserByEmail(reqData.email);
    if (!existingEmail.length) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "This email not register.",

        });
    }

    let getRecentOtp = await forgetPasswordModel.getRecentOtp(existingEmail[0].id)

    if(getRecentOtp[0].is_matched === 1){
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "This otp already used.",

        });
    }

    if(getRecentOtp[0].otp !== reqData.otp){
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Invalid Otp.",

        });
    }

    let data = {
        id : existingEmail[0].id,
    }

    let token = jwt.sign(data, global.config.forgetPasswordSecretKey, {
        algorithm: global.config.algorithm,
        expiresIn: global.config.forgetPasswordExpiresIn, // 10 min
    });
    
   let result = await forgetPasswordModel.updateById(existingEmail[0].id,{is_matched : 1});

  //  await common.forgetPasswordSendOtp(email, 'Password Reset Request', emailData );

    if (result.affectedRows == undefined || result.affectedRows < 1) {
        return res.status(500).send({
            "success": false,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    }

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Successfully matched your otp.",
        "data" : {token : token}
    });

});


router.post('/reset-password',[resetPassTokenVerify], async (req, res) => {

    let id = req.decodedInfo.id
    let reqData = {
        newPassword : req.body.newPassword,
        confirmPassword : req.body.confirmPassword,
    }

    if (!reqData.newPassword) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "New password can not be empty.",

        });
    }

    if (!reqData.confirmPassword) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Confirm password can not be empty.",


        });
    }

    let existingEmail = await userModel.getById(id);
    if (!existingEmail.length) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "This email not register.",

        });
    }
 
    if (reqData.newPassword !== reqData.confirmPassword) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "New password and confirm password are not same.",

        });
    }

   let password = bcrypt.hashSync(reqData.newPassword.toString(), 10);
   let result = await userModel.updateById(id,{password : password});

    await common.passwordResetSuccessful(existingEmail[0].email, 'Password Reset Completed', existingEmail[0].name );

    if (result.affectedRows == undefined || result.affectedRows < 1) {
        return res.status(500).send({
            "success": false,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    }

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Successfully change successfully.",
    });

});

module.exports = router;