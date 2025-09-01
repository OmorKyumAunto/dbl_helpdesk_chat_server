const express = require("express");
const router = express.Router();

const { connectionDblystem } = require("./connections/connection");
global.config = require("./jwt/config");

const authenticationRouter = require("./routers/authentication");

const employeeRouter = require("./routers/employee");
const assetRouter = require("./routers/asset");
const profileRouter = require("./routers/profile");
const dashboardRouter = require("./routers/dashboard");
const unitRouter = require("./routers/asset-unit");
const adminRouter = require("./routers/admin");
const licensesRouter = require("./routers/licenses");
const locationRouter = require("./routers/location");
const ticketCategoryRouter = require("./routers/ticket-category");
const assignCategoryRouter = require("./routers/assign-category");
const raiseTicketRouter = require("./routers/raise-ticket");
const raiseTicketDashboardRouter = require("./routers/raise-ticket-dashboard");
const forgetPasswordRouter = require("./routers/forget-password");
const slaConfigurationRouter = require("./routers/sla-configuration");
const taskRouter = require("./routers/task");
const taskCategoriesRouter = require("./routers/task-categories");
const taskSubCategoryRouter = require("./routers/task-sub-category");
const taskDashboardRouter = require("./routers/task-dashboard");
const zingHrOperationRouter = require("./routers/zingHr-operations");
const reportRouter = require("./routers/report");
const buildingRouter = require("./routers/building");
const seatingLocationRouter = require("./routers/seating-location");
const unitWiseSuperAdminRouter = require("./routers/unit-wise-super-admin");
const pushNotificationRouter = require("./routers/push-notification");



router.use("/authentication", authenticationRouter);
router.use("/employee", employeeRouter);
router.use("/asset", assetRouter);
router.use("/profile", profileRouter);
router.use("/dashboard", dashboardRouter);
router.use("/asset-unit", unitRouter);
router.use("/admin", adminRouter);
router.use("/licenses", licensesRouter);
router.use("/location", locationRouter);
router.use("/ticket-category", ticketCategoryRouter);
router.use("/assign-category", assignCategoryRouter);
router.use("/raise-ticket", raiseTicketRouter);
router.use("/raise-ticket-deshboard", raiseTicketDashboardRouter);
router.use("/forget-password", forgetPasswordRouter);
router.use("/sla-configuration", slaConfigurationRouter);
router.use("/task", taskRouter);
router.use("/task-category", taskCategoriesRouter);
router.use("/task-sub-category", taskSubCategoryRouter);
router.use("/task-dashboard", taskDashboardRouter);
router.use("/zingHr-operations", zingHrOperationRouter);
router.use("/report", reportRouter);
router.use("/building", buildingRouter);
router.use("/seating-location", seatingLocationRouter);
router.use("/unit-super-admin", unitWiseSuperAdminRouter);
router.use("/notification", pushNotificationRouter);

module.exports = router;
