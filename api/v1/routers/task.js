const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router()
const verifyToken = require("../middlewares/verifyToken");
const { routeAccessChecker } = require("../middlewares/routeAccess");
const moment = require("moment");
const taskModel = require("../models/task");
const { current_time , today_date} = require("../validation/task/task");
const { taskCreateSchema,taskListSchema,taskStarredUpdateSchema,taskUpdateSchema } = require("../validator/validate-request/task");
const common = require("../common/common");
const validateRequest = require("../validator/middleware");
const taskCategoriesModel = require("../models/task-categories");
const userModel = require("../models/user");
const { parseConnectionUrl } = require("nodemailer/lib/shared");
require("dotenv").config();


// task list
router.get(
  "/list",
  [verifyToken, routeAccessChecker("taskList"), validateRequest(taskListSchema, 'query')],
  async (req, res) => {
  
    let reqData = {
      limit: parseInt(req.query.limit) || 20,
      offset: parseInt(req.query.offset) || 0,
      key: req.query.key,
      category: req.query.category,
    };

    let { offset, limit, key, category } = reqData;
    let id = req.decoded.userInfo.id

    let result = await taskModel.getList(offset, limit, key, category ,id);

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Task List.",
      count: result.length,
      data: result,
    });
  }
);

// task details
router.get(
  "/task-details/:id",
  [verifyToken, routeAccessChecker("taskDetails")],
  async (req, res) => {
    let id = req.params.id
    let user_id =  req.decoded.userInfo.id

    let existingDataById = await taskModel.getById(id,user_id);
    if (isEmpty(existingDataById)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "No data found",
      });
    }

    let result = await taskModel.getById(id,user_id);

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Task details.",
      data: result[0],
    });
  }
);

// task create
router.post(
  "/",
  [
    verifyToken,
    routeAccessChecker("createTask"),
    validateRequest(taskCreateSchema,'body'),
  ],
  async (req, res) => {
    let reqData = {
      title: req.body.title,
      description: req.body.description,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      is_assign: req.body.is_assign || 0,
      user_id: req.body.user_id || null,
      task_categories_id: req.body.task_categories_id || null,
    };

  
    const user_id = req.decoded.userInfo.id;

    reqData.created_by = user_id
    reqData.updated_by = user_id

    if(reqData.user_id){
      let checkIsAdmin = await userModel.getById(reqData.user_id);
      if (checkIsAdmin[0].role_id !== 2) {
          return res.status(404).send({
              "success": false,
              "status": 404,
              "message": "This assign user is not admin.",
          });
      }
      reqData.user_id = reqData.user_id,
      reqData.assign_from_id = user_id
      
    }else{
      reqData.user_id = user_id
    }


    reqData.task_code = common.rendomGenerator();

   if(reqData.task_categories_id){
    let existingDataById = await taskCategoriesModel.getById(reqData.task_categories_id,user_id);
    if (isEmpty(existingDataById)) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No data found",
        });
    }
   }else{
      reqData.task_categories_id = null
   }

    let result = await taskModel.addNew(reqData);

    if (result.affectedRows == undefined || result.affectedRows < 1) {
      return res.status(500).send({
        success: false,
        status: 500,
        message: "Something Wrong in system database.",
      });
    }

    return res.status(201).send({
      success: true,
      status: 201,
      message: "Asset unit added Successfully.",
    });
  }
);

// task update
router.put(
  "/update/:id",
  [verifyToken, routeAccessChecker("taskUpdate"),validateRequest(taskUpdateSchema,'body'),],
  async (req, res) => {
    let id = parseInt(req.params.id);
    let reqData = {
      title: req.body.title,
      description: req.body.description,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
    };


    const user_id = req.decoded.userInfo.id
    reqData.updated_by = user_id;

    let existingDataById = await taskModel.getById(id,user_id);
    if (isEmpty(existingDataById)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "No data found",
      });
    }

    // if task already start
    if (existingDataById[0].task_start_date || existingDataById[0].task_start_time) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "You already start your task.In this time task not updated.",
      });
    }

    let updateData = {};

    let errorMessage = "";
    let isError = 0; // 1 = yes, 0 = no
    let willWeUpdate = 0; // 1 = yes , 0 = no;


    // title
    if (existingDataById[0].title !== reqData.title) {
      let existingDataByName = await taskModel.getByTitle(reqData.title,user_id,existingDataById[0].task_categories_id);
      if (existingDataByName.length) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "This title already exists in category.",
        });
      }

      willWeUpdate = 1;
      updateData.title = reqData.title;
    }


    //description
    if (existingDataById[0].description !== reqData.description) {

      willWeUpdate = 1;
      updateData.description = reqData.description;
    }

    //start_date
    if (existingDataById[0].start_date !== reqData.start_date) {

      willWeUpdate = 1;
      updateData.start_date = reqData.start_date;
    }

    //start_date
    if (existingDataById[0].end_date !== reqData.end_date) {

      willWeUpdate = 1;
      updateData.end_date = reqData.end_date;
    }
    
    //start_time
    if (existingDataById[0].start_time !== reqData.start_time) {

      willWeUpdate = 1;
      updateData.start_time = reqData.start_time;
    }
    
    //end_time
    if (existingDataById[0].end_time !== reqData.end_time) {

      willWeUpdate = 1;
      updateData.end_time = reqData.end_time;
    }
    
    
    if (isError == 1) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: errorMessage,
      });
    }

    if (willWeUpdate == 1) {
      updateData.updated_by = user_id;

      let result = await taskModel.updateById(id, updateData);

      if (result.affectedRows == undefined || result.affectedRows < 1) {
        return res.status(500).send({
          success: true,
          status: 500,
          message: "Something Wrong in system database.",
        });
      }

      return res.status(200).send({
        success: true,
        status: 200,
        message: "Task successfully updated.",
      });
    } else {
      return res.status(200).send({
        success: true,
        status: 200,
        message: "Nothing to update.",
      });
    }
  }
);

// task delete
router.delete(
  "/delete/:id",
  [verifyToken, routeAccessChecker("taskDelete")],
  async (req, res) => {
    let id = parseInt(req.params.id);

    const user_id = req.decoded.userInfo.id;
    const  updated_by = user_id;

    let existingDataById = await taskModel.getById(id,user_id);
    if (isEmpty(existingDataById)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "No data found",
      });
    }


    let data = {
      status: 0,
      updated_by: updated_by,
      updated_at: current_time,
    };

    let result = await taskModel.updateById(id, data);

    if (result.affectedRows == undefined || result.affectedRows < 1) {
      return res.status(500).send({
        success: true,
        status: 500,
        message: "Something Wrong in system database.",
      });
    }

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Asset unit successfully deleted.",
    });
  }
);

// start task
router.put(
  "/task-start/:id",
  [verifyToken, routeAccessChecker("taskStart")],
  async (req, res) => {
    let id = parseInt(req.params.id);

    const user_id = req.decoded.userInfo.id;

    let existingDataById = await taskModel.getById(id,user_id);
    if (isEmpty(existingDataById)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "No data found",
      });
    }

    let alreadyStartTask = await taskModel.getById(id,user_id);
    if (alreadyStartTask[0].task_start_date || alreadyStartTask[0].task_start_time) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "You already start your task.",
      });
    }


    let data = {
      task_start_date: today_date,
      task_start_time: current_time,
      task_status : 'inprogress',
      updated_by : user_id
    };

    let result = await taskModel.updateById(id, data);

    if (result.affectedRows == undefined || result.affectedRows < 1) {
      return res.status(500).send({
        success: true,
        status: 500,
        message: "Something Wrong in system database.",
      });
    }

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Task is successfully started.",
    });
  }
);

// end task
router.put(
  "/task-end/:id",
  [verifyToken, routeAccessChecker("taskEnd")],
  async (req, res) => {
    let id = parseInt(req.params.id);

    const user_id = req.decoded.userInfo.id;

    let existingDataById = await taskModel.getById(id,user_id);
    if (isEmpty(existingDataById)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "No data found",
      });
    }

    let alreadyStartTask = await taskModel.getById(id,user_id);
    if (alreadyStartTask[0].task_end_date || alreadyStartTask[0].task_end_time) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "You already end your task.",
      });
    }


    let data = {
      task_end_date: today_date,
      task_end_time: current_time,
      task_status : 'complete',
      updated_by : user_id
    };

    let result = await taskModel.updateById(id, data);

    if (result.affectedRows == undefined || result.affectedRows < 1) {
      return res.status(500).send({
        success: true,
        status: 500,
        message: "Something Wrong in system database.",
      });
    }

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Task is successfully end.",
    });
  }
);

// selected starred
router.put('/starred/:id', [verifyToken, routeAccessChecker("starredTaskChange"),validateRequest(taskStarredUpdateSchema,'body')], async (req, res) => {

  const id = parseInt(req.params.id)
  const user_id = req.decoded.userInfo.id;
  const reqData = {
      "starred": req.body.starred,
  }

  reqData.updated_by = user_id;

  let existingDataById = await taskModel.getById(id,user_id);
  if (isEmpty(existingDataById)) {
      return res.status(404).send({
          "success": false,
          "status": 404,
          "message": "No data found",
      });
  }

  let updateData = {};

  let errorMessage = "";
  let isError = 0; // 1 = yes, 0 = no
  let willWeUpdate = 0; // 1 = yes , 0 = no;


  // starred
  if (existingDataById[0].starred !== reqData.starred) {

      willWeUpdate = 1;
      updateData.starred = reqData.starred;
  }



  if (isError == 1) {
      return res.status(400).send({
          "success": false,
          "status": 400,
          "message": errorMessage
      });
  }

  if (willWeUpdate == 1) {

      updateData.updated_by = user_id;
  
      let result = await taskModel.updateById(id, updateData);


      if (result.affectedRows == undefined || result.affectedRows < 1) {
          return res.status(500).send({
              "success": true,
              "status": 500,
              "message": "Something Wrong in system database."
          });
      }


      return res.status(200).send({
          "success": true,
          "status": 200,
          "message": "Task successfully updated."
      });


  } else {
      return res.status(200).send({
          "success": true,
          "status": 200,
          "message": "Nothing to update."
      });
  }

});



module.exports = router;
