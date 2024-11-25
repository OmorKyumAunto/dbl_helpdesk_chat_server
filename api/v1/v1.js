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
const  adminRouter = require('./routers/admin');
const  licensesRouter = require('./routers/licenses');
const  locationRouter = require('./routers/location');




router.use('/authentication', authenticationRouter);
router.use('/employee', employeeRouter);
router.use('/asset', assetRouter);
router.use('/profile', profileRouter);
router.use('/dashboard', dashboardRouter);
router.use('/asset-unit', unitRouter);
router.use('/admin', adminRouter);
router.use('/licenses', licensesRouter);
router.use('/location', locationRouter);




module.exports = router;  