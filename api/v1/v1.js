const express = require("express");
const router = express.Router();


const { connectionDblystem } = require('./connections/connection');
global.config = require('./jwt/config');




const authenticationRouter = require('./routers/authentication');

const employeeRouter = require('./routers/employee');
const assetRouter = require('./routers/asset');
const profileRouter = require('./routers/profile');
const dashboardRouter = require('./routers/dashboard');
const  unitRouter = require('./routers/asset-unit');




router.use('/authentication', authenticationRouter);
router.use('/employee', employeeRouter);
router.use('/asset', assetRouter);
router.use('/profile', profileRouter);
router.use('/dashboard', dashboardRouter);
router.use('/asset-unit', unitRouter);



module.exports = router;  