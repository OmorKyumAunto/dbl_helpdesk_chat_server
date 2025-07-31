const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');
const buildingModel = require('../models/building');
const unitModel = require('../models/asset-unit');
const seatingLocationModel = require('../models/seating-location');
const { seatingLocationCreateSchema,seatingLocationUpdateSchema} = require("../validator/validate-request/seating-location");
const { idParamsSchema} = require("../validator/validate-request/common-validator");
const common = require("../common/common");
const validateRequest = require("../validator/middleware");
require('dotenv').config();


router.get('/list', [verifyToken, routeAccessChecker("seatingLocationList")], async (req, res) => {

    const {limit = 50,offset = 0,unit_id,building_id,status,key} = req.query

    let result = await seatingLocationModel.getList(limit,offset,unit_id,building_id,status,key);
    let countData = await seatingLocationModel.getListCount(unit_id,building_id,status,key);

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Seating Location List.",
        "count": countData.length,
        "data": result
    });
});


router.get('/active-list', [verifyToken, routeAccessChecker("seatingLocationActiveList")], async (req, res) => {

 const {limit = 50,offset = 0,unit_id,building_id,key} = req.query

    let result = await seatingLocationModel.getActiveList(limit,offset,unit_id,building_id,key);
    let countData = await seatingLocationModel.getActiveListCount(unit_id,building_id,key);

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Building List.",
        "count": countData.length,
        "data": result
    });
});


router.post('/add', [verifyToken, routeAccessChecker("seatingLocationAdd"),validateRequest(seatingLocationCreateSchema,'body')], async (req, res) => {

    let reqData = {
        "building_id": req.body.building_id,
        "name": req.body.name
    }


    reqData.created_by = req.decoded.userInfo.id;
    reqData.updated_by = req.decoded.userInfo.id;


    // check unit id is existing
    let existingBuilding = await buildingModel.getById(reqData.building_id);
    if (isEmpty(existingBuilding)) {
       return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "Building not found."
        });
    }


    let existingData = await seatingLocationModel.getByTitle(reqData.building_id,reqData.name);
    if (!isEmpty(existingData)) {
        return res.status(409).send({
            "success": false,
            "status": 409,
            "message": existingData[0].status == "active" ? "This seating location Already Exists." : "This seating location Already Exists but Deactivate, You can activate it."
        });

    }

    let result = await seatingLocationModel.addNew(reqData);

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
        "message": "Seating Location added Successfully."
    });

});



router.put('/update/:id', [verifyToken, routeAccessChecker("seatingLocationUpdate"),validateRequest(idParamsSchema,'params'),validateRequest(seatingLocationUpdateSchema,'body')], async (req, res) => {

    let id = req.params.id
    let reqData = {
        "name": req.body.name
    }

    reqData.updated_by = req.decoded.userInfo.id;


    let existingDataById = await seatingLocationModel.getById(id);
    if (isEmpty(existingDataById)) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "Seating location data found",

        });
    }

    let updateData = {};

    let errorMessage = "";
    let isError = 0; // 1 = yes, 0 = no
    let willWeUpdate = 0; // 1 = yes , 0 = no;

    // name
    if (existingDataById[0].name !== reqData.name) {

            let existingDataByName = await seatingLocationModel.getByTitle(existingDataById[0].building_id,reqData.name);

            if (!isEmpty(existingDataByName) && existingDataByName[0].id != id) {

                isError = 1;
                errorMessage += existingDataByName[0].status == "active" ? "This Seating location Already Exist." : "This Seating location Already Exist but Deactivate, You can activate it."
            }

            willWeUpdate = 1;
            updateData.name = reqData.name;

        

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

        let result = await seatingLocationModel.updateById(id, updateData);


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
            "message": "Seating location successfully updated."
        });


    } else {
        return res.status(200).send({
            "success": true,
            "status": 200,
            "message": "Nothing to update."
        });
    }

});



router.delete('/delete/:id', [verifyToken, routeAccessChecker("seatingLocationDelete"),validateRequest(idParamsSchema,'params')], async (req, res) => {

    let id = req.params.id
    
    updated_by = req.decoded.userInfo.id;

    let existingDataById = await seatingLocationModel.getById(id);
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
    }

    let result = await seatingLocationModel.updateById(id, data);


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
        "message": "Seating Location successfully deleted."
    });

});


router.put('/changeStatus/:id', [verifyToken, routeAccessChecker("changeSeatingLocationStatus"),validateRequest(idParamsSchema,'params')], async (req, res) => {

    let id = req.params.id

    updated_by = req.decoded.userInfo.id;

    let existingDataById = await seatingLocationModel.getById(id);
    if (isEmpty(existingDataById)) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No data found",
        });
    }

    let data = {
        status: existingDataById[0].status == 'active' ? 'inactive' : 'active',
        updated_by: updated_by
    }

    let result = await seatingLocationModel.updateById(id, data);


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
        "message": "Seating location status has successfully changed."
    });

});






module.exports = router;