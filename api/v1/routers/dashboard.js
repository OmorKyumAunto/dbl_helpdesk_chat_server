const express = require("express");
const router = express.Router();
const employeeModel = require("../models/employee");
const assetModel = require("../models/asset");
const assignModel = require("../models/asset-assign");
const verifyToken = require("../middlewares/verifyToken");
const { routeAccessChecker } = require("../middlewares/routeAccess");
const unitAccessModel = require("../models/unit-access");

// list
router.get(
  "/dashboard-data",
  [verifyToken, routeAccessChecker("dashboardData")],
  async (req, res) => {
    let data = await assetModel.getListOfDashboard();
    let data2 = await assetModel.getListOfDashboard2();
    let data3 = await assetModel.getListOfDashboard3();

    let result = {
      total_asset: data[0].total_asset,
      total_employee: data2[0].total_employee,
      total_assign_asset: data3[0].total_assign_asset,
    };

    return res.status(200).send({
      success: false,
      status: 200,
      message: "Dashboard data.",
      data: result,
    });
  }
);

router.get(
  "/dashboard-graph-data",
  [verifyToken, routeAccessChecker("dashboardGraphData")],
  async (req, res) => {
    try {
      const { id, role_id } = req.decoded.userInfo;

      let resultAssign;
      let resultTotal;

      if (role_id === 1) {
        resultAssign = await assetModel.getListOfDashboardGraph();
        resultTotal = await assetModel.getListOfDashboardGraph2();
      }
      if (role_id === 4) {
        const getUnit = await unitAccessModel.getById(id)
        const unitIds = getUnit.map(u => u.unit_id); 
        resultAssign = await assetModel.getListOfDashboardGraphUnitSuperAdmin(unitIds);
        resultTotal = await assetModel.getListOfDashboardGraph2UnitSuperAdmin(unitIds);
      } 
      if (role_id === 2) {
        resultAssign = await assetModel.getListOfDashboardGraphAdmin(id);
        resultTotal = await assetModel.getListOfDashboardGraph2Admin(id);
      } 


      // Month names mapping
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      // Initialize an array with all months set to 0
      let data = [];
      const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-based
      for (let i = 0; i < 12; i++) {
        const month = (currentMonth - i + 12) % 12 || 12;
        data.push({
          month: month.toString(),
          name: monthNames[month - 1], // Add month name here
          total_assign_asset: 0,
          total_asset: 0,
        });
      }

      // Populate the array with total_assign_asset data
      resultAssign.forEach((item) => {
        const monthIndex = data.findIndex(
          (d) => d.month === item.month.toString()
        );
        if (monthIndex !== -1) {
          data[monthIndex].total_assign_asset = item.total_assign_asset;
        }
      });

      // Populate the array with total_asset data
      resultTotal.forEach((item) => {
        const monthIndex = data.findIndex(
          (d) => d.month === item.month.toString()
        );
        if (monthIndex !== -1) {
          data[monthIndex].total_asset = item.total_asset;
        }
      });

      return res.status(200).send({
        success: true,
        status: 200,
        message: "Dashboard data.",
        data: data.reverse(),
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        status: 500,
        message: "An error occurred while fetching dashboard graph data.",
        error: error.message,
      });
    }
  }
);

router.get("/accessories-count", async (req, res) => {
  let laptop = await assetModel.laptopCountData();
  let desktop = await assetModel.desktopCountData();
  let printer = await assetModel.printerCountData();
  let accessories = await assetModel.accessoriesCountData();
  let monitor = await assetModel.monitorCountData();

  let result = {
    total_laptop: laptop[0].total_laptop,
    total_desktop: desktop[0].total_desktop,
    total_printer: printer[0].total_printer,
    total_accessories: accessories[0].total_accessories,
    total_monitors: monitor[0].total_monitors,
  };

  return res.status(200).send({
    success: false,
    status: 200,
    message: "Dashboard Accessories Count data.",
    data: result,
  });
});

router.get(
  "/employee-data-count",
  [verifyToken, routeAccessChecker("employeeDashboard")],
  async (req, res) => {
    let id = req.decoded.userInfo.id;

    let total_asset = await assetModel.totalAssetCount();
    let asset_assign = await assignModel.employeeAssignCount(id);

    let result = {
      total_asset_count: total_asset[0].total_asset,
      total_assign_count: asset_assign[0].total_assign,
    };

    return res.status(200).send({
      success: false,
      status: 200,
      message: "Dashboard employee Count data.",
      data: result,
    });
  }
);

router.get("/blood-count", async (req, res) => {
  let a_positive = await employeeModel.a_positive();
  let b_positive = await employeeModel.b_positive();
  let ab_positive = await employeeModel.ab_positive();
  let o_positive = await employeeModel.o_positive();
  let a_negative = await employeeModel.a_negative();
  let b_negative = await employeeModel.b_negative();
  let ab_negative = await employeeModel.ab_negative();
  let o_negative = await employeeModel.o_negative();

  let result = {
    total_a_positive: a_positive[0].total_a_positive,
    total_b_positive: b_positive[0].total_b_positive,
    total_ab_positive: ab_positive[0].total_ab_positive,
    total_o_positive: o_positive[0].total_o_positive,
    total_a_negative: a_negative[0].total_a_negative,
    total_b_negative: b_negative[0].total_b_negative,
    total_ab_negative: ab_negative[0].total_ab_negative,
    total_0_negative: o_negative[0].total_o_negative,
  };

  return res.status(200).send({
    success: false,
    status: 200,
    message: "Blood Count data.",
    data: result,
  });
});

router.get("/admin-unit-wise-asset-count", [verifyToken], async (req, res) => {
  let id = req.decoded.userInfo.id;

  let admin_asset = await assetModel.adminUnitWisetotalAssetCount(id);

  return res.status(200).send({
    success: false,
    status: 200,
    message: "Admin unit wise asset count.",
    data: admin_asset[0],
  });
});

router.get(
  "/employee-wise-asset-assign-count",
  [verifyToken],
  async (req, res) => {
    let id = req.decoded.userInfo.id;

    let employee_assign_asset_count =
      await assetModel.employeeWiseAssigntotalAssetCount(id);

    return res.status(200).send({
      success: false,
      status: 200,
      message: "Admin unit wise asset count.",
      data: employee_assign_asset_count[0],
    });
  }
);

router.get("/admin-unit-wise-accessories", [verifyToken], async (req, res) => {
  let {id,role_id} = req.decoded.userInfo;
  let admin_data

  if(role_id === 2){
   admin_data = await assetModel.adminWiseAccessoriesData(id);
  }

  if(role_id === 4){
    const getUnit = await unitAccessModel.getById(id)
    const unitIds = getUnit.map(u => u.unit_id); 
    admin_data = await assetModel.unitSuperAdminWiseAccessoriesData(unitIds);
  }


  return res.status(200).send({
    success: false,
    status: 200,
    message: "Admin unit wise accessories count.",
    data: admin_data[0],
  });
});

module.exports = router;
