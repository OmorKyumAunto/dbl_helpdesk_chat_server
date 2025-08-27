const express = require("express");
const router = express.Router();
const isEmpty = require("is-empty");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const superAdminModel = require("../models/super-admins");
const roleModel = require("../models/role");
const adminModel = require("../models/admins ");
const employeeModel = require("../models/employee");
const loginModel = require("../models/login");
const unitSuperAdminModel = require("../models/unit-super-admin");
const {current_time} = require("../validation/task/task");
const { v4: uuidv4 } = require("uuid");
const commonObject = require("../common/common");


// function getClientIp(req) {
//   return (
//     req.headers['x-forwarded-for']?.split(',')[0] || // if behind proxy
//     req.connection?.remoteAddress ||                 // default fallback
//     req.socket?.remoteAddress ||                     // another fallback
//     req.connection?.socket?.remoteAddress ||        // older Node versions
//     'IP not found'
//   );
// }

// user login
router.post("/login", async (req, res) => {
  let loginData = {
    id: req.body.id,
    password: req.body.password,
    platform: req.body.platform,
    device_token: req.body.device_token,
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
  } catch (error) {}

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

  if (
    isEmpty(userData[0]) ||
    userData[0].status == 0 ||
    !(userData[0].employee_id == loginData.id)
  ) {
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
      profileInfo = await adminModel.getById(userData[0].profile_id);
    } else if (userData[0].role_id == 3) {
      profileInfo = await employeeModel.getById(userData[0].profile_id);
    }else if (userData[0].role_id == 4) {
      profileInfo = await unitSuperAdminModel.getById(userData[0].profile_id);
    } else {
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
    delete profileData.identity_id;
    profileData.token = token;
// console.log("data==>",getClientIp())
 const deviceInfo = {
    browser: req.useragent.browser,
    version: req.useragent.version,
    os: req.useragent.os,
    platform: req.useragent.platform,
    source: req.useragent.source, // full user-agent string
    ip: req.headers["x-forwarded-for"] || 'ip not found',
  };
  console.log("device info : ===>",deviceInfo);
    const login_data = {
      user_id : userData[0].id,
      platform : loginData.platform,
      device_info : deviceInfo,
      is_active : true,
      device_token : loginData.device_token,
      login_token : token,
      login_at : current_time
    }
  console.log("login_data info : ===>", login_data);

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

module.exports = router;
