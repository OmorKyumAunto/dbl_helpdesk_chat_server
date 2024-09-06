const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const adminModel = require('../models/admins ');
const assetUnitModel = require('../models/asset-unit');
const verifyToken = require('../middlewares/verifyToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');
const moment = require("moment");
require('dotenv').config();


router.get('/list', [verifyToken, routeAccessChecker("adminList")], async (req, res) => {

    let result = await adminModel.getList();

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Admin List.",
        "count": result.length,
        "data": result
    });
});








module.exports = router;