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
const licensesModel = require("../models/licenses");
require('dotenv').config();


// admin list
router.get(
  "/admin-list",
  [verifyToken, routeAccessChecker("unitSuperAdminAssignAdminList")],
  async (req, res) => {
  
    const id = req.decoded.userInfo.id
    let result = await userModel.getAdminList(id);

    // Iterate over the employee list
    for (let employee of result) {
      if (!isEmpty(employee.licenses)) {
        try {
          // Try parsing the licenses string to an array
          let licenses = JSON.parse(employee.licenses);

          // Ensure licenses is an array before proceeding
          if (Array.isArray(licenses)) {
            // Array to store the fetched license details
            let licenseDetails = [];

            // Loop through each license ID, fetch the details, and store them
            for (let licenseId of licenses) {
              let existingData = await licensesModel.getById(licenseId);

              if (existingData && existingData.length > 0) {
                let license = existingData[0];

                licenseDetails.push({
                  id: license.id,
                  title: license.title,
                  price: license.price,
                });
              }
            }
            employee.licenses = licenseDetails;
          }
        } catch (error) {
          console.error("Error parsing licenses for employee:", error);
        }
      }
    }

    // convert it json
    const formatted = result.map(row => ({
      ...row,
      searchAccess: JSON.parse(row.units) ,
      admin_categories: JSON.parse(row.admin_categories) ,
    }));

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Selected Admin List.",
      total: result.length,
      data: formatted,
    });
  }
);

// list
router.get(
  "/list",
  [verifyToken, routeAccessChecker("unitSuperAdminList")],
  async (req, res) => {
    let reqData = {
      limit: req.query.limit || 50,
      offset: req.query.offset || 0,
      key: req.query.key,
      unit_name: req.query.unit_name,
      status: req.query.status,
      blood_group: req.query.blood_group
        ? req.query.blood_group.replace(/ /g, "+")
        : null,
      employee_type: req.query.employee_type,
    };
    let { offset, limit, key, unit_name, status, blood_group, employee_type } =
      reqData;

    let result = await userModel.getUnitSuperAdminList(
      offset,
      limit,
      key,
      unit_name,
      status,
      blood_group,
      employee_type
    );

    let countResult = await userModel.getTotalUnitSuperAdminList(
      key,
      unit_name,
      status,
      blood_group,
      employee_type
    );


    for (let employee of result) {
      if (!isEmpty(employee.licenses)) {
        try {
          let licenses = JSON.parse(employee.licenses);
          if (Array.isArray(licenses)) {
            let licenseDetails = [];
            for (let licenseId of licenses) {
              let existingData = await licensesModel.getById(licenseId);
              if (existingData && existingData.length > 0) {
                let license = existingData[0];
                licenseDetails.push({
                  id: license.id,
                  title: license.title,
                  price: license.price,
                });
              }
            }
            employee.licenses = licenseDetails;
          }
        } catch (error) {
          console.error("Error parsing licenses for employee:", error);
        }
      }

      const getAssignUnit = await unitAccessModel.getByUserId(employee.id);

      let unit_id = getAssignUnit.map((u) => u.unit_id);

      let unitData = [];

      for (let id of unit_id) {
        const getAssignUnitName = await assetUnitModel.getById(id);

      if (getAssignUnitName && getAssignUnitName.length > 0) {
        unitData.push({
          unit_id: getAssignUnitName[0].id,
          title: getAssignUnitName[0].title
        });
      }
      }

      employee.searchAccess = unitData;
    }

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Unit Super Admin List.",
      total: countResult.length,
      data: result,
    });
  }
);


module.exports = router;