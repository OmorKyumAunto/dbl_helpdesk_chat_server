const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');
const moment = require("moment");
const validateRequest = require("../validator/middleware");
const { taskSubCategoryCreateSchema ,taskSubCategoryUpdateSchema } = require("../validator/validate-request/task-sub-category");
require('dotenv').config();
const { current_time } = require("../validation/task/task");
const taskCategoriesModel = require("../models/task-categories");
const taskSubCategoryModel = require("../models/task-sub-category");

router.get('/list', [verifyToken, routeAccessChecker("taskSubCategory")], async (req, res) => {

    const result = await taskSubCategoryModel.getList();

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Task sub category List.",
        "count": result.length,
        "data": result
    });
});


router.post('/', [verifyToken, routeAccessChecker("addTaskSubCategory"), validateRequest(taskSubCategoryCreateSchema,'body')], async (req, res) => {

    let reqData = {
        "title": req.body.title,
        "categories_id": req.body.categories_id,
    }

    reqData.created_by = req.decoded.userInfo.id;


    // check category is already exists or not
    let existingCategoryDataById = await taskCategoriesModel.getById(reqData.categories_id);
    if (isEmpty(existingCategoryDataById)) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "Category data found",

        });
    }


    // check this title has duplicate or not
    let existingData = await taskSubCategoryModel.getByTitle(reqData.title,reqData.categories_id);
    if (existingData.length) {
        return res.status(409).send({
            "success": false,
            "status": 409,
            "message": "This title is already created."
        });

    }

    let result = await taskSubCategoryModel.addNew(reqData);

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
        "message": "Task sub category created Successfully."
    });

});



router.put('/update/:id', [verifyToken, routeAccessChecker("updateTaskSubCategory"),validateRequest(taskSubCategoryUpdateSchema,'body')], async (req, res) => {

    const id = req.params.id
    const user_id = req.decoded.userInfo.id;
    
    const reqData = {
        "title": req.body.title,
    }

    reqData.updated_by = user_id;

    let existingDataById = await taskSubCategoryModel.getById(id);
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
        let existingDataTitle = await taskSubCategoryModel.getByTitle(reqData.title, existingDataById[0].categories_id);
        
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





    if (isError == 1) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": errorMessage
        });
    }

    if (willWeUpdate == 1) {

        updateData.updated_by = user_id;

        let result = await taskSubCategoryModel.updateById(id, updateData);


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



router.delete('/delete/:id', [verifyToken, routeAccessChecker("deleteTaskSubCategory")], async (req, res) => {

    let id = parseInt(req.params.id)
    const user_id = req.decoded.userInfo.id;
    updated_by = user_id


    let existingDataById = await taskSubCategoryModel.getById(id);
    if (isEmpty(existingDataById)) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No data found",

        });
    }


    let data = {
        status: 0,
        updated_by: updated_by,
    }

    let result = await taskSubCategoryModel.updateById(id, data);


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