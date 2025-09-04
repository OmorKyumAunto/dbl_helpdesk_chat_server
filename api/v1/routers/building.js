const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');
const buildingModel = require('../models/building');
const unitModel = require('../models/asset-unit');
const userModel = require('../models/user');
const unitAccessModel = require('../models/unit-access');
const assignSeatingLocationModel = require('../models/assign-seating-location');
const seatingLocationModel = require('../models/seating-location');
const assignCategoriesModel = require('../models/assign-category');
const ticketCategoriesModel = require('../models/ticket-category');
const { buildingCreateSchema,buildingUpdateSchema} = require("../validator/validate-request/building");
const { idParamsSchema} = require("../validator/validate-request/common-validator");
const common = require("../common/common");
const validateRequest = require("../validator/middleware");
require('dotenv').config();


router.get('/list', [verifyToken, routeAccessChecker("buildingList")], async (req, res) => {

    const {limit = 50,offset = 0,unit_id,status,key} = req.query

    let result = await buildingModel.getList(limit,offset,unit_id,status,key);
    let countData = await buildingModel.getListCount(unit_id,status,key);

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Building List.",
        "count": countData.length,
        "data": result
    });
});


router.get('/active-list', [verifyToken, routeAccessChecker("buildingActiveList")], async (req, res) => {

 const {limit = 50,offset = 0,unit_id,key} = req.query

    let result = await buildingModel.getActiveList(limit,offset,unit_id,key);
    let countData = await buildingModel.getActiveListCount(unit_id,key);

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Building List.",
        "count": countData.length,
        "data": result
    });
});



router.post('/add', [verifyToken, routeAccessChecker("buildingAdd"),validateRequest(buildingCreateSchema,'body')], async (req, res) => {

    let reqData = {
        "unit_id": req.body.unit_id,
        "name": req.body.name
    }


    reqData.created_by = req.decoded.userInfo.id;
    reqData.updated_by = req.decoded.userInfo.id;


    // check unit id is existing
    let existingUnit = await unitModel.getById(reqData.unit_id);

    if (isEmpty(existingUnit)) {
       return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "Unit not found."
        });
    }


    let existingData = await buildingModel.getByTitle(reqData.unit_id,reqData.name);
    if (!isEmpty(existingData)) {
        return res.status(409).send({
            "success": false,
            "status": 409,
            "message": existingData[0].status == "active" ? "This building name Already Exists." : "This building name Already Exists but Deactivate, You can activate it."
        });

    }

    let result = await buildingModel.addNew(reqData);

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
        "message": "Building added Successfully."
    });

});



router.put('/update/:id', [verifyToken, routeAccessChecker("buildingUpdate"),validateRequest(idParamsSchema,'params'),validateRequest(buildingUpdateSchema,'body')], async (req, res) => {

    let id = req.params.id
    const self_id = req.decoded.userInfo.id
    let reqData = {
        "name": req.body.name
    }

    reqData.updated_by = self_id;


    let existingDataById = await buildingModel.getById(id);
    if (isEmpty(existingDataById)) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "Building data found",

        });
    }

    let updateData = {};

    let errorMessage = "";
    let isError = 0; // 1 = yes, 0 = no
    let willWeUpdate = 0; // 1 = yes , 0 = no;


    if (existingDataById[0].created_by !== self_id) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "You do not have permission to perform any action in this location.",

        });
    }

    // name
    if (existingDataById[0].name !== reqData.name) {

            let existingDataByName = await buildingModel.getByTitle(existingDataById[0].unit_id,reqData.name);

            if (!isEmpty(existingDataByName) && existingDataByName[0].id != id) {

                isError = 1;
                errorMessage += existingDataByName[0].status == "active" ? "This Building Already Exist." : "This Building Already Exist but Deactivate, You can activate it."
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

        updateData.updated_by = self_id;

        let result = await buildingModel.updateById(id, updateData);


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
            "message": "Building successfully updated."
        });


    } else {
        return res.status(200).send({
            "success": true,
            "status": 200,
            "message": "Nothing to update."
        });
    }

});



router.delete('/delete/:id', [verifyToken, routeAccessChecker("buildingDelete"),validateRequest(idParamsSchema,'params')], async (req, res) => {

    let id = req.params.id
    const self_id = req.decoded.userInfo.id
    updated_by = self_id;

    let existingDataById = await buildingModel.getById(id);
    if (isEmpty(existingDataById)) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No data found",

        });
    }


    if (existingDataById[0].created_by !== self_id) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "You do not have permission to perform any action in this location.",

        });
    }

    let data = {
        status: 'delete',
        updated_by: updated_by,
    }

    let result = await buildingModel.updateById(id, data);


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
        "message": "Building successfully deleted."
    });

});


router.put('/changeStatus/:id', [verifyToken, routeAccessChecker("changeBuildingStatus"),validateRequest(idParamsSchema,'params')], async (req, res) => {

    let id = req.params.id
    const self_id = req.decoded.userInfo.id;
    updated_by = self_id;

    let existingDataById = await buildingModel.getById(id);
    if (isEmpty(existingDataById)) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No data found",
        });
    }

    if (existingDataById[0].created_by !== self_id) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "You do not have permission to perform any action in this location.",

        });
    }

    let data = {
        status: existingDataById[0].status == 'active' ? 'inactive' : 'active',
        updated_by: updated_by
    }

    let result = await buildingModel.updateById(id, data);


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
        "message": "Building status has successfully changed."
    });

});



// user unit wise building list
router.get('/user-unit-building/:id', [verifyToken, routeAccessChecker("userUnitBuildingList"),validateRequest(idParamsSchema,'params')], async (req, res) => {

    const id = parseInt(req.params.id)
    let data = {}
    const existingUser = await userModel.getById(id)
    if(isEmpty(existingUser)){
        return res.status(404).send({
        "success": true,
        "status": 404,
        "message": "User not found.",

    }); 
    }

    const getUnit = await unitAccessModel.getById(id)

    const unitIds = getUnit.map(u => u.unit_id); 

   // const getBuilding = await buildingModel.getDataByUnitId(unitIds);
    const getUnitInfo = await unitModel.getByMultipleId(unitIds);

    data.searchAccess = getUnitInfo

    // get building
    const getLocation = await assignSeatingLocationModel.getLocationByUserId(id);

    let location_id = getLocation.map((u) => u.seating_location_id);
    let locationData = [];
    let buildingData = [];
    let buildingIds = new Set();

    for (let id of location_id) {
    const getLocationInfo = await seatingLocationModel.getById(id);

    if (getLocationInfo && getLocationInfo.length > 0) {
        locationData.push({
        seating_location_id: getLocationInfo[0].id,
        seating_location_name: getLocationInfo[0].name
        });

        const getBuildingInfo = await buildingModel.getById(getLocationInfo[0].building_id);

        if (getBuildingInfo && getBuildingInfo.length > 0) {
        const b = getBuildingInfo[0];
        if (!buildingIds.has(b.id)) {   
            buildingData.push({
            building_id: b.id,
            building_name: b.name
            });
            buildingIds.add(b.id); 
        }
        }
    }
    }

    data.seating_location = locationData;
    data.complex = buildingData;




    // category
    const getCategory = await assignCategoriesModel.getByUserId(id);
    let category_id = getCategory.map((u) => u.category_id);
    let categoryData = [];


    for (let id of category_id) {
    const category = await ticketCategoriesModel.getById(id);

    if (category && category.length > 0) {
        categoryData.push({
        category_id: category[0].id,
        category_name: category[0].title
        });
    }
    }

    data.seating_location = locationData;
    data.complex = buildingData;
    data.categories = categoryData;

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "User Unit wise building List.",
        "data": data
    });
});

module.exports = router;