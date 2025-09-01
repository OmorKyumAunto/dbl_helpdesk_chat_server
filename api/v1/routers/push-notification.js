const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const validateRequest = require("../validator/middleware");
const {notificationInfoSchema} = require("../validator/validate-request/notification");
const verifyToken = require('../middlewares/verifyToken');
const { routeAccessChecker } = require('../middlewares/routeAccess');
const pushNotificationModel = require('../models/push-notification');
const admin = require("../common/firebase");
require('dotenv').config();




router.post('/push-tokens', [verifyToken, routeAccessChecker("pushTokens"),validateRequest(notificationInfoSchema,'body')], async (req, res) => {

    let reqData = {
        "token": req.body.token,
        "platform": req.body.platform,
        "device_id": req.body.device_id,
        "device_info": req.body.device_id
    }

    const id = req.decoded.userInfo.id

    const existingByUserId = await pushNotificationModel.getByUserId(id)

    if(existingByUserId.length){
        await pushNotificationModel.updateById(id,reqData)
    }else{
    reqData.user_id = id
    let result = await pushNotificationModel.addNew(reqData);

    if (result.affectedRows == undefined || result.affectedRows < 1) {
        return res.status(500).send({
            "success": false,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    }
    }
    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Notification info modified Successfully."
    });

});


// Send notification by userId
router.post("/send-notification", async (req, res) => {
  const {title, body } = req.body;
  const id = req.decoded.userInfo.id
  try {
    // Get user's token from DB
    const [rows] = await db.query(
      "SELECT token FROM push_tokens WHERE user_id = ? ORDER BY last_seen_at DESC LIMIT 1",
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: "No token found" });
    }

    

    const token = rows[0].token;

    const message = {
      notification: {
        title,
        body,
      },
      token,
    };

    // Send via Firebase
    const response = await admin.messaging().send(message);

    res.json({ success: true, response });
  } catch (err) {
    console.error("Error sending notification:", err);
    res.status(500).json({ success: false });
  }
});


module.exports = router;