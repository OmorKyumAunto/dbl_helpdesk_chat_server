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
const { connectionDblystem } = require('../connections/connection');

require('dotenv').config();

// ticket dashboard count data
router.get('/count-data', [verifyToken, routeAccessChecker("TicketDashboardCountData")], async (req, res) => {
    
    const id = req.decoded.userInfo.id
    
    const total_ticket = await raiseTicketModel.getTicketDataCounting()
    const total_solved = await raiseTicketModel.getTicketTotalSolved()
    const total_unsolved = await raiseTicketModel.getTicketTotalUnsolved()
    const total_forward = await raiseTicketModel.getTicketTotalForward()
    const total_inprocess = await raiseTicketModel.getTicketTotalInprocess()

    const data = {
        total_ticket: total_ticket[0]?.total_ticket || 0,
        total_solve: total_solved[0]?.total_solved || 0,
        total_unsolved: total_unsolved[0]?.total_unsolved || 0,
        total_forward: total_forward[0]?.total_forward || 0,
        total_inprocess: total_inprocess[0]?.total_inprocess || 0,
    };

    return res.status(200).send({
        success: true,
        status: 200,
        message: "Ticket data retrieved successfully.",
        data: data, 
    });

});

router.get('/top-solve-ticket', [verifyToken, routeAccessChecker("topSolvedTicketData")], async (req, res) => {
    
    let data = await raiseTicketModel.getTopSolvedTicketList()
    return res.status(200).send({
        success: true,
        status: 200,
        message: "Top ticket solve list.",
        data: data, 
    });

});


router.get('/priority-base-ticket', [verifyToken, routeAccessChecker("priorityBaseTicket")], async (req, res) => {
    // Fetch data
    let data = await raiseTicketModel.priorityBaseTicketList();
    
    // Calculate total ticket count
    const totalTickets = data.reduce((sum, item) => sum + item.ticket_count, 0);

    // Calculate percentage for each category
    const result = data.map(item => ({
        category_id: item.category_id,
        category_title: item.category_title,
        ticket_count: item.ticket_count,
        percentage: totalTickets > 0 ? ((item.ticket_count / totalTickets) * 100).toFixed(0) : "0" 
    }));

    return res.status(200).send({
        success: true,
        status: 200,
        message: "Priority base ticket data count.",
        data: result,
    });
});



module.exports = router;