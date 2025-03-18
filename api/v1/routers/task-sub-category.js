const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');
const moment = require("moment");
const validateRequest = require("../validator/middleware");
const { taskSubCategoryCreateSchema ,taskSubCategoryUpdateSchema } = require("../validator/validate-request/task-sub-category");
require('dotenv').config();
const { current_time } = require("../validation/task/task");
const taskCategoriesModel = require("../models/task-categories");
const taskSubCategoryModel = require("../models/task-sub-category");

router.get('/list', [verifyToken, routeAccessChecker("taskSubCategory")], async (req, res) => {

    const result = await taskSubCategoryModel.getList();

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Task sub category List.",
        "count": result.length,
        "data": result
    });
});


router.post('/', [verifyToken, routeAccessChecker("addTaskSubCategory"), validateRequest(taskSubCategoryCreateSchema,'body')], async (req, res) => {

    let reqData = {
        "title": req.body.title,
        "categories_id": req.body.categories_id,
    }

    // check category is already exists or not
    let existingCategoryDataById = await taskCategoriesModel.getById(reqData.categories_id);
    if (isEmpty(existingCategoryDataById)) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "Category data found",

        });
    }

    const titleArr = reqData.title
    let result



    for (let index = 0; index < titleArr.length; index++) {
        const title = titleArr[index];
        // check this title has duplicate or not
        let existingData = await taskSubCategoryModel.getByTitle(title,reqData.categories_id);
        if (existingData.length) {
            return res.status(409).send({
                "success": false,
                "status": 409,
                "message": `This ${title} is already created.`
            });

        }

   
        const data = {
            title :  title,
            categories_id : reqData.categories_id,
            created_by : req.decoded.userInfo.id
       
        }
        result = await taskSubCategoryModel.addNew(data); 
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
        "message": "Task sub category created Successfully."
    });

});

// update
router.put('/update/:categories_id', [
    verifyToken,
    routeAccessChecker("updateTaskSubCategory"),
    validateRequest(taskSubCategoryUpdateSchema, 'body')
  ], async (req, res) => {
    try {
      const categories_id = req.params.categories_id;
      const user_id = req.decoded.userInfo.id;
      const requestTitles = req.body.title; 
  
      if (!Array.isArray(requestTitles) || requestTitles.length === 0) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Title array is required and cannot be empty."
        });
      }
  
      // Get existing titles for the given category
      let existingData = await taskSubCategoryModel.getByCategoryId(categories_id);
      if (!existingData || existingData.length === 0) {
        return res.status(404).send({
          success: false,
          status: 404,
          message: "No data found for the given category ID."
        });
      }
  
      // Create sets for easy comparison
      const requestTitlesSet = new Set(requestTitles);
      const existingTitlesSet = new Set(existingData.map(item => item.title));
  
    
      let deleteIds = [];
      for (const record of existingData) {
        if (!requestTitlesSet.has(record.title)) {
          deleteIds.push(record.id);
        }
      }
  

      // New titles are those in the request but not in DB
      let insertData = [];
      for (const title of requestTitles) {
        if (!existingTitlesSet.has(title)) {
          insertData.push({
            categories_id,
            title,
            created_by: user_id
          });
        }
      }
  
      // Process deletion one by one
      if (deleteIds.length > 0) {
        for (const id of deleteIds) {
          const deleteData = {
            status: 0,
            updated_by: user_id
          };
          const deleteResult = await taskSubCategoryModel.updateById(id, deleteData);
          if (!deleteResult || deleteResult.affectedRows < 1) {
            return res.status(500).send({
              success: false,
              status: 500,
              message: `Failed to delete record with id ${id}`
            });
          }
        }
      }
  
      // Process insertion one by one
      if (insertData.length > 0) {
        for (const data of insertData) {
          const insertResult = await taskSubCategoryModel.addNew(data);
          if (!insertResult || insertResult.affectedRows < 1) {
            return res.status(500).send({
              success: false,
              status: 500,
              message: `Failed to insert title: ${data.title}`
            });
          }
        }
      }
  
      return res.status(200).send({
        success: true,
        status: 200,
        message: "title successfully updated",

      });
  
    } catch (error) {
      console.error("Error updating task subcategories:", error);
      return res.status(500).send({
        success: false,
        status: 500,
        message: "Internal Server Error"
      });
    }
});
  


router.delete('/delete/:id', [verifyToken, routeAccessChecker("deleteTaskSubCategory")], async (req, res) => {

    let id = parseInt(req.params.id)
    const user_id = req.decoded.userInfo.id;
    updated_by = user_id


    let existingDataById = await taskSubCategoryModel.getById(id);
    if (isEmpty(existingDataById)) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No data found",

        });
    }


    let data = {
        status: 0,
        updated_by: updated_by,
    }

    let result = await taskSubCategoryModel.updateById(id, data);


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
        "message": "Task sub category successfully deleted."
    });

});







module.exports = router;