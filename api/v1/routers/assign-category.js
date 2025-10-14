const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const assignCategoryModel = require('../models/assign-category');
const userModel = require('../models/user');
const verifyToken = require('../middlewares/verifyToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');
const moment = require("moment");
const ticketCategoryModel = require('../models/ticket-category');

require('dotenv').config();

// category assign before list
router.get('/before-assign-list', [verifyToken, routeAccessChecker("beforeAssignList")], async (req, res) => {

    let result = await assignCategoryModel.getBeforeCategoryAssignList();

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Before assign category List.",
        "count": result.length,
        "data": result
    });
});


router.get('/after-assign-list', [verifyToken, routeAccessChecker("afterAssignList")], async (req, res) => {

    let reqData = {
        "limit": req.query.limit || 50,
        "offset": req.query.offset || 0,
        "key": req.query.key,
      };
    
      let { offset, limit, key} = reqData;
    const transformData = (data) => {
        return data.map(item => {
            let assignCategory = [];
            try {
                assignCategory = JSON.parse(item.assign_category || '[]');
            } catch (error) {
                console.error('Invalid JSON in assign_category:', item.assign_category);
                // Optionally handle the error (e.g., log it, assign a default value, etc.)
            }
            return {
                ...item,
                assign_category: assignCategory
            };
        });
    };
    
    // Fetch Data and Transform:
     let result = await assignCategoryModel.getAfterCategoryAssignList(offset, limit, key);
    const transformedResult = transformData(result);
    
    res.status(200).json({
        success: true,
        status: 200,
        message: "After assign category List.",
        count: transformedResult.length,
        data: transformedResult
    });
});


router.post('/assign-update/:id', [verifyToken, routeAccessChecker("categoryAssignUpdate")], async (req, res) => {
    const id = req.params.id
    let reqData = {
        "category_id": req.body.category_id
    }

    let current_date = new Date(); 
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
    

    reqData.created_at = current_time;


     // Get data from the database by id
    let result = await userModel.getById(id);
        if (isEmpty(result)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "User data not found."
        });
        }


    if(!Array.isArray(reqData.category_id)){
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Category should be array."
        });
    }


    for (let index = 0; index < reqData.category_id.length; index++) {
        const element = reqData.category_id[index];
          // Get data from the database by id
        let unitData = await ticketCategoryModel.getById(element);
        if (isEmpty(unitData)) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: "This ticket category not found."
            });
        }

        let existsData = await assignCategoryModel.getByIdAndUser(element,id);
        if (existsData.length) {
            return res.status(400).send({
                success: false,
                status: 400,
                message: "This ticket category id already exists."
            });
        }

        let data = {
            user_id : id,
            category_id : element,
            created_at : reqData.created_at,
        }
        let createData = await assignCategoryModel.addNew(data);   

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
        "message": "Ticket category access added Successfully."
    });

});





router.put('/update/:id', [verifyToken, routeAccessChecker("ticketCategoryUpdate")], async (req, res) => {

    let id = req.params.id
    let reqData = {
        "title": req.body.title
    }

    reqData.updated_by = req.decoded.userInfo.id;
    let current_date = new Date(); 
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");

    let existingDataById = await ticketCategoryModel.getById(id);
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

            let existingDataByname = await ticketCategoryModel.getByTitle(reqData.title);

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
        updateData.updated_at = current_time


        let result = await ticketCategoryModel.updateById(id, updateData);


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
            "message": "Ticket category successfully updated."
        });


    } else {
        return res.status(200).send({
            "success": true,
            "status": 200,
            "message": "Nothing to update."
        });
    }

});



router.delete('/delete/:id', [verifyToken, routeAccessChecker("ticketCategoryDelete")], async (req, res) => {

    let id = req.params.id
    
    let current_date = new Date(); 
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");

    let existingDataById = await ticketCategoryModel.getById(id);
    if (isEmpty(existingDataById)) {

        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No data found",

        });
    }


    let data = {
        status: 'delete',
        updated_at: current_time
    }

    let result = await ticketCategoryModel.updateById(id, data);


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
        "message": "Ticket category successfully deleted."
    });

});


router.put('/changeStatus/:id', [verifyToken, routeAccessChecker("ticketCategoryChangeStatus")], async (req, res) => {

    let id = req.params.id

    let current_date = new Date(); 
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");

    let existingDataById = await ticketCategoryModel.getById(id);
    if (isEmpty(existingDataById)) {

        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No data found",

        });
    }

    let data = {
        status: existingDataById[0].status == 'active' ? 'deactivate' : 'active',
        updated_at: current_time
    }

    let result = await ticketCategoryModel.updateById(id, data);


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
        "message": "Ticket category status has successfully changed."
    });

});




router.post('/:id', [verifyToken, routeAccessChecker("assignCategory")], async (req, res) => {

    const id = parseInt(req.params.id); 
    let reqData = {
        "category_id": req.body.category_id 
    };

    let current_date = new Date();
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
    reqData.created_at = current_time;

    // Validate user existence
    let result = await userModel.getById(id);
    if (isEmpty(result)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "User data not found."
        });
    }

    if (!Array.isArray(reqData.category_id)) {
        return res.status(400).send({
            success: false,
            status: 400,
            message: "Category should be an array."
        });
    }

    // Fetch all existing assigned categories for the user
    let existingCategories = await assignCategoryModel.getByUserId(id);
    let existingCategoryIds = existingCategories.map(item => item.category_id);

    // Find new categories to add and old categories to remove
    let categoriesToAdd = reqData.category_id.filter(catId => !existingCategoryIds.includes(catId));
    let categoriesToRemove = existingCategoryIds.filter(catId => !reqData.category_id.includes(catId));

    // Remove categories that are no longer assigned
    if (categoriesToRemove.length > 0) {
        let deleteResult = await assignCategoryModel.deleteByUserAndCategories(id, categoriesToRemove);
        if (!deleteResult.affectedRows) {
            return res.status(500).send({
                success: false,
                status: 500,
                message: "Failed to remove unselected categories."
            });
        }
    }

    // Add new categories
    for (let categoryId of categoriesToAdd) {
        let unitData = await ticketCategoryModel.getById(categoryId);
        if (isEmpty(unitData)) {
            return res.status(404).send({
                success: false,
                status: 404,
                message: `Ticket category ${categoryId} not found.`
            });
        }

        let data = {
            user_id: id,
            category_id: categoryId,
            created_at: reqData.created_at,
        };
        let createData = await assignCategoryModel.addNew(data);
        if (!createData.affectedRows) {
            return res.status(500).send({
                success: false,
                status: 500,
                message: "Failed to assign new category."
            });
        }
    }

    return res.status(200).send({
        success: true,
        status: 200,
        message: "Ticket category access updated successfully."
    });
});



router.get('/user-wise-ticket-category/:id', [verifyToken, routeAccessChecker("userWiseTicketCategory")], async (req, res) => {

   try {
     let id = parseInt(req.params.id)
    
    let userData = await userModel.getById(id);
    if (isEmpty(userData)) {
        return res.status(404).send({
            success: false,
            status: 404,
            message: "User data not found."
        });
    }

    let categoryArr = []
    // get userWise category 
    const getUserWiseCategoryId = await assignCategoryModel.getByUserId(id)
   let getCategoryInfo = []
    if(getUserWiseCategoryId.length){

    for (let index = 0; index < getUserWiseCategoryId.length; index++) {
        categoryArr.push(getUserWiseCategoryId[index].category_id);
        
    }

     getCategoryInfo = await ticketCategoryModel.getByMultiId(categoryArr)
    }
    
    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "User wise Ticket category.",
        "data":getCategoryInfo 
    });
   } catch (error) {
    console.log("Error",error)
   }

});



module.exports = router;