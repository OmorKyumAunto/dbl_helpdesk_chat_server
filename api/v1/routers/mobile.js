const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const assetUnitModel = require('../models/asset-unit');
const announcementModel = require('../models/announcement');
const verifyToken = require('../middlewares/verifyToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');
const unitAccessModel = require("../models/unit-access");
const employeeModel = require("../models/employee");
const userModel = require("../models/user");
const seatingLocationModel = require("../models/seating-location");
const validateRequest = require("../validator/middleware");
const { sendAnnouncementSchema } = require("../validator/validate-request/announcement");
const { idParamsSchema } = require("../validator/validate-request/common-validator");
require('dotenv').config();


router.post(
  '/send-announcement',
  [
    verifyToken,
    routeAccessChecker("sendAnnouncement"),
    validateRequest(sendAnnouncementSchema, 'body')
  ],
  async (req, res) => {

    try {
      const self_id = req.decoded.userInfo.id;

      let reqData = {
        title: req.body.title,
        description: req.body.description,
        announcement_date: req.body.announcement_date,
        break_time: req.body.break_time,
        priority: req.body.priority,
        created_by: self_id,
        updated_by: self_id
      };

      const unitIds = req.body.unit_id;

      if (unitIds && Array.isArray(unitIds) && unitIds.length > 0) {

        for (const unit of unitIds) {
          const unitCheck = await assetUnitModel.getById(unit);

          if (!unitCheck.length) {
            return res.status(404).send({
              success: false,
              status: 404,
              message: `Unit ID ${unit} not found`
            });
          }

          const insertData = {
            ...reqData,
            unit_id: unit
          };

          const result = await announcementModel.addNew(insertData);

          if (!result?.affectedRows) {
            return res.status(500).send({
              success: false,
              status: 500,
              message: "Database error during announcement insert."
            });
          }
        }

      } else {
        reqData.unit_id = null;
        const result = await announcementModel.addNew(reqData);

        if (!result?.affectedRows) {
          return res.status(500).send({
            success: false,
            status: 500,
           "message": "Something Wrong in system database."
          });
        }
      }

      return res.status(201).send({
        success: true,
        status: 201,
        message: "Announcement successfully sent."
      });

    } catch (error) {
      console.error("Error sending announcement:", error);

      return res.status(500).send({
        success: false,
        status: 500,
        message: "Internal Server Error",
        error: error?.message
      });
    }

  }
);
;




router.get('/mobile-announcement', [verifyToken, routeAccessChecker("getAnnouncement")], async (req, res) => {

    const {limit = 10,offset = 0} = req.query
    const {id,role_id} = req.decoded.userInfo

    let result
    let countData
    if(role_id === 1){
     result = await announcementModel.getListMobileForSuperAdmin(offset,limit);
     countData = await announcementModel.getListMobileForSuperAdminCount();
    }

    if(role_id === 2 || role_id === 4){
     const getUnit = await unitAccessModel.getById(id)
     const unitIds = getUnit.map(u => u.unit_id);    
     result = await announcementModel.getListMobileForAdmin(offset,limit,unitIds);
     countData = await announcementModel.getListMobileForAdminCount(unitIds);   
    }

    if(role_id === 3){
     const userInfo = await userModel.getById(id)
     const employeeInfo = await employeeModel.getById(userInfo[0].profile_id)
     const unitInfo = await seatingLocationModel.getByIdViewData(employeeInfo[0].seating_location)
     result = await announcementModel.getListMobileForEmployee(offset,limit,unitInfo[0]?.unit_id || null);
     countData = await announcementModel.getListMobileForAdminCount(unitInfo[0]?.unit_id || null);     
    }

 
    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Mobile Announcement List.",
        "count": countData.length,
        "data": result
    });
});




router.get('/mobile-announcement-list', [verifyToken, routeAccessChecker("getAnnouncementListWeb")], async (req, res) => {

    const {limit = 50,offset = 0} = req.query
    const {id,role_id} = req.decoded.userInfo

    let result
    let countData
    if(role_id === 1){
     result = await announcementModel.getListMobileForSuperAdmin(offset,limit);
     countData = await announcementModel.getListMobileForSuperAdminCount();
    }

    if(role_id === 4){
     const getUnit = await unitAccessModel.getById(id)
     const unitIds = getUnit.map(u => u.unit_id);    
     result = await announcementModel.getListMobileForAdmin(offset,limit,unitIds);
     countData = await announcementModel.getListMobileForAdminCount(unitIds);   
    }


    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Mobile Announcement List.",
        "count": countData.length,
        "data": result
    });
});



router.delete('/delete/:id', [verifyToken, routeAccessChecker("mobileAnnouncementDelete"),validateRequest(idParamsSchema,'params')], async (req, res) => {

    let id = req.params.id
    const self_id = req.decoded.userInfo.id;

    let existingDataById = await announcementModel.getById(id);
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
            "message": "You do not have permission to delete this announcement.",
        });
    }


    let data = {
        status: 0,
        updated_by: self_id,
    }

    let result = await announcementModel.updateById(id, data);


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
        "message": "Announcement successfully deleted."
    });

});


module.exports = router;