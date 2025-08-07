const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const adminModel = require('../models/admins ');
const userModel = require('../models/user');
const assetUnitModel = require('../models/asset-unit');
const verifyToken = require('../middlewares/verifyToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');
const moment = require("moment");
const unitAccessModel = require('../models/unit-access');
const seatingLocationModel = require('../models/seating-location');

require('dotenv').config();

router.get('/list',[verifyToken, routeAccessChecker("adminList")],async (req, res) => {

    let reqData = {
      "limit": req.query.limit || 50,
      "offset": req.query.offset || 0,
      "key": req.query.key,
      "unit": req.query.unit,
  }
   let { offset, limit , key, unit}  = reqData;
  
  
  
      let result = await userModel.getEmployeeAdminList(offset, limit, key, unit);
  
      let countResult = await userModel.getTotalEmployeeAdminList(key, unit);
      for (let index = 0; index < result.length; index++) {
        const user_id = result[index].id;
    
        // Fetch access data for the current user
        const getAccessData = await unitAccessModel.getById(user_id);
        
        if (getAccessData && getAccessData.length > 0) {
            // Initialize searchAccess in the result object for the current user
            result[index].searchAccess = [];
    
            // Iterate through each access record
            for (let accessIndex = 0; accessIndex < getAccessData.length; accessIndex++) {
                const access = getAccessData[accessIndex];
    
                // Fetch the title (unit_name) from the assetUnitModel based on unit_id
                const existingDataById = await assetUnitModel.getById(access.unit_id);
    
                // Extract title from the first RowDataPacket in the array
                const unit_name = existingDataById && existingDataById.length > 0
                    ? existingDataById[0].title  // Get the title from the first RowDataPacket
                    : null;
    
                // Add the unit_name (title) to the access object and push it into searchAccess
                result[index].searchAccess.push({
                    ...access,  // Spread the existing access data
                    unit_name: unit_name  // Add the unit_name to the access record
                });
            }
        } else {
            // If no access data, assign an empty array
            result[index].searchAccess = [];
        }
    }
    
    for (let index = 0; index < result.length; index++) {
        const id = result[index].id;
        const getSeatingData = await seatingLocationModel.getByIdView(id)
        result[index].seating_location = getSeatingData
        
    }
    
      return res.status(200).send({
        success: true,
        status: 200,
        message: "Admin List.",
        total: countResult.length,
        data: result
      });
  
});


module.exports = router;