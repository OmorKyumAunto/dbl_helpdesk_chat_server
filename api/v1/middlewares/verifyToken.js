var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const isEmpty = require("is-empty");

const commonObject = require('../common/common');
const userModel = require('../models/user');
const superAdminModel = require('../models/super-admins');
const adminModel = require('../models/admins ');
const employeeModel = require('../models/employee');
// const supervisorModel = require('../../models/supervisor');
// const employeeModel = require('../../models/employee');
const roleModel = require('../models/role');
const routePermissionModel = require('../permissions/route_permission');


router.use(async function (req, res, next) {
    const token = req.headers['authorization'];

    if (token) {
        jwt.verify(token, global.config.secretKey,
            {
                algorithm: global.config.algorithm

            }, async function (err, decoded) {
                if (err) {
                    return res.status(400)
                        .send({
                            "success": false,
                            "status": 400,
                            "message": "Timeout Login First"
                        });
                }

                try {

                    //api_token then decode user id,  convert to number
                    let userData = await userModel.getUserById(parseInt(await commonObject.decodingUsingCrypto(decoded.api_token)));
                    let profileInfo = {};


                    if (isEmpty(userData) || !decoded.hasOwnProperty('identity_id')) {
                        return res.status(400)
                            .send({
                                "success": false,
                                "status": 400,
                                "message": "Unauthorize Request. User not found, please login again."
                            });
                    }


                    // //  device verification 
                    // let deviceVerify = await commonObject.compareDeviceInfo(req, decoded.identity_id);
                    // if (deviceVerify === false) {
                    //     return res.status(400)
                    //         .send({
                    //             "success": false,
                    //             "status": 400,
                    //             "message": "Unauthorize Request. Login First"
                    //         });
                    // }

                    //Check Role 
                    let roleData = await roleModel.getById(userData[0].role_id);
                    if (isEmpty(roleData) || userData[0].role_id != decoded.role.role_id) {
                        return res.status(400)
                            .send({
                                "success": false,
                                "status": 400,
                                "message": "Unauthorize Request. User not found, please login again."
                            });
                    }

                    if (userData[0].role_id == 1) {
                        profileInfo = await superAdminModel.getById(userData[0].profile_id);

                    } else if (userData[0].role_id == 2) {
                        profileInfo = await adminModel.getById(userData[0].profile_id,);

                    } else if (userData[0].role_id == 3) {
                        profileInfo = await employeeModel.getById(userData[0].profile_id,);

                    } else if (userData[0].role_id == 4 || userData[0].role_id == 5) {
                        profileInfo = await employeeModel.getById(userData[0].profile_id,);

                    } else {
                        return res.status(400)
                            .send({
                                "success": false,
                                "status": 400,
                                "message": "Unauthorize Request. User not found, please login again."
                            });
                    }


                    if (isEmpty(profileInfo)) {
                        return res.status(400)
                            .send({
                                "success": false,
                                "status": 400,
                                "message": "Unauthorize Request. User not found, please login again."
                            });
                    }


                    decoded = {
                        userInfo: {
                            id: userData[0].id,
                            user_name: userData[0].user_name,
                            email: userData[0].email,
                            status: userData[0].status,
                            role_id: userData[0].role_id,
                        },
                        profileInfo: { ...profileInfo[0] },
                        role: { ...roleData[0] },
                        permissions: await routePermissionModel.getRouterPermissionList(userData[0].role_id),
                        uuid: decoded.identity_id
                    };

                   // console.log(decoded)
                    req.decoded = decoded;

                    next();

                } catch (error) {
                    console.log(error);
                    return res.status(400)
                        .send({
                            "success": false,
                            "status": 500,
                            "message": "Server down"
                        });
                }
            });
    } else {

        return res.status(400)
            .send({
                "success": false,
                "status": 400,
                "message": "Unauthorize Request"
            });
    }
});

module.exports = router;