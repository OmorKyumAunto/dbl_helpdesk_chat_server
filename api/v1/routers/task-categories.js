const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');
const moment = require("moment");
const validateRequest = require("../validator/middleware");
const { taskCategoriesCreateSchema ,taskCategoriesUpdateSchema,taskCategoriesList} = require("../validator/validate-request/task-categories");
require('dotenv').config();
const { current_time } = require("../validation/task/task");
const taskCategoriesModel = require("../models/task-categories");
const taskModel = require("../models/task");

router.get('/list', [verifyToken, routeAccessChecker("taskCategoriesList"),validateRequest(taskCategoriesList,'query')], async (req, res) => {
   
    let reqData = {
        limit: parseInt(req.query.limit) || 20,
        offset: parseInt(req.query.offset) || 0,
        key: req.query.key,
      };
  
    let { offset, limit, key } = reqData;
    const result = await taskCategoriesModel.getList(offset, limit, key );
    const totalCount = await taskCategoriesModel.getListTotalCount( key);

    //convert json
     result.forEach(row => {
        try {
            row.tsc = JSON.parse(row.tsc);
        } catch (error) {
            row.tsc = []; 
        }
    });

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Task category List.",
        "count": totalCount.length,
        "data": result
    });
});


router.post('/', [verifyToken, routeAccessChecker("addTaskCategories"), validateRequest(taskCategoriesCreateSchema,'body')], async (req, res) => {

    let reqData = {
        "title": req.body.title,
        "set_time": req.body.set_time,
        "format": req.body.format,
    }

    reqData.created_by = req.decoded.userInfo.id;

    let existingData = await taskCategoriesModel.getByTitle(reqData.title);
    if (existingData.length) {
        return res.status(409).send({
            "success": false,
            "status": 409,
            "message": "This title is already created."
        });

    }

    let result = await taskCategoriesModel.addNew(reqData);

    if (result.affectedRows == undefined || result.affectedRows < 1) {
        return res.status(500).send({
            "success": false,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    }

    return res.status(201).send({
        "success": true,
        "status": 201,
        "message": "Task category created Successfully."
    });

});



router.put('/update/:id', [verifyToken, routeAccessChecker("updateTaskCategories"),validateRequest(taskCategoriesUpdateSchema,'body')], async (req, res) => {

    const id = req.params.id
    const user_id = req.decoded.userInfo.id;
    const reqData = {
        "title": req.body.title,
        "set_time": req.body.set_time,
        "format": req.body.format,
    }

    reqData.updated_by = user_id;

    let existingDataById = await taskCategoriesModel.getById(id);
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


    // title
    if (existingDataById[0].title !== reqData.title) {
        let existingDataTitle = await taskCategoriesModel.getByTitle(reqData.title);
        
        if (existingDataTitle.length > 0 && existingDataTitle[0].title === reqData.title) {
            return res.status(400).send({
                "success": false,
                "status": 400,
                "message": "This title already exists.",
            });
        }

        willWeUpdate = 1;
        updateData.title = reqData.title;
    }


    // set_time
    if (existingDataById[0].set_time !== reqData.set_time) {
        willWeUpdate = 1;
        updateData.set_time = reqData.set_time;
    } 

    // format
    if (existingDataById[0].format !== reqData.format) {
        willWeUpdate = 1;
        updateData.format = reqData.format;
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

        let result = await taskCategoriesModel.updateById(id, updateData);


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
            "message": "Task category successfully updated."
        });


    } else {
        return res.status(200).send({
            "success": true,
            "status": 200,
            "message": "Nothing to update."
        });
    }

});



router.delete('/delete/:id', [verifyToken, routeAccessChecker("deleteTaskCategories")], async (req, res) => {

    let id = parseInt(req.params.id)
    const user_id = req.decoded.userInfo.id;
    updated_by = user_id


    let existingDataById = await taskCategoriesModel.getById(id);
    if (isEmpty(existingDataById)) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No data found",

        });
    }

    // // check already assign task under category 
    // let alreadyHasCategoryUnderTask = await taskModel.getByCategoryId(id);
    // if (alreadyHasCategoryUnderTask[0].task_categories_id) {
    //     return res.status(400).send({
    //         "success": false,
    //         "status": 400,
    //         "message": "This category under already assign task.",
    //     });
    // }



    let data = {
        status: 0,
        updated_by: updated_by,
    }

    let result = await taskCategoriesModel.updateById(id, data);


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
        "message": "Task category successfully deleted."
    });

});







module.exports = router;