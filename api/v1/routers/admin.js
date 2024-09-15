const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const adminModel = require('../models/admins ');
const userModel = require('../models/user');
const assetUnitModel = require('../models/asset-unit');
const verifyToken = require('../middlewares/verifyToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');
const moment = require("moment");
require('dotenv').config();

router.get('/list',[verifyToken, routeAccessChecker("adminList")],async (req, res) => {

    let reqData = {
      "limit": req.query.limit || 50,
      "offset": req.query.offset || 0,
      "key": req.query.key,
      "unit_name": req.query.unit_name,
  }
   let { offset, limit , key, unit_name}  = reqData;
  
  
  
      let result = await userModel.getEmployeeList(offset, limit, key, unit_name);
  
      let countResult = await userModel.getTotalEmployeeList(key, unit_name);
  
      return res.status(200).send({
        success: true,
        status: 200,
        message: "Employee List.",
        total: countResult.length,
        data: result
      });
  
  });
  






module.exports = router;