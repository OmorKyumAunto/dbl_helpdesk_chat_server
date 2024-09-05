const express = require("express");
const router = express.Router();
const isEmpty = require("is-empty");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require("moment");
const {check,validationResult} = require('express-validator')
const keyData =  require('../jwt/config');
const userModel = require('../models/user');
const superAdminModel = require('../models/super-admins');
const roleModel = require('../models/role');
const adminModel = require('../models/admins ');
const employeeModel = require('../models/employee');
const verifyToken = require('../middlewares/verifyToken')
const { v4: uuidv4 } = require("uuid");
const commonObject = require("../common/common");

// registration
// router.post('/registration', [
//     // Example body validations
//     check('email').isEmail().withMessage('Please provide a valid email address'),
//     check('password')
//       .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
//   ],
//   async (req, res) => {
//     // Handle the request only if there are no validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
  

//     // body data
//     let reqData = {
//             "email": req.body.email,
//             "password":req.body.password,
//           }

    
//     let current_date = new Date(); 
//     let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
//     reqData.created_at = current_time;
//     reqData.role_id = 1

 

//     // this email check unique
//     let existingByEmail = await userModel.getUserByEmail(reqData.email)
//     if(!isEmpty(existingByEmail)){
//         return res.status(409).send({
//             "success": false,
//             "status": 409,
//             "message":"This email already exists."
//        });
//     }

//   // password hashing
//   reqData.password = bcrypt.hashSync(reqData.password,10)


//    // save in database
//    let result = await userModel.addNew(reqData);

//    if (result.affectedRows == undefined || result.affectedRows < 1) {
//         return res.status(500).send({
//             "success": true,
//             "status": 500,
//             "message": "Something Wrong in system database."
//         });
//     }

//     return res.status(201).send({
//         "success": true,
//         "status": 201,
//         "message": "Registration Successfully."
//     });
// });

router.post("/login", async (req, res) => {

  let loginData = {
      password: req.body.password,
      id: req.body.id,
      // email: req.body.email, // or email
  };

  let errorMessage = "";
  let isError = 0;

  // Check phone validation
  if (loginData.id === undefined || isEmpty(loginData.id)) {
      isError = 1;
      errorMessage += "Give valid phone number.";
  }

  try {
      loginData.id = loginData.id.trim();
  } catch (error) { }

  // phone validation
  if (isEmpty(loginData.id)) {
      isError = 1;
      errorMessage += "Id should not empty.";
  }


  // Check Password Validation
  if (loginData.password == undefined || loginData.password.length < 6) {
      isError = 1;
      errorMessage += "Give valid password.";
  } else if (typeof loginData.password === "number") {
      loginData.password = loginData.password.toString();
  }

  if (isError == 1) {
      return res.status(400).send({
          success: false,
          status: 400,
          message: errorMessage,
      });
  }

  // Get User data from user table.
  let userData = await userModel.getUserByEmployeeId(loginData.id);

  console.log("first",userData[0])

  if (isEmpty(userData[0]) || userData[0].status == 0 || !(userData[0].employee_id == loginData.id)) {
      return res.status(404).send({
          success: false,
          status: 404,
          message: "No user found.",
      });
  } else if (userData[0].status == 2) {
      return res.status(404).send({
          success: false,
          status: 404,
          message: "You can't login as your account is disable now.",
      });
  }


  // Check Password
  if (bcrypt.compareSync(loginData.password, userData[0].password)) {
      let profileData = {};

      //Check Role
      let roleData = await roleModel.getById(userData[0].role_id);
  
      if (isEmpty(roleData)) {
          return res.status(404).send({
              success: false,
              status: 404,
              message: " Unknown User role.",
          });
      }



      if (userData[0].role_id == 1) {

          profileInfo = await superAdminModel.getById(userData[0].profile_id);

      } else if (userData[0].role_id == 2) {
          // profileInfo = await adminModel.getById(userData[0].profile_id);
          profileInfo = await adminModel.getById(userData[0].profile_id);

         
      } else if (userData[0].role_id == 3) {

          profileInfo = await employeeModel.getById(userData[0].profile_id);
       
      }else {
          return res.status(404).send({
              success: false,
              status: 404,
              message: "No user found.",
          });
      }

      if (isEmpty(profileInfo)) {
          return res.status(404).send({
              success: false,
              status: 404,
              message: "Unknown User.",
          });
      } else {
          for (let index = 0; index < profileInfo.length; index++) {
              if (profileInfo[index].role_id == userData[0].role_id) {
                  profileInfo = [profileInfo[index]];
                  delete profileInfo[0].role_id;
                  break;
              }
          }
      }

      // get device info
      let uuid = uuidv4();
      delete profileInfo[0].id;

      // Generate profile data

      hashId = await commonObject.hashingUsingCrypto(userData[0].id.toString());
      profileData.api_token = hashId;

      profileData.email = userData[0].email;
      profileData.employee_id = userData[0].employee_id;
      profileData.role = {
          role_id: roleData[0].id,
          role_name: roleData[0].title,
      };

      profileData.profile = profileInfo[0];
      profileData.time_period = Date.now() + 3600000;
      profileData.identity_id = uuid;

      //  "Generate Token"
      let token = jwt.sign(profileData, global.config.secretKey, {
          algorithm: global.config.algorithm,
          expiresIn: global.config.expiresIn, // one day
      });

      delete profileData.api_token;
      delete profileData.time_period;
      delete profileData.identity_id; // device track id
      profileData.token = token;

      // // Save user identity in login-tracker
      // let dateTimeToday = await Date.now();
      // let dateToday = await commonObject.getCustomDate(dateTimeToday);

      // let loginTrackerData = {
      //     user_id: userData[0].id,
      //     jwt_token: token,
      //     login_device_info: JSON.stringify(deviceInfo),
      //     uuid: uuid,
      //     created_at: dateTimeToday,
      //     updated_at: dateTimeToday,
      //     created_by: userData[0].id,
      //     updated_by: userData[0].id,
      // };

      // profileData.id = userData[0].id; //  frontend requested, we send user id in response.
      // profileData.imageFolderPath = imageFolderPath;


      // loginTrackModel.addNewLoggingTracker(loginTrackerData);

      return res.status(200).send({
          success: true,
          message: "Welcome to the system.",
          data: profileData,
      });
  } else {
      return res.status(401).send({
          status: 401,
          success: false,
          message: "Wrong Password",
      });
  }
});



//login
// router.post('/login',async (req, res) => {

//     // Body data
//     let reqData = {
//       "email": req.body.email,
//       "password": req.body.password,
//     }
  
//     // Get user info
//     let existingByUserInfo = await userModel.getUserByEmail(reqData.email);
//     if (isEmpty(existingByUserInfo)) {
//       return res.status(400).send({
//         "success": false,
//         "status": 400,
//         "message": "This email does not match."
//       });
//     }
    

//     // Check password
//     const isPasswordValid = await bcrypt.compare(reqData.password, existingByUserInfo[0].password);
//     if (!isPasswordValid) {
//       return res.status(400).send({
//         "success": false,
//         "status": 400,
//         "message": "Invalid password. Please try again with the correct password."
//       });
//     }


//     // Create and sign a JWT token
//     const token = jwt.sign({ userName : existingByUserInfo[0].name,employee_id:existingByUserInfo[0].employee_id, id: existingByUserInfo[0].id, role_id: existingByUserInfo[0].role_id,email: existingByUserInfo[0].email },keyData.secretKey, {'expiresIn':'12h'});

//     // Respond with the token
//     return res.status(200).send({
//       "success": true,
//       "status": 200,
//       "message": "Login Successfully.",
//       "token": token
//     });
//   });



module.exports = router;  