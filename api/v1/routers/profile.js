const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken')
const {check,validationResult} = require('express-validator')
const moment = require("moment");
const e = require("express");
const employeeModel = require('../models/employee');



// list
router.get('/me', verifyToken, async (req, res) => {

   let id = 1
  let data = await employeeModel.me(id)
  
    return res.status(200).send({
      success: false,
      status: 200,
      message: "Profile data.",
      data: data[0]
    });
  
});




module.exports = router;  