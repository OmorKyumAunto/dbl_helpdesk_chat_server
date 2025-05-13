const express = require("express");
const router = express.Router();
const userModel = require('../models/user');
const assetUnitModel = require('../models/asset-unit');
const verifyToken = require('../middlewares/verifyToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');
const assetModel = require("../models/asset");

require('dotenv').config();

// total list
router.get(
    "/asset-report",
    [verifyToken, routeAccessChecker("assetReportList")],
    async (req, res) => {

    const reqData = {
        unit : req.query.unit,
        start_date : req.query.start_date,
        end_date : req.query.end_date,
        category : req.query.category,
        remarks : req.query.remarks,
    }
    const {unit,start_date,end_date,category,remarks} = reqData
      let result = await assetModel.assetReport(unit,start_date,end_date,category,remarks);

      return res.status(200).send({
        success: true,
        status: 200,
        message: "Asset Report List.",
        count: result.length,
        data: result,
      });
    }
  );


  


module.exports = router;