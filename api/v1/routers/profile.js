const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken')
const {check,validationResult} = require('express-validator')
const moment = require("moment");
const e = require("express");
const userModel = require('../models/user');

// list
router.get('/me',[verifyToken], async (req, res) => {
 

  let id = req.decoded.userInfo.id
  let data = await userModel.getUserById(id)
  
   delete data.password

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Profile data.",
      data: data[0]
    });
  
});




module.exports = router;  