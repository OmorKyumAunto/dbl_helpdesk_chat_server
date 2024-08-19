const express = require("express");
const router = express.Router();


const { connectionDblystem } = require('./connections/connection');
global.config = require('./jwt/config');




const authenticationRouter = require('./routers/authentication');

const employeeRouter = require('./routers/employee');




router.use('/authentication', authenticationRouter);
router.use('/employee', employeeRouter);



module.exports = router;  