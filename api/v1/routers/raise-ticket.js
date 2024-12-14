const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const assetUnitModel = require('../models/asset-unit');
const raiseTicketModel = require('../models/raise-ticket');
const assetAssignModel = require('../models/asset-assign');
const ticketCategoryModel = require('../models/ticket-category');
const userModel = require('../models/user');
const verifyToken = require('../middlewares/verifyToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');
const moment = require("moment");
const multer = require('multer');
const upload = multer();
const common = require('../common/common');

require('dotenv').config();


router.get('/active-list', [verifyToken, routeAccessChecker("locationActiveList")], async (req, res) => {
    try {
        let result = await locationModel.getList();

        for (let index = 0; index < result.length; index++) {
            const element = result[index].unit_id;

            let units = await assetUnitModel.getById(element);

            if (units.length > 0) {
                result[index].unit_name = units[0]?.title || ""; 
            } 
        }

        return res.status(200).send({
            success: true,
            status: 200,
            message: "Location active List.",
            count: result.length,
            data: result,
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            status: 500,
            message: "An error occurred while fetching the location list.",
        });
    }
});


// employee wise ticket list get
router.get('/user-wise-ticket', [verifyToken, routeAccessChecker("userWiseTicket")], async (req, res) => {

    let id = req.decoded.userInfo.id
    let {key,priority,status} = req.query
    let result = await raiseTicketModel.getAllListUserWise(id,key,priority,status);
    return res.status(200).send({
        success: true,
        status: 200,
        message: "User wise ticket List.",
        count: result.length,
        data: result,
    });
});


// create ticket employee
router.post('/', [verifyToken, routeAccessChecker("raiseTicket"),upload.none()], async (req, res) => {

    let reqData = {
        "unit_id": parseInt(req.body.unit_id),
        "category_id": parseInt(req.body.category_id),
        "priority": req.body.priority,
        "subject": req.body.subject,
        "cc": req.body.cc,
        "description": req.body.description,
        "attachment": req.body.attachment,
    }
    if (req.body.asset_id) {
        reqData.asset_id = parseInt(req.body.asset_id);
    }
 
    const my_id = req.decoded.userInfo.id;
    reqData.created_by = my_id

    let checkEmployee = await userModel.getDataById(my_id);
    if (checkEmployee[0].role_id !== 3 ) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Your are not employee.",

        });
    }

    if(!reqData.unit_id){
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Unit should not be empty.",

        });
    }

    let unit = await assetUnitModel.getById(reqData.unit_id);
    if (!unit.length) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "This unit not found",

        });
    }

    if(!reqData.category_id){
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Category should not be empty.",

        });
    }

    if(reqData.asset_id){
        let asset = await assetAssignModel.getByIdUserWise(reqData.asset_id,my_id);
        if (!asset) {
            return res.status(404).send({
                "success": false,
                "status": 404,
                "message": "You are not assign this asset.",
    
            });
        }
    }
   


    let category = await ticketCategoryModel.getById(reqData.category_id);
    if (!category.length) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "This category not found",

        });
    }

    if(!reqData.priority){
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Priority should not be empty.",

        });
    }

    if(!reqData.subject){
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Subject should not be empty.",

        });
    }
    if(!reqData.description){
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Description should not be empty.",

        });
    }
   
    reqData.ticket_id = common.rendomGenerator()
    let  user = await userModel.getById(req.decoded.userInfo.id);
    let data = {
        ticket_id : reqData.ticket_id,
        subject : reqData.subject,
        priority: reqData.priority.charAt(0).toUpperCase() + reqData.priority.slice(1).toLowerCase(),
        unit_name : unit[0].title,
        created_by : user[0].name,
        created_employee_id : user[0].employee_id,
    }


    let result = await raiseTicketModel.addNew(reqData);


     await common.sentTicketEmail('omorkyumaunto16@gmail.com','Raise Create',data)

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
        "message": "Raise ticket added Successfully."
    });

});





// admin wise get ticket list
router.get('/admin-ticket-list', [verifyToken, routeAccessChecker("adminWiseTicketList")], async (req, res) => {

    let id = req.decoded.userInfo.id
    let {key,priority,status} = req.query
    let result = await raiseTicketModel.getAdminWiseTicket(id,key,priority,status);
    return res.status(200).send({
        success: true,
        status: 200,
        message: "Admin wise ticket List.",
        count: result.length,
        data: result,
    });
});


router.put('/admin-update-status/:id', [verifyToken, routeAccessChecker("adminUpdateStatus")], async (req, res) => {

    let id = req.params.id

    let user_id = req.decoded.userInfo.id
    let reqData = {
        "ticket_status": req.body.ticket_status
    }

    let current_date = new Date(); 
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");

    let existingDataById = await raiseTicketModel.adminWiseTicketDetails(user_id,id);
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
    if (existingDataById[0].ticket_status !== reqData.ticket_status) {
        willWeUpdate = 1;
        updateData.ticket_status = reqData.ticket_status;
    }

    if (isError == 1) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": errorMessage
        });
    }

    if (willWeUpdate == 1) {
        updateData.updated_at = current_time
        updateData.updated_by = id

        let result = await raiseTicketModel.updateById(id, updateData);

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
            "message": "Status successfully updated."
        });


    } else {
        return res.status(200).send({
            "success": true,
            "status": 200,
            "message": "Nothing to update."
        });
    }

});


// super admin get raise ticket list
router.get('/raise-ticket', [verifyToken, routeAccessChecker("allRaiseTicketList")], async (req, res) => {

    let result = await raiseTicketModel.getSuperAdminTicket();
    return res.status(200).send({
        success: true,
        status: 200,
        message: "Super admin raise ticket List.",
        count: result.length,
        data: result,
    });

});




router.delete('/delete/:id', [verifyToken, routeAccessChecker("assetUnitDelete")], async (req, res) => {

    let id = req.params.id
    
    updated_by = req.decoded.userInfo.id;

    let current_date = new Date(); 
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");

    let existingDataById = await locationModel.getById(id);
    if (isEmpty(existingDataById)) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No data found",

        });
    }


    let data = {
        status: 0,
        updated_at: current_time
    }

    let result = await locationModel.updateById(id, data);


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
        "message": "Location successfully deleted."
    });

});


// router.put('/changeStatus/:id', [verifyToken, routeAccessChecker("changeLocationStatus")], async (req, res) => {

//     let id = req.params.id

//     let current_date = new Date(); 
//     let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");

//     let existingDataById = await locationModel.getByNonDeleteData(id);
//     if (isEmpty(existingDataById)) {
//         return res.status(404).send({
//             "success": false,
//             "status": 404,
//             "message": "No data found",

//         });
//     }

//     let data = {
//         status: existingDataById[0].status == 1 ? 2 : 1,
//         updated_at: current_time
//     }

//     let result = await locationModel.updateById(id, data);


//     if (result.affectedRows == undefined || result.affectedRows < 1) {
//         return res.status(500).send({
//             "success": true,
//             "status": 500,
//             "message": "Something Wrong in system database."
//         });
//     }


//     return res.status(200).send({
//         "success": true,
//         "status": 200,
//         "message": "Location status has successfully changed."
//     });

// });




module.exports = router;