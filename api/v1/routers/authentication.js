const express = require("express");
const router = express.Router();
const isEmpty = require("is-empty");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require("moment");
const {check,validationResult} = require('express-validator')
const keyData =  require('../jwt/config');
const userModel = require('../models/user');
const verifyToken = require('../middlewares/verifyToken')



// registration
router.post('/registration', [
    // Example body validations
    check('email').isEmail().withMessage('Please provide a valid email address'),
    check('password')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  async (req, res) => {
    // Handle the request only if there are no validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  

    // body data
    let reqData = {
            "email": req.body.email,
            "password":req.body.password,
          }

    
    let current_date = new Date(); 
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
    reqData.created_at = current_time;
    reqData.role_id = 1

 

    // this email check unique
    let existingByEmail = await userModel.getUserByEmail(reqData.email)
    if(!isEmpty(existingByEmail)){
        return res.status(409).send({
            "success": false,
            "status": 409,
            "message":"This email already exists."
       });
    }

  // password hashing
  reqData.password = bcrypt.hashSync(reqData.password,10)


   // save in database
   let result = await userModel.addNew(reqData);

   if (result.affectedRows == undefined || result.affectedRows < 1) {
        return res.status(500).send({
            "success": true,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    }

    return res.status(201).send({
        "success": true,
        "status": 201,
        "message": "Registration Successfully."
    });
});




//login
router.post('/login',async (req, res) => {

    // Body data
    let reqData = {
      "email": req.body.email,
      "password": req.body.password,
    }
  
    // Get user info
    let existingByUserInfo = await userModel.getUserByEmail(reqData.email);
    if (isEmpty(existingByUserInfo)) {
      return res.status(400).send({
        "success": false,
        "status": 400,
        "message": "This email does not match."
      });
    }
    
  
    // Check password
    const isPasswordValid = await bcrypt.compare(reqData.password, existingByUserInfo[0].password);
    if (!isPasswordValid) {
      return res.status(400).send({
        "success": false,
        "status": 400,
        "message": "Invalid password. Please try again with the correct password."
      });
    }


    // Create and sign a JWT token
    const token = jwt.sign({ userName : existingByUserInfo.name,userId: existingByUserInfo.id, email: existingByUserInfo.email },keyData.secretKey, {'expiresIn':'1h'});
  
    // Respond with the token
    return res.status(200).send({
      "success": true,
      "status": 200,
      "message": "Login Successfully.",
      "token": token
    });
  });



module.exports = router;  