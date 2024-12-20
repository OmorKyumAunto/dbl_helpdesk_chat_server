const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const assetUnitModel = require('../models/asset-unit');
const raiseTicketModel = require('../models/raise-ticket');
const assetAssignModel = require('../models/asset-assign');
const ticketCategoryModel = require('../models/ticket-category');
const userModel = require('../models/user');
const ticketCommentModel = require('../models/ticket-comment')
const ticketForwordModel = require('../models/ticket-forword')
const verifyToken = require('../middlewares/verifyToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');
const moment = require("moment");
//const multer = require('multer');
//const upload = multer();
const common = require('../common/common');
const { upload, multerErrorHandler} = require('../common/upload-image')

require('dotenv').config();

// ticket dashboard count data
router.get('/count-data', [verifyToken, routeAccessChecker("TicketDashboardCountData")], async (req, res) => {
    

    req.query

    return res.status(500).send({
        success: false,
        status: 500,
        message: "Get ticket dashboard count data.",
    });
    
});


module.exports = router;