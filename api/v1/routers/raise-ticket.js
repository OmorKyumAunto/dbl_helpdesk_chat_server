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
    let {key = '',priority='',status='', offset = 0,limit = 10} = req.query
    let result = await raiseTicketModel.getAllListUserWise(id,key,priority,status,offset,limit);
    let totalResult = await raiseTicketModel.getAllListTotalCountUserWise(id,key,priority,status);
    return res.status(200).send({
        success: true,
        status: 200,
        message: "User wise ticket List.",
        total: totalResult.length,
        data: result,
    });
});


router.post('/',[verifyToken,routeAccessChecker("raiseTicket"),upload.single('attachment')],async (req, res, next) => {
try {               
   
    if (req.file) {
        req.body.attachment = req.file.path; 
    } else {
        req.body.attachment = null; 
    }

    let reqData = {
        "unit_id": parseInt(req.body.unit_id),
        "category_id": parseInt(req.body.category_id),
        "priority": req.body.priority,
        "subject": req.body.subject,
        "cc": parseInt(req.body.cc),
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

   let getUnitAndCategoryMatchEmail = await raiseTicketModel.getUnitAndCategoryWiseEmail(reqData.unit_id,reqData.category_id)

   //let getUnitAndCategoryMatchEmail = [{email:'omorkyumaunto16@gmail.com'},{email:'omor.aunto@jtml-dbl.com'}]

//    let ccData
//    if(reqData.cc){
//     let ccEmail = await userModel.getById(parseInt(reqData.cc));
//     if(ccEmail.length){
//         ccData = {
//             supervisor_name : ccEmail[0]?.name || "",
//             supervisor_email : ccEmail[0]?.email || "",
//             ticket_id : reqData.ticket_id,
//             subject : reqData.subject,
//             priority: reqData.priority.charAt(0).toUpperCase() + reqData.priority.slice(1).toLowerCase(),
//             unit_name : unit[0].title,
//             created_by : user[0].name,
//             created_employee_id : user[0].employee_id,
//         }
//         reqData.cc = ccEmail[0].email
//     }else{
//         return res.status(404).send({
//             "success": false,
//             "status": 404,
//             "message": "CC user not found",

//         });
//     }
   
//    }
    let ccData = null; 

    if (reqData.cc) {
        const ccId = parseInt(reqData.cc); 
        if (!isNaN(ccId)) {
            const ccEmail = await userModel.getById(ccId);
            if (ccEmail.length) {
                ccData = {
                    supervisor_name: ccEmail[0]?.name || "",
                    supervisor_email: ccEmail[0]?.email || "",
                    ticket_id: reqData.ticket_id,
                    subject: reqData.subject,
                    priority: reqData.priority.charAt(0).toUpperCase() + reqData.priority.slice(1).toLowerCase(),
                    unit_name: unit[0].title,
                    created_by: user[0].name,
                    created_employee_id: user[0].employee_id,
                };
                reqData.cc = ccEmail[0].email; 
            } else {
    
                reqData.cc = null;
            }
        } else {
        
            reqData.cc = null;
        }
    } else {

        reqData.cc = null;
    }
   
    let result = await raiseTicketModel.addNew(reqData);

    //await common.sentTicketEmail('omorkyumaunto16@gmail.com','Raise Create',data)
    if (getUnitAndCategoryMatchEmail.length) {
        // Create a Set to store unique emails
        const uniqueEmails = new Set(
            getUnitAndCategoryMatchEmail.map(item => item.email)
        );

        // Iterate over unique emails
        for (const admin_email of uniqueEmails) {
            await common.sentTicketEmail(admin_email, 'Ticket Notification', data );
        }
    }
    
    if(reqData.cc){
        await common.sentTicketCcEmail(ccData.supervisor_email,'Ticket Notification', ccData );
     }
   

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
        } catch (error) {
            next(error); 
        }
    },
    multerErrorHandler 
);



// admin wise get ticket list
router.get('/admin-ticket-list', [verifyToken, routeAccessChecker("adminWiseTicketList")], async (req, res) => {

    let id = req.decoded.userInfo.id
    let {key = '',priority= '',status= '',offset = 0,limit = 10} = req.query
    let result = await raiseTicketModel.getAdminWiseTicket(id,key,priority,status, offset,limit);
    let totalCountResult = await raiseTicketModel.getAdminWiseTicketTotalCount(id,key,priority,status);
    return res.status(200).send({
        success: true,
        status: 200,
        message: "Admin wise ticket List.",
        total: totalCountResult.length,
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
   
   let { key = '',priority = '',status = '', offset = 0,limit = 10} = req.query

    let result = await raiseTicketModel.getSuperAdminTicket(key,priority,status,offset,limit)
    let toalResult = await raiseTicketModel.getSuperAdminTicketTotalCount(key,priority,status)
    return res.status(200).send({
        success: true,
        status: 200,
        message: "Super admin raise ticket List.",
        total: toalResult.length,
        data: result,
    });

});



// create ticket employee
router.post('/comment', [verifyToken, routeAccessChecker("ticketComment")], async (req, res) => {

    let reqData = {
        "ticket_id": parseInt(req.body.ticket_id),
        "comment_text": req.body.comment_text,
    }

    const id = req.decoded.userInfo.id

    let user = await userModel.getById(id);

    let existsRaiseTicket = await raiseTicketModel.getById(reqData.ticket_id);

    if (!existsRaiseTicket) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "This ticket not found.",

        });
    }

    if(user[0].role_id === 3 ){
        if (existsRaiseTicket[0].created_by !==  id) {
            return res.status(400).send({
                "success": false,
                "status": 400,
                "message": "This ticket is created by another employee.",
    
            });
        }
    
    }

    if(!reqData.comment_text){
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Commnet should not be empty.",

        });
    }

    // if(user.role_id === 3 && id !== existsRaiseTicket[0].created_by){
    //     return res.status(400).send({
    //         "success": false,
    //         "status": 400,
    //         "message": "You have not access this ticket comment.",

    //     });
    // }

    if(user[0].role_id === 3 )reqData.employee_id = id
    if(user[0].role_id === 2 )reqData.admin_id = id

    
    let result = await ticketCommentModel.addNew(reqData)


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
        "message": "Ticket comment added Successfully."
    });

});


// comment details
router.get('/comment-details/:id', [verifyToken, routeAccessChecker("ticketDetails")], async (req, res) => {
    const id = parseInt(req.params.id); 

    let existsRaiseTicket = await raiseTicketModel.getById(id);
    if (!existsRaiseTicket) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "This ticket not found.",
        });
    }
    let result = await ticketCommentModel.getById(id);

    for (let index = 0; index < result.length; index++) {
        const { employee_id, admin_id } = result[index];
        let user;
        if (employee_id) {
            user = await userModel.getById(employee_id);
        } else if (admin_id) {
            user = await userModel.getById(admin_id);
        }
        if (user && user.length > 0) {
            result[index].user_name = user[0].name;
            result[index].employee_id = user[0].employee_id || null;
        }
    }

    return res.status(200).send({
        success: true,
        status: 200,
        message: "Get comment list.",
        count: result.length,
        data: result,
    });
});


router.put('/comment/:id', [verifyToken, routeAccessChecker("ticketCommentEdit")], async (req, res) => {


   let table_id = parseInt(req.params.id)

    let reqData = {
        "comment_text": req.body.comment_text,
    }

    const id = req.decoded.userInfo.id

    let user = await userModel.getById(id);

    let comment = await ticketCommentModel.getByTableId(table_id);

    if (!comment) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "This ticket comment not found.",

        });
    }
    
    if(user[0].role_id == 2){
        if(comment[0].admin_id !== id){
            return res.status(400).send({
                "success": false,
                "status": 400,
                "message": "Your have not any edit permission.",
    
            });
        }
    }
    if(user[0].role_id == 3){
        if(comment[0].employee_id !== id){
            return res.status(400).send({
                "success": false,
                "status": 400,
                "message": "Your have not any edit permission.",
    
            });
        }
    }

    let update_data = {
        is_edit : 1,
        comment_text : reqData.comment_text
    }

    let result = await ticketCommentModel.updateById(table_id,update_data)


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
        "message": "Ticket comment update Successfully."
    });

});


router.post('/ticket-forword/:id', [verifyToken, routeAccessChecker("ticketForworded")], async (req, res) => {
    
    let table_id = parseInt(req.params.id)

     let reqData = {
        "unit_id" : req.body.unit_id,
        "category_id" : req.body.category_id,
        "subject": req.body.subject,
        "remarks": req.body.remarks,
     }
 
     const id = req.decoded.userInfo.id

     if (!table_id) {
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Ticket id should not be empty.",
        });
    }

     let ticket = await raiseTicketModel.getById(table_id);
     console.log("first",ticket)
     if (!ticket.length) {
         return res.status(404).send({
             "success": false,
             "status": 404,
             "message": "This ticket  not found.",
         });
     }
      

    let adminTicket = await raiseTicketModel.getAdminWiseTicketById(id,table_id);
    if (!adminTicket.length) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "This ticket not under you.",
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
     
    let category = await ticketCategoryModel.getById(reqData.category_id);
    if (!category.length) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "This category not found",

        });
    }
 
    let user = await userModel.getById(id)

     let forword_data = {
         ticket_id : table_id,
         unit_id : reqData.unit_id,
         category_id : reqData.category_id,
         remarks : reqData.remarks,
         details : `The ticket has been forwarded by ${user[0].name} to the Unit: ${unit[0].title} and Category: ${category[0].title}. Remarks: ${reqData.remarks}..`,
         created_by : id
     }

    if (!reqData.subject) {
        reqData.subject = ticket[0]?.subject;
    }

     let ticket_data = {
        unit_id : reqData.unit_id,
        category_id : reqData.category_id,
        subject : reqData.subject
     }

  
     // try to apply transaction this api
 
     let result = await ticketForwordModel.addNew(forword_data)
     let update_ticket = await raiseTicketModel.updateById(table_id,ticket_data)
 
 
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
         "message": "Ticket Successfully Forwarded."
     });
 
});

router.get('/ticket-forword-list', [verifyToken, routeAccessChecker("ticketForwordedList")], async (req, res) => {
    
    let {offset = 0,limit = 10} = req.query

    let result = await ticketForwordModel.getList(offset,limit)
    return res.status(200).send({
        success: true,
        status: 200,
        message: "Forword ticket list.",
        count: result.length,
        data: result,
    });

});

// router.delete('/delete/:id', [verifyToken, routeAccessChecker("assetUnitDelete")], async (req, res) => {

//     let id = req.params.id
    
//     updated_by = req.decoded.userInfo.id;

//     let current_date = new Date(); 
//     let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");

//     let existingDataById = await locationModel.getById(id);
//     if (isEmpty(existingDataById)) {
//         return res.status(404).send({
//             "success": false,
//             "status": 404,
//             "message": "No data found",

//         });
//     }


//     let data = {
//         status: 0,
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
//         "message": "Location successfully deleted."
//     });

// });


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