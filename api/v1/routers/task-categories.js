const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');
const moment = require("moment");
const validateRequest = require("../validator/middleware");
const { taskCategoriesCreateSchema ,taskCategoriesUpdateSchema} = require("../validator/validate-request/task-categories");
require('dotenv').config();
const { current_time } = require("../validation/task/task");
const taskCategoriesModel = require("../models/task-categories");

router.get('/list', [verifyToken, routeAccessChecker("taskCategoriesList")], async (req, res) => {

    const id = req.decoded.userInfo.id;
    const result = await taskCategoriesModel.getList(id);
    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Task category List.",
        "count": result.length,
        "data": result
    });
});


router.post('/', [verifyToken, routeAccessChecker("addTaskCategories"), validateRequest(taskCategoriesCreateSchema)], async (req, res) => {

    let reqData = {
        "title": req.body.title,
        "description": req.body.description,
    }

    reqData.created_by = req.decoded.userInfo.id;

    reqData.created_at = current_time;
    reqData.updated_at = current_time;


    let existingData = await taskCategoriesModel.getByTitle(reqData.title,reqData.created_by);
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



router.put('/update/:id', [verifyToken, routeAccessChecker("assetUnitUpdate"),validateRequest(taskCategoriesUpdateSchema)], async (req, res) => {

    const id = req.params.id
    const user_id = req.decoded.userInfo.id;
    const reqData = {
        "title": req.body.title,
        "description": req.body.description
    }

    reqData.updated_by = user_id;

    let existingDataById = await taskCategoriesModel.getById(id,user_id);
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
        let existingDataTitle = await taskCategoriesModel.getByTitle(reqData.title, user_id);
        
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


    // description
    if (existingDataById[0].description !== reqData.description) {
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
        updateData.updated_at = current_time


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



router.delete('/delete/:id', [verifyToken, routeAccessChecker("assetUnitDelete")], async (req, res) => {

    let id = req.params.id
    const user_id = req.decoded.userInfo.id;
    updated_by = user_id


    let existingDataById = await taskCategoriesModel.getById(id,user_id);
    if (isEmpty(existingDataById)) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No data found",

        });
    }

    // // check already assign this unit 
    // let alreadyAssignThisUnit = await assetModel.alreadyAssignUnit(id);
    // if (alreadyAssignThisUnit.length) {
    //     return res.status(400).send({
    //         "success": false,
    //         "status": 400,
    //         "message": "This unit already assign in asset.",

    //     });
    // }



    let data = {
        status: 0,
        updated_by: updated_by,
        updated_at: current_time
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