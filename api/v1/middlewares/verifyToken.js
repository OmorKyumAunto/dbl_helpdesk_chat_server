var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const isEmpty = require("is-empty");
const keyData =  require('../jwt/config');
const userModel = require('../models/user')



router.use(async function (req, res, next) {

    const token = req.headers['x-access-token'];

    try {
        if (token) {
            const decoded = jwt.verify(token, "M360ICTMusicLibrary", { algorithm: 'HS256' });
            req.user = decoded;
            next();
        } else {
            return res.status(400).json({
                success: false,
                status: 400,
                message: "Unauthorized Request"
            });
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: "Invalid Token or Timeout. Please Login First"
        });
    }
});



module.exports = router;
