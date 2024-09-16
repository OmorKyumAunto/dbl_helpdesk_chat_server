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
      "unit": req.query.unit,
  }
   let { offset, limit , key, unit}  = reqData;
  
  
  
      let result = await userModel.getEmployeeAdminList(offset, limit, key, unit);
  
      let countResult = await userModel.getTotalEmployeeAdminList(key, unit);
  
      return res.status(200).send({
        success: true,
        status: 200,
        message: "Admin List.",
        total: countResult.length,
        data: result
      });
  
  });
  






module.exports = router;