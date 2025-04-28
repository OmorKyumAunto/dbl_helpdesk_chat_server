const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");
const { routeAccessChecker } = require("../middlewares/routeAccess");
const moment = require("moment");
const zingHrOperationModel = require("../models/zingHr-operations");
require("dotenv").config();

router.get(
  "/",
  [verifyToken, routeAccessChecker("ZingHrSyncHistoryGet")],
  async (req, res) => {
    let reqData = {
      limit: req.query.limit || 30,
      offset: req.query.offset || 0,
      status: req.query.status,
      operation_method: req.query.operation_method,
      from_date : req.query.from_date,
      to_date : req.query.to_date,
    };

    let { offset, limit, status, operation_method, from_date, to_date } = reqData;
    // Fetch employee list and total employee count
    let result = await zingHrOperationModel.zingHrOperationHistory(offset, limit, status, operation_method, from_date, to_date);
    let countResult = await zingHrOperationModel.zingHrOperationHistoryCount(status, operation_method, from_date, to_date);

    // Return the response
    return res.status(200).send({
      success: true,
      status: 200,
      message: "Zing Hr operation History.",
      total: countResult.length,
      data: result,
    });
  }
);



module.exports = router;
