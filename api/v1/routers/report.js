const express = require("express");
const router = express.Router();
const userModel = require('../models/user');
const assetUnitModel = require('../models/asset-unit');
const verifyToken = require('../middlewares/verifyToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');
const assetModel = require("../models/asset");
const { assetReport, disbursementsReport,taskReport } = require('../validator/validate-request/report')
const validateRequest = require("../validator/middleware");
const unitModel = require('../models/asset-unit');
const taskModel = require("../models/task");
require('dotenv').config();


// asset report
router.get(
    "/asset-report",
    [verifyToken, routeAccessChecker("assetReportList"),validateRequest(assetReport,'query')],
    async (req, res) => {

    const reqData = {
        unit : parseInt(req.query.unit),
        start_date : req.query.start_date,
        end_date : req.query.end_date,
        category : req.query.category,
        remarks : req.query.remarks,
    }
    const {unit,start_date,end_date,category,remarks} = reqData
   
    const query_data = {
        unit:unit || null,
        start_date: start_date || null,
        end_date: end_date || null,
        category: category || null,
        remarks: remarks || null,
      }

    if(unit){
        let existingDataByUnitId = await assetUnitModel.getById(unit);
        if (!existingDataByUnitId.length) {
            return res.status(404).send({
                "success": false,
                "status": 404,
                "message": "Unit not found",
    
            });
        }
        query_data.unit_name = existingDataByUnitId[0].title
        

    }

      let result = await assetModel.assetReport(unit,start_date,end_date,category,remarks);
 
      query_data.total_count = result.length || 0


      return res.status(200).send({
        success: true,
        status: 200,
        message: "Asset Report List.",
        count: result.length,
        data: result,
        query_data : query_data
      });
    }
  );


  
// disbursements report
router.get(
    "/disbursements-report",
    [verifyToken, routeAccessChecker("disbursementsReportList"),validateRequest(disbursementsReport,'query')],
    async (req, res) => {

    const reqData = {
        unit : parseInt(req.query.unit),
        start_date : req.query.start_date,
        end_date : req.query.end_date,
        category : req.query.category,
        employee_type : req.query.employee_type
    }
    const {unit,start_date,end_date,category,employee_type} = reqData
    const query_data = {
        unit:unit || null,
        start_date: start_date || null,
        end_date: end_date || null,
        category: category || null,
        employee_type: employee_type || null,
    
      }
   if(unit){
    let existingDataByUnitId = await assetUnitModel.getById(unit);
    if (!existingDataByUnitId.length) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "Unit not found",

        });
    }
    query_data.unit_name = existingDataByUnitId[0].title
   }

      let result = await assetModel.distributedAssetReport(unit,start_date,end_date,category,employee_type);
 
      query_data.total_count = result.length || 0

      return res.status(200).send({
        success: true,
        status: 200,
        message: "Asset Report List.",
        count: result.length,
        data: result,
        query_data : query_data
      });
    }
);



// task report 
router.get(
  "/task-report",
  [verifyToken, routeAccessChecker("taskReport"),validateRequest(taskReport,'query')],
  async (req, res) => {
  
    let reqData = {
      key: req.query.key,
      category: Array.isArray(req.query.category) 
        ? req.query.category.map(Number) 
         : req.query.category 
          ? req.query.category.split(',').map(Number)  
           : [],
      start_date: req.query.start_date,
      end_date: req.query.end_date,
      user_id: req.query.user_id,
      task_status : req.query.task_status,
      unit_id : req.query.unit_id,
    };
    
 
    let { key, category,start_date,end_date,task_status,unit_id,user_id } = reqData;

    let  result = await taskModel.getTaskReport(key, category,start_date,end_date,task_status,unit_id,user_id);
   
    return res.status(200).send({
      success: true,
      status: 200,
      message: "Task List.",
      count: result.length,
      data: result,
    });
  }
);


module.exports = router;