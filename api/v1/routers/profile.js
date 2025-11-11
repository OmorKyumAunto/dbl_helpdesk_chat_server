const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const userModel = require("../models/user");
const adminModel = require("../models/admins ");
const unitSuperAdminModel = require("../models/unit-super-admin");
const employeeModel = require("../models/employee");
const seatingLocationModel = require("../models/seating-location");
const unitAccessModel = require("../models/unit-access");
const licensesModel = require("../models/licenses");
const assetUnitModel = require("../models/asset-unit");
// list
router.get("/me", [verifyToken], async (req, res) => {
  let id = req.decoded.userInfo.id;

  // Get data from the database by id
  let result = await userModel.getById(id);

  // Check if this id already exists in the database
  if (isEmpty(result)) {
    return res.status(404).send({
      success: false,
      status: 404,
      message: "Employee data not found.",
    });
  }

  if(result[0].role_id === 3){
    const employeeData = await employeeModel.getById(result[0].profile_id)
    if(employeeData.length){
      const seatingLocationData = await seatingLocationModel.getByIdViewData(employeeData[0].seating_location)
      result[0].seating_location = seatingLocationData[0]?.seating_location_id || null
      result[0].seating_location_name = seatingLocationData[0]?.seating_location_name || null
      result[0].building_name = seatingLocationData[0]?.building_name || null
      result[0].building_id = seatingLocationData[0]?.building_id || null
      result[0].seating_unit_id = seatingLocationData[0]?.unit_id || null
      result[0].seating_unit_name = seatingLocationData[0]?.unit_name || null
    }
  }

  if(result[0].role_id === 2){
    const employeeData = await adminModel.getById(result[0].profile_id)
    if(employeeData.length){
      const seatingLocationData = await seatingLocationModel.getByIdViewData(employeeData[0].seating_location)
      result[0].seating_location = seatingLocationData[0]?.seating_location_id || null
      result[0].seating_location_name = seatingLocationData[0]?.seating_location_name || null
      result[0].building_name = seatingLocationData[0]?.building_name || null
      result[0].building_id = seatingLocationData[0]?.building_id || null
      result[0].seating_unit_id = seatingLocationData[0]?.unit_id || null
      result[0].seating_unit_name = seatingLocationData[0]?.unit_name || null
    }
  }

  if(result[0].role_id === 4){
    const employeeData = await unitSuperAdminModel.getById(result[0].profile_id)
    if(employeeData.length){
      const seatingLocationData = await seatingLocationModel.getByIdViewData(employeeData[0].seating_location)
      result[0].seating_location = seatingLocationData[0]?.seating_location_id || null
      result[0].seating_location_name = seatingLocationData[0]?.seating_location_name || null
      result[0].building_name = seatingLocationData[0]?.building_name || null
      result[0].building_id = seatingLocationData[0]?.building_id || null
      result[0].seating_unit_id = seatingLocationData[0]?.unit_id || null
      result[0].seating_unit_name = seatingLocationData[0]?.unit_name || null
    }
  }

  // Assuming result[0] contains the employee data
  let employee = result[0];

  // Handle licenses if they exist
  if (!isEmpty(employee.licenses)) {
    try {
      let licenses = JSON.parse(employee.licenses);

      if (Array.isArray(licenses)) {
        let licenseDetails = [];

        // Fetch each license's details
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

        // Replace licenses with detailed information
        employee.licenses = licenseDetails;
      } else {
        console.error("Licenses is not a valid array:", employee.licenses);
      }
    } catch (error) {
      console.error(
        "Error parsing licenses for employee:",
        employee.employee_id,
        error
      );
    }
  }

  // Fetch access data for the current user
  const getAccessData = await unitAccessModel.getById(id);

  if (getAccessData && getAccessData.length > 0) {
    employee.searchAccess = [];

    for (let access of getAccessData) {
      const existingDataById = await assetUnitModel.getById(access.unit_id);

      const unit_name =
        existingDataById && existingDataById.length > 0
          ? existingDataById[0].title
          : null;

      employee.searchAccess.push({
        ...access,
        unit_name: unit_name,
      });
    }
  } else {
    employee.searchAccess = []; 
  }

  // Return the employee details
  return res.status(200).send({
    success: true,
    status: 200,
    message: "Employee details.",
    data: employee,
  });
});


module.exports = router;
