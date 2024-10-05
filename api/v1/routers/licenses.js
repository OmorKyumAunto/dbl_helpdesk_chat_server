const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const assetUnitModel = require('../models/asset-unit');
const licensesModel = require('../models/licenses');
const verifyToken = require('../middlewares/verifyToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');
const moment = require("moment");
require('dotenv').config();


router.get('/list', [verifyToken, routeAccessChecker("licesesList")], async (req, res) => {

    const status = req.query.status

    let result = await licensesModel.getList(status);

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Licenses List.",
        "count": result.length,
        "data": result
    });
});



router.get('/active-list', [verifyToken, routeAccessChecker("licesesActiveList")], async (req, res) => {

    let result = await licensesModel.getActiveList();

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Licenses Active List.",
        "count": result.length,
        "data": result
    });
});



router.post('/add', [verifyToken, routeAccessChecker("licesesAdd")], async (req, res) => {

    let reqData = {
        "title": req.body.title,
        "price": req.body.price,
    }

    let current_date = new Date(); 
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
    
    reqData.created_by = req.decoded.userInfo.id;
    reqData.updated_by = req.decoded.userInfo.id;

    reqData.created_at = current_time;
    reqData.updated_at = current_time;



    let existingData = await licensesModel.getByTitle(reqData.title);


    if (!isEmpty(existingData)) {
        return res.status(409).send({
            "success": false,
            "status": 409,
            "message": existingData[0].status == "active" ? "This Title Already Exists." : "This Zone Already Exists but Deactivate, You can activate it."
        });

    }

    let result = await licensesModel.addNew(reqData);

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
        "message": "Licenses added Successfully."
    });

});



router.put('/update/:id', [verifyToken, routeAccessChecker("licesesUpdate")], async (req, res) => {

    let id = req.params.id
    let reqData = {
        "title": req.body.title,
        "price": req.body.price,
    }

    reqData.updated_by = req.decoded.userInfo.id;
    let current_date = new Date(); 
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");

    let existingDataById = await licensesModel.getById(id);
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

    // name
    if (existingDataById[0].title !== reqData.title) {

            let existingDataByname = await licensesModel.getByTitle(reqData.title);

            if (!isEmpty(existingDataByname) && existingDataByname[0].id != id) {

                isError = 1;
                errorMessage += existingDataByname[0].status == "active" ? "This title Already Exist." : "This title Already Exist but Deactivate, You can activate it."
            }

            willWeUpdate = 1;
            updateData.title = reqData.title;

    }
    //price
    if (existingDataById[0].price !== reqData.price) {

        willWeUpdate = 1;
        updateData.price = reqData.price

  }


    if (isError == 1) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": errorMessage
        });
    }

    if (willWeUpdate == 1) {

        updateData.updated_by = req.decoded.userInfo.id;
        updateData.updated_at = current_time


        let result = await licensesModel.updateById(id, updateData);


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
            "message": "Licenses successfully updated."
        });


    } else {
        return res.status(200).send({
            "success": true,
            "status": 200,
            "message": "Nothing to update."
        });
    }

});



router.delete('/delete/:id', [verifyToken, routeAccessChecker("licesesDelete")], async (req, res) => {

    let id = req.params.id
    
    updated_by = req.decoded.userInfo.id;

    let current_date = new Date(); 
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");

    let existingDataById = await licensesModel.getById(id);
    if (isEmpty(existingDataById)) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No data found",

        });
    }


    let data = {
        status: 'delete',
        updated_by: updated_by,
        updated_at: current_time
    }

    let result = await licensesModel.updateById(id, data);


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
        "message": "Asset unit successfully deleted."
    });

});


router.put('/changeStatus/:id', [verifyToken, routeAccessChecker("licesesStatus")], async (req, res) => {

    let id = req.params.id

    updated_by = req.decoded.userInfo.id;
    let current_date = new Date(); 
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");

    let existingDataById = await licensesModel.getById(id);
    if (isEmpty(existingDataById)) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No data found",

        });
    }

    let data = {
        status: existingDataById[0].status == 'active' ? 'inactive' : 'active',
        updated_by: updated_by,
        updated_at: current_time
    }

    let result = await licensesModel.updateById(id, data);


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
        "message": "Licenses status has successfully changed."
    });

});






module.exports = router;