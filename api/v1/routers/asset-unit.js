const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const commonObject = require('../common/common');
const assetUnitModel = require('../models/asset-unit');
const verifyToken = require('../middlewares/verifyToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');
require('dotenv').config();

router.get('/list', [verifyToken, routeAccessChecker("assetUnitList")], async (req, res) => {

    let result = await assetUnitModel.getList();

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Asset Unit List.",
        "count": result.length,
        "data": result
    });
});

router.get('/activeList', [verifyToken, routeAccessChecker("assetUnitActiveList")], async (req, res) => {

    let result = await assetUnitModel.getActiveList();

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Asset unit active List.",
        "count": result.length,
        "data": result
    });
});

router.post('/list', [verifyToken, routeAccessChecker("assetUnitListLimit")], async (req, res) => {

    let reqData = {
        "limit": req.body.limit,
        "offset": req.body.offset,
    }

    if (!(await commonObject.checkItsNumber(reqData.limit)).success || reqData.limit < 1) {
        reqData.limit = 50;
    }

    if (!(await commonObject.checkItsNumber(reqData.offset)).success || reqData.offset < 0) {
        reqData.offset = 0;
    }
    let result = await zoneModel.getDataByWhereCondition(
        { "status": 1 },
        { "id": "ASC" },
        reqData.limit,
        reqData.offset
    );

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Asset unit List.",
        "count": result.length,
        "data": result
    });
});



router.post('/add', [verifyToken, routeAccessChecker("assetUnitAdd")], async (req, res) => {

    let reqData = {
        "title": req.body.title
    }

    reqData.created_by = req.decoded.userInfo.id;
    reqData.updated_by = req.decoded.userInfo.id;

    reqData.created_at = await commonObject.getGMT();
    reqData.updated_at = await commonObject.getGMT();



    let existingData = await assetUnitModel.getByTitle(reqData.title);


    if (!isEmpty(existingData)) {
        return res.status(409).send({
            "success": false,
            "status": 409,
            "message": existingData[0].status == "1" ? "This Title Already Exists." : "This Zone Already Exists but Deactivate, You can activate it."
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
        "name": req.body.name
    }

    reqData.updated_by = req.decoded.userInfo.id;
    let current_date = new Date(); 
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");

    let existingDataById = await assetUnitModel.getById(reqData.id);
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

            if (!isEmpty(existingDataByname) && existingDataByname[0].id != reqData.id) {

                isError = 1;
                errorMessage += existingDataByname[0].status == "1" ? "This title Already Exist." : "This title Already Exist but Deactivate, You can activate it."
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


        let result = await assetUnitModel.updateById(reqData.id, updateData);


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
    reqData.updated_by = req.decoded.userInfo.id;

    let current_date = new Date(); 
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");

    let existingDataById = await assetUnitModel.getById(reqData.id);
    if (isEmpty(existingDataById)) {

        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No data found",

        });
    }

    let data = {
        status: 0,
        updated_by: reqData.updated_by,
        updated_at: current_time
    }

    let result = await assetUnitModel.updateById(reqData.id, data);


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

    let id = req.body.id

    reqData.updated_by = req.decoded.userInfo.id;
    let current_date = new Date(); 
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");

    let existingDataById = await zoneModel.getById(id);
    if (isEmpty(existingDataById)) {

        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No data found",

        });
    }

    let data = {
        status: existingDataById[0].status == 1 ? 2 : 1,
        updated_by: reqData.updated_by,
        updated_at: current_time
    }

    let result = await assetUnitModel.updateById(reqData.id, data);


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






module.exports = router;