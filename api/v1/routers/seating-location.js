const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');
const buildingModel = require('../models/building');
const userModel = require('../models/user');
const seatingLocationModel = require('../models/seating-location');
const assignSeatingLocationModel = require('../models/assign-seating-location');
const chooseAdminModel = require('../models/choose-admin');
const { seatingLocationCreateSchema, seatingLocationUpdateSchema, assignSeatingLocation } = require("../validator/validate-request/seating-location");
const { idParamsSchema,buildingIdSchema } = require("../validator/validate-request/common-validator");
const validateRequest = require("../validator/middleware");
const commonObject = require("../common/common");
require('dotenv').config();


router.get('/list', [verifyToken, routeAccessChecker("seatingLocationList")], async (req, res) => {

    const { limit = 50, offset = 0, unit_id, building_id, status, key } = req.query

    let result = await seatingLocationModel.getList(limit, offset, unit_id, building_id, status, key);
    let countData = await seatingLocationModel.getListCount(unit_id, building_id, status, key);

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Seating Location List.",
        "count": countData.length,
        "data": result
    });
});


router.get('/active-list', [verifyToken, routeAccessChecker("seatingLocationActiveList")], async (req, res) => {

    const { limit = 50, offset = 0, unit_id, building_id, key } = req.query

    let result = await seatingLocationModel.getActiveList(limit, offset, unit_id, building_id, key);
    let countData = await seatingLocationModel.getActiveListCount(unit_id, building_id, key);

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Building List.",
        "count": countData.length,
        "data": result
    });
});


router.post('/add', [verifyToken, routeAccessChecker("seatingLocationAdd"), validateRequest(seatingLocationCreateSchema, 'body')], async (req, res) => {

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


    let existingData = await seatingLocationModel.getByTitle(reqData.building_id, reqData.name);
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



router.put('/update/:id', [verifyToken, routeAccessChecker("seatingLocationUpdate"), validateRequest(idParamsSchema, 'params'), validateRequest(seatingLocationUpdateSchema, 'body')], async (req, res) => {

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

        let existingDataByName = await seatingLocationModel.getByTitle(existingDataById[0].building_id, reqData.name);

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



router.delete('/delete/:id', [verifyToken, routeAccessChecker("seatingLocationDelete"), validateRequest(idParamsSchema, 'params')], async (req, res) => {

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


router.put('/changeStatus/:id', [verifyToken, routeAccessChecker("changeSeatingLocationStatus"), validateRequest(idParamsSchema, 'params')], async (req, res) => {

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


// assign seating location to user
router.post('/assign/:id', [verifyToken, routeAccessChecker("assignSeatingLocation"), validateRequest(assignSeatingLocation, 'body')], async (req, res) => {

    const user_id = parseInt(req.params.id)
    const seating_location = req.body.seating_location

    const self_id = req.decoded.userInfo.id;


    // check user is existing
    let existingDataByUserId = await userModel.getById(user_id);
    if (isEmpty(existingDataByUserId)) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "User not found."
        });
    }

    // check assign user role is 2
    if (existingDataByUserId[0].role_id !== 2) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "This user is not admin."
        });
    }

    // check this admin already assign or not
    let existsAlreadyChooseAdmin = await chooseAdminModel.getByAdminId(user_id);
    if (existsAlreadyChooseAdmin[0].created_by !== self_id) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "This admin already selected by another super admin."
        });
    }

    // get all location by user id
    const getLocationByUserId = await assignSeatingLocationModel.getLocationByUserId(user_id)

    if (getLocationByUserId.length) {
        let getDataInDB = []
        for (let index = 0; index < getLocationByUserId.length; index++) {
            getDataInDB.push(getLocationByUserId[index].seating_location_id)
        }

        // compare db data and req data

        const compareData = await commonObject.compareArrays(seating_location, getDataInDB)

        // delete previous not matched value
        for (let index = 0; index < compareData.notMatchedValue.length; index++) {
            const notMatchedIds = compareData.notMatchedValue[index];
            const getId = await assignSeatingLocationModel.getIdByUserAndLocationId(user_id, notMatchedIds)

            await assignSeatingLocationModel.updateById(getId[0].id, { status: 0, updated_by: self_id })

        }

        // add new value 
        for (let index = 0; index < compareData.newValue.length; index++) {
            const newIds = compareData.newValue[index];
            await assignSeatingLocationModel.addNew({ user_id: user_id, seating_location_id: newIds, created_by: self_id, updated_by: self_id })
        }

    } else {

        for (let index = 0; index < seating_location.length; index++) {
            const location_id = seating_location[index];
            // check location is exists or not
            let existingDataByLocationId = await seatingLocationModel.getById(location_id);
            if (isEmpty(existingDataByLocationId)) {
                return res.status(404).send({
                    "success": false,
                    "status": 404,
                    "message": `This seating location: ${location_id} not found.`
                });
            }
            // check already assign this location
            let alreadyAssignLocation = await assignSeatingLocationModel.getById(user_id, location_id);
            if (alreadyAssignLocation.length) {
                return res.status(400).send({
                    "success": false,
                    "status": 400,
                    "message": `This seating location: ${location_id} already exists.`
                });
            }

            const data = {
                user_id: user_id,
                seating_location_id: location_id,
                created_by: self_id,
                updated_by: self_id,
            }

         await assignSeatingLocationModel.addNew(data)

        }

    }

    const chooseAdmin = {
        unit_wise_super_admin : self_id,
        admin_id : user_id,
        created_by: self_id
    }
    await chooseAdminModel.addNew(chooseAdmin)

    return res.status(201).send({
        "success": true,
        "status": 201,
        "message": "Seating Location added Successfully."
    });

});


// user wise get location
router.get('/user-location/:id', [verifyToken, routeAccessChecker("userSeatingLocationList"),validateRequest(idParamsSchema, 'params')], async (req, res) => {

    const id = parseInt(req.params.id)
    // check user is existing
    let existingDataByUserId = await userModel.getById(id);
    if (isEmpty(existingDataByUserId)) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "User not found."
        });
    }

    let result = await assignSeatingLocationModel.userWiseLocation(id);
    

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "User seating Location List.",
        "count": result.length,
        "data": result
    });
});



// multiple building wise seating location list
router.post('/building-wise-location', [verifyToken, routeAccessChecker("buildingSeatingLocationList"),validateRequest(buildingIdSchema, 'body')], async (req, res) => {

    const building_id = req.body.building_id

    const id = []
    // check this building id already exists in db
    for (let index = 0; index < building_id.length; index++) {
        const buildingId = building_id[index];

        const existBuildingId = await buildingModel.getById(buildingId)
        if(isEmpty(existBuildingId)){
            return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "Building not found .",
       });
        }
        id.push(buildingId)
    }
    let result = await seatingLocationModel.getDataByBuildingId(id);
    

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Building wise seating location list.",
        "count": result.length,
        "data": result
    });
});


module.exports = router;