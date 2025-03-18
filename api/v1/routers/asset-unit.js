const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const assetUnitModel = require('../models/asset-unit');
const assetModel = require('../models/asset');
const unitAccessModel = require('../models/unit-access');
const userModel = require('../models/user');
const locationModel = require('../models/location');

const verifyToken = require('../middlewares/verifyToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');
const moment = require("moment");
const unitModel = require('../models/asset-unit');
require('dotenv').config();

router.get('/list', [verifyToken, routeAccessChecker("assetUnitList")], async (req, res) => {

    const status = req.query.status

    let result = await assetUnitModel.getList(status);
    for (let index = 0; index < result.length; index++) {
        const element = result[index].id;
        let location = await locationModel.getAllLocationDataByUnitId(element);

        result[index].location = location

    }

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Asset Unit List.",
        "count": result.length,
        "data": result
    });
});


router.get('/active-list', [verifyToken, routeAccessChecker("assetUnitActiveList")], async (req, res) => {

    let result = await assetUnitModel.getActiveList();
    for (let index = 0; index < result.length; index++) {
        const element = result[index].id;
        let location = await locationModel.getAllLocationDataByUnitId(element);

        result[index].location = location

    }
    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Asset Unit List.",
        "count": result.length,
        "data": result
    });
});



router.post('/add', [verifyToken, routeAccessChecker("assetUnitAdd")], async (req, res) => {

    let reqData = {
        "title": req.body.title
    }

    let current_date = new Date(); 
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
    
    reqData.created_by = req.decoded.userInfo.id;
    reqData.updated_by = req.decoded.userInfo.id;

    reqData.created_at = current_time;
    reqData.updated_at = current_time;



    let existingData = await assetUnitModel.getByTitle(reqData.title);


    if (!isEmpty(existingData)) {
        return res.status(409).send({
            "success": false,
            "status": 409,
            "message": existingData[0].status == "active" ? "This Title Already Exists." : "This Zone Already Exists but Deactivate, You can activate it."
        });

    }

    let result = await assetUnitModel.addNew(reqData);

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
        "message": "Asset unit added Successfully."
    });

});



router.put('/update/:id', [verifyToken, routeAccessChecker("assetUnitUpdate")], async (req, res) => {

    let id = req.params.id
    let reqData = {
        "title": req.body.title
    }

    reqData.updated_by = req.decoded.userInfo.id;
    let current_date = new Date(); 
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");

    let existingDataById = await assetUnitModel.getById(id);
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

            let existingDataByname = await assetUnitModel.getByTitle(reqData.title);

            if (!isEmpty(existingDataByname) && existingDataByname[0].id != id) {

                isError = 1;
                errorMessage += existingDataByname[0].status == "active" ? "This title Already Exist." : "This title Already Exist but Deactivate, You can activate it."
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
        updateData.updated_at = current_time


        let result = await assetUnitModel.updateById(id, updateData);


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
            "message": "Asset Unit successfully updated."
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
    
    updated_by = req.decoded.userInfo.id;

    let current_date = new Date(); 
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");

    let existingDataById = await assetUnitModel.getById(id);
    if (isEmpty(existingDataById)) {

        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No data found",

        });
    }

    // check already assign this unit 
    let alreadyAssignThisUnit = await assetModel.alreadyAssignUnit(id);
    if (alreadyAssignThisUnit.length) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "This unit already assign in asset.",

        });
    }



    let data = {
        status: 'delete',
        updated_by: updated_by,
        updated_at: current_time
    }

    let result = await assetUnitModel.updateById(id, data);


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


router.put('/changeStatus/:id', [verifyToken, routeAccessChecker("changeAssetUnitStatus")], async (req, res) => {

    let id = req.params.id

    updated_by = req.decoded.userInfo.id;
    let current_date = new Date(); 
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");

    let existingDataById = await assetUnitModel.getById(id);
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

    let result = await assetUnitModel.updateById(id, data);


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
        "message": "Asset unit status has successfully changed."
    });

});



router.post('/search-access/:id', [verifyToken, routeAccessChecker("searchAccess")], async (req, res) => {

    const id = req.params.id
    let reqData = {
        "unit_id": req.body.unit_id
    }

    let current_date = new Date(); 
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
    

    reqData.created_at = current_time;


     // Get data from the database by id
    let result = await userModel.getById(id);
        // Check if this id already exists in the database
        if (isEmpty(result)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "User data not found."
        });
        }
    if(result[0].role_id !== 2){
        return res.status(404).send({
            success: false,
            status: 404,
            message: "This user is not admin."
        });
    }

    let deletePreviusId = await unitAccessModel.deletePreviusId(id); 

    for (let index = 0; index < reqData.unit_id.length; index++) {
        const element = reqData.unit_id[index];

          // Get data from the database by id
        let unitData = await unitModel.getById(element);
        if (isEmpty(unitData)) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "Unit data not found."
            });
            }

        let data = {
            user_id : id,
            unit_id : element,
            created_at : reqData.created_at,
        }
        let createData = await unitAccessModel.addNew(data);   

        if (createData.affectedRows == undefined || createData.affectedRows < 1) {
            return res.status(500).send({
                "success": false,
                "status": 500,
                "message": "Something Wrong in system database."
            });
        }
    
    }

    return res.status(201).send({
        "success": true,
        "status": 201,
        "message": "Admin unit access added Successfully."
    });

});


router.get('/unit-wise-admin/:id', [verifyToken, routeAccessChecker("assetUnitWiseAdminList")], async (req, res) => {

    const id = parseInt(req.params.id)

    let result = await assetUnitModel.unitWiseAdminList(id);
    //convert json
    result.forEach(row => {
        try {
            row.user_list = JSON.parse(row.user_list);
        } catch (error) {
            row.user_list = []; 
        }
    })
    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Asset Unit List.",
        "count": result.length,
        "data": result
    });
});

module.exports = router;