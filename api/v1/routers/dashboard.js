const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken')
const {check,validationResult} = require('express-validator')
const moment = require("moment");
const e = require("express");
const employeeModel = require('../models/employee');
const assetModel = require('../models/asset');



// list
router.get('/dashboard-data', async (req, res) => {

  let data = await assetModel.getListOfDashboard()
  let data2 = await assetModel.getListOfDashboard2()
  let data3 = await assetModel.getListOfDashboard3()

  let result = {
    total_asset : data[0].total_asset,
    total_employee : data2[0].total_employee,
    total_assign_asset : data3[0].total_assign_asset,
  }

    return res.status(200).send({
      success: false,
      status: 200,
      message: "Dashboard data.",
      data: result
    });
  
});

router.get('/dashboard-graph-data', async (req, res) => {
  try {
    let resultAssign = await assetModel.getListOfDashboardGraph();
    let resultTotal = await assetModel.getListOfDashboardGraph2();

    // Initialize an array with all months set to 0
    let data = [];
    const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-based
    for (let i = 0; i < 12; i++) {
      const month = (currentMonth - i + 12) % 12 || 12;
      data.push({ 
        month: month.toString(), 
        total_assign_asset: 0, 
        total_asset: 0 
      });
    }

    // Populate the array with total_assign_asset data
    resultAssign.forEach(item => {
      const monthIndex = data.findIndex(d => d.month === item.month.toString());
      if (monthIndex !== -1) {
        data[monthIndex].total_assign_asset = item.total_assign_asset;
      }
    });

    // Populate the array with total_asset data
    resultTotal.forEach(item => {
      const monthIndex = data.findIndex(d => d.month === item.month.toString());
      if (monthIndex !== -1) {
        data[monthIndex].total_asset = item.total_asset;
      }
    });

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Dashboard data.",
      data: data.reverse(),
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      status: 500,
      message: "An error occurred while fetching dashboard graph data.",
      error: error.message,
    });
  }
});




module.exports = router;  