const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const slaConfigurationModel = require('../models/sla-configuration');
const verifyToken = require('../middlewares/verifyToken');
const {validatePriority} = require('../validation/sla-configuration/sla-configuration');
const { routeAccessChecker } = require('../middlewares/routeAccess');
const moment = require("moment");

require('dotenv').config();





router.get('/list', [verifyToken, routeAccessChecker("slaList")], async (req, res) => {
    let result = await slaConfigurationModel.getList();
      return res.status(200).send({
          "success": true,
          "status": 200,
          "message": "SLA list List.",
          "data": result
      });
});



router.put('/:id', [verifyToken, routeAccessChecker("slaConfiguration")], async (req, res) => {

    let reqData = {
        "response_time_value": parseInt(req.body.response_time_value),
        "response_time_unit": req.body.response_time_unit,
        "resolve_time_value": parseInt(req.body.resolve_time_value),
        "resolve_time_unit": req.body.resolve_time_unit,
    }

    reqData.updated_by = req.decoded.userInfo.id;

    const id = parseInt(req.params.id)

    const existingSlaConfig = await slaConfigurationModel.getById(id)
    if(isEmpty(existingSlaConfig)){
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": 'Sla not found.'
        });  
    }

        // validate response_time_value
        if(isEmpty(reqData.response_time_value)){
            return res.status(400).send({
                "success": false,
                "status": 400,
                "message": 'Response time value can not be empty.'
            }); 
        }
    
        if(reqData.response_time_value < 0){
            return res.status(400).send({
                "success": false,
                "status": 400,
                "message": 'Please give a valid time.'
            }); 
        }

    // validate response_time_unit
    if(isEmpty(reqData.response_time_unit)){
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": 'Response time unit can not be empty.'
        }); 
    }

if (reqData.response_time_unit !== 'minutes' && reqData.response_time_unit !== 'hours' && reqData.response_time_unit !== 'day' && reqData.response_time_unit !== 'month') {
    return res.status(400).send({
        "success": false,
        "status": 400,
        "message": 'Invalid response time unit.'
    });
}



         // validate resolve_time_value
         if(isEmpty(reqData.resolve_time_value)){
            return res.status(400).send({
                "success": false,
                "status": 400,
                "message": 'Resolve time value can not be empty.'
            }); 
        }
    
        if(reqData.resolve_time_value < 0){
            return res.status(400).send({
                "success": false,
                "status": 400,
                "message": 'Please give a valid time.'
            }); 
        }


   // validate resolve_time_unit
    if(isEmpty(reqData.resolve_time_unit)){
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": 'Response time unit can not be empty.'
        }); 
    }

    if(reqData.resolve_time_unit !== 'minutes' && reqData.resolve_time_unit !== 'hours' && reqData.resolve_time_unit !== 'day' && reqData.resolve_time_unit !== 'month'){
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": 'Invalid resolve time unit.'
        }); 
    }

   const result = await slaConfigurationModel.updateById(id,reqData);
    

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
        "message": "Sla configuration update Successfully."
    });

});







module.exports = router;