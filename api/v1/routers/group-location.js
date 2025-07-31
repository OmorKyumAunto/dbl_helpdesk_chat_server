const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');
const groupUnitModel = require('../models/building');
const groupLocationModel = require('../models/group-location');
const { groupLocationCreateSchema} = require("../validator/validate-request/group-location");
const { idParamsSchema} = require("../validator/validate-request/common-validator");
const common = require("../common/common");
const validateRequest = require("../validator/middleware");
require('dotenv').config();


router.get('/list', [verifyToken, routeAccessChecker("groupUnitList")], async (req, res) => {

    const status = req.query.status

    let result = await groupUnitModel.getList(status);
    // for (let index = 0; index < result.length; index++) {
    //     const element = result[index].id;
    //     let location = await locationModel.getAllLocationDataByUnitId(element);

    //     result[index].location = location

    // }

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Group Unit List.",
        "count": result.length,
        "data": result
    });
});


router.get('/active-list', [verifyToken, routeAccessChecker("groupUnitActiveList")], async (req, res) => {

    let result = await groupUnitModel.getActiveList();
    // for (let index = 0; index < result.length; index++) {
    //     const element = result[index].id;
    //     let location = await locationModel.getAllLocationDataByUnitId(element);

    //     result[index].location = location

    // }
    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Group Unit List.",
        "count": result.length,
        "data": result
    });
});



router.post('/add', [verifyToken, routeAccessChecker("groupLocationAdd"),validateRequest(groupLocationCreateSchema,'body')], async (req, res) => {

    let reqData = {
        "group_unit_id":req.body.group_unit_id,
        "name": req.body.name
    }

    const self_id = req.decoded.userInfo.id;
    reqData.created_by = self_id
    reqData.updated_by = self_id


    // check group unit id 
    let existingByGroupUnitId = await groupUnitModel.getById(id);
    if (isEmpty(existingByGroupUnitId)) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "Group Unit data found",
        });
    }

    // check location is already exists
    let existingDataByName = await groupLocationModel.getByTitle(reqData.group_unit_id,reqData.name);
    if (!isEmpty(existingDataByName)) {
        return res.status(409).send({
            "success": false,
            "status": 409,
            "message": existingData[0].status == "active" ? "This Title Already Exists." : "This group unit Already Exists but Deactivate, You can activate it."
        });

    }

    let result = await groupLocationModel.addNew(reqData);

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
        "message": "Group location added Successfully."
    });

});



router.put('/update/:id', [verifyToken, routeAccessChecker("groupUnitUpdate"),validateRequest(idParamsSchema,'params')], async (req, res) => {

    let id = req.params.id
    let reqData = {
        "title": req.body.title
    }

    reqData.updated_by = req.decoded.userInfo.id;


    let existingDataById = await groupUnitModel.getById(id);
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

            let existingDataByName = await groupUnitModel.getByTitle(reqData.title);

            if (!isEmpty(existingDataByName) && existingDataByName[0].id != id) {

                isError = 1;
                errorMessage += existingDataByName[0].status == "active" ? "This title Already Exist." : "This title Already Exist but Deactivate, You can activate it."
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

        updateData.updated_by = req.decoded.userInfo.id;

        let result = await groupUnitModel.updateById(id, updateData);


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
            "message": "Group Unit successfully updated."
        });


    } else {
        return res.status(200).send({
            "success": true,
            "status": 200,
            "message": "Nothing to update."
        });
    }

});



router.delete('/delete/:id', [verifyToken, routeAccessChecker("groupUnitDelete"),validateRequest(idParamsSchema,'params')], async (req, res) => {

    let id = req.params.id
    
    updated_by = req.decoded.userInfo.id;

    let existingDataById = await groupUnitModel.getById(id);
    if (isEmpty(existingDataById)) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No data found",

        });
    }

    // // check already assign this unit 
    // let alreadyAssignThisUnit = await groupUnitModel.alreadyAssignUnit(id);
    // if (alreadyAssignThisUnit.length) {
    //     return res.status(400).send({
    //         "success": false,
    //         "status": 400,
    //         "message": "This unit already assign in asset.",

    //     });
    // }



    let data = {
        status: 'delete',
        updated_by: updated_by,
    }

    let result = await groupUnitModel.updateById(id, data);


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
        "message": "Group unit successfully deleted."
    });

});


router.put('/changeStatus/:id', [verifyToken, routeAccessChecker("changeGroupUnitStatus"),validateRequest(idParamsSchema,'params')], async (req, res) => {

    let id = req.params.id

    updated_by = req.decoded.userInfo.id;

    let existingDataById = await groupUnitModel.getById(id);
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

    let result = await groupUnitModel.updateById(id, data);


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
        "message": "Group unit status has successfully changed."
    });

});






module.exports = router;