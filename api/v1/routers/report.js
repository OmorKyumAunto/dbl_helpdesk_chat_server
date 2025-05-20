const express = require("express");
const router = express.Router();
const userModel = require('../models/user');
const assetUnitModel = require('../models/asset-unit');
const verifyToken = require('../middlewares/verifyToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');
const assetModel = require("../models/asset");
const { assetReport, disbursementsReport,taskReport } = require('../validator/validate-request/report')
const validateRequest = require("../validator/middleware");
const taskModel = require("../models/task");
const taskCategoryModel = require("../models/task-categories");
const raiseTicketModel = require("../models/raise-ticket");
require('dotenv').config();


// asset report
router.get(
    "/asset-report",
    [verifyToken, routeAccessChecker("assetReportList"),validateRequest(assetReport,'query')],
    async (req, res) => {

    let id = req.decoded.userInfo.id
    const reqData = {
        unit : parseInt(req.query.unit),
        start_date : req.query.start_date,
        end_date : req.query.end_date,
        category : req.query.category,
        remarks : req.query.remarks,
        key : req.query.key,
        start_purchase_date : req.query.start_purchase_date,
        end_purchase_date : req.query.end_purchase_date,
    }
    const {unit,start_date,end_date,category,remarks,key,start_purchase_date,end_purchase_date} = reqData
   
    const query_data = {
        unit:unit || null,
        start_date: start_date || null,
        end_date: end_date || null,
        start_purchase_date : start_purchase_date || null,
        end_purchase_date : end_purchase_date || null,
        category: category || null,
        remarks: remarks || null,
        key: key || null,
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

     // report generate user info
     if(id){
      let existingDataById = await userModel.getById(id);
      if (!existingDataById.length) {
          return res.status(404).send({
              "success": false,
              "status": 404,
              "message": "User not found",
  
          });
      }
      query_data.report_generate_employee_name = existingDataById[0].name
      query_data.report_generate_employee_id = existingDataById[0].employee_id
      query_data.report_generate_department = existingDataById[0].department
      query_data.report_generate_designation = existingDataById[0].designation
     }

      let result = await assetModel.assetReport(unit,start_date,end_date,category,remarks,key,start_purchase_date,end_purchase_date);
 
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

    let id = req.decoded.userInfo.id
    
    const reqData = {
        unit : parseInt(req.query.unit),
        start_date : req.query.start_date,
        end_date : req.query.end_date,
        category : req.query.category,
        employee_type : req.query.employee_type,
        key : req.query.key
    }

    const {unit,start_date,end_date,category,employee_type,key} = reqData
    const query_data = {
        unit:unit || null,
        start_date: start_date || null,
        end_date: end_date || null,
        category: category || null,
        employee_type: employee_type || null,
        key : key || null,
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

     // report generate user info
     if(id){
      let existingDataById = await userModel.getById(id);
      if (!existingDataById.length) {
          return res.status(404).send({
              "success": false,
              "status": 404,
              "message": "User not found",
  
          });
      }
      query_data.report_generate_employee_name = existingDataById[0].name
      query_data.report_generate_employee_id = existingDataById[0].employee_id
      query_data.report_generate_department = existingDataById[0].department
      query_data.report_generate_designation = existingDataById[0].designation
     }   

      let result = await assetModel.distributedAssetReport(unit,start_date,end_date,category,employee_type,key);
 
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
    let id = req.decoded.userInfo.id;

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
      overdue : parseInt(req.query.overdue)
    };
    
 
    let { key, category,start_date,end_date,task_status,unit_id,user_id,overdue } = reqData;

    const query_data = {
      key : key || null,
      start_date: start_date || null,
      end_date: end_date || null,
      user_id : user_id || null,
      task_status : task_status || null,
      unit_id : unit_id || null,
      overdue : overdue || null,
    }

    if(unit_id){
      let existingDataByUnitId = await assetUnitModel.getById(unit_id);
      if (!existingDataByUnitId.length) {
          return res.status(404).send({
              "success": false,
              "status": 404,
              "message": "Unit not found",
  
          });
      }
      query_data.unit_name = existingDataByUnitId[0].title
     }


     let category_name = []
     if(category){
       for (let index = 0; index < category.length; index++) {
        const data = category[index];
      
        let existingDataByCategory = await taskCategoryModel.getById(data);
        if (!existingDataByCategory.length) {
            return res.status(404).send({
                "success": false,
                "status": 404,
                "message": "Category not found",
    
            });
        }
        category_name.push(existingDataByCategory[0].title)
        
       }
     }

     if(user_id){
      let existingDataByUserId = await userModel.getById(user_id);
      if (!existingDataByUserId.length) {
          return res.status(404).send({
              "success": false,
              "status": 404,
              "message": "User not found",
  
          });
      }
      query_data.employee_name = existingDataByUserId[0].name
      query_data.employee_id = existingDataByUserId[0].employee_id
     }

     // report generate user info
     if(id){
      let existingDataById = await userModel.getById(id);
      if (!existingDataById.length) {
          return res.status(404).send({
              "success": false,
              "status": 404,
              "message": "User not found",
  
          });
      }
      query_data.report_generate_employee_name = existingDataById[0].name
      query_data.report_generate_employee_id = existingDataById[0].employee_id
      query_data.report_generate_department = existingDataById[0].department
      query_data.report_generate_designation = existingDataById[0].designation
     }


    let  result = await taskModel.getTaskReport(key, category,start_date,end_date,task_status,unit_id,user_id,overdue);
   
    query_data.category_name = category_name 
    query_data.total_count = result.length || 0
    return res.status(200).send({
      success: true,
      status: 200,
      message: "Task List.",
      count: result.length,
      data: result,
      query_data : query_data
    });
  }
);



// ticket report
router.get(
  "/ticket-report",
  [verifyToken, routeAccessChecker("ticketReport")],
  async (req, res) => {
   
    let id = req.decoded.userInfo.id;

    const reqData = {
      key : req.query.key,
      start_date : req.query.start_date,
      end_date : req.query.end_date,
      category : req.query.category,
      priority : req.query.priority,
      unit : req.query.unit,
      status : req.query.status,
      user_id : req.query.user_id,
      overdue : req.query.overdue   
  }

  const {key,start_date,end_date,category,priority,unit,status,user_id,overdue} = reqData
    
  const query_data = {
    key : key || null,
    start_date: start_date || null,
    end_date: end_date || null,
    category : category || null,
    priority : priority || null,
    unit : unit || null,
    status : status || null,
    user_id : user_id || null,
    overdue : overdue || null,
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

  if(user_id){
    let existingDataByUserId = await userModel.getById(user_id);
    if (!existingDataByUserId.length) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "User not found",

        });
    }
    query_data.employee_name = existingDataByUserId[0].name
    query_data.employee_id = existingDataByUserId[0].employee_id
   }

   // report generate user info
   if(id){
    let existingDataById = await userModel.getById(id);
    if (!existingDataById.length) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "User not found",

        });
    }
    query_data.report_generate_employee_name = existingDataById[0].name
    query_data.report_generate_employee_id = existingDataById[0].employee_id
    query_data.report_generate_department = existingDataById[0].department
    query_data.report_generate_designation = existingDataById[0].designation
   }

  let result = await raiseTicketModel.ticketReport(key,start_date,end_date,category,priority,unit,status,user_id,overdue);

  query_data.total_count = result.length || 0
  return res.status(200).send({
    success: true,
    status: 200,
    message: "Ticket report.",
    total: result.length,
    data: result,
    query_data : query_data
  });
  }
);
module.exports = router;