const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken')
const {check,validationResult} = require('express-validator')
const moment = require("moment");
const e = require("express");
const userModel = require('../models/user');
const assignModel = require('../models/asset-assign');
const licensesModel = require('../models/licenses');
// list
router.get('/me', [verifyToken], async (req, res) => {
  let id = req.decoded.userInfo.id;

  // Get data from the database by id
  let result = await userModel.getById(id);

  // Check if this id already exists in the database
  if (isEmpty(result)) {
    return res.status(404).send({
      success: false,
      status: 404,
      message: "Employee data not found."
    });
  }

  // Assuming result[0] contains the employee data
  let employee = result[0];

  // Only proceed if licenses exist and is not empty
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
            // Assuming existingData is an array, access the first element
            let license = existingData[0];  // Access the first RowDataPacket

            licenseDetails.push({
              id: license.id,
              title: license.title,
              price: license.price
            });
          }
        }

        // Replace the licenses field with the fetched license details
        employee.licenses = licenseDetails;
      } else {
        console.error("Licenses is not a valid array:", employee.licenses);
      }
    } catch (error) {
      // Log the error and the faulty data, skip parsing invalid JSON
      console.error(`Error parsing licenses for employee ${employee.employee_id}:`, error.message);
      employee.licenses = []; // Set to an empty array if parsing fails
    }
  }

  return res.status(200).send({
    success: true,
    status: 200,
    message: "Profile data.",
    data: employee  // Send the modified employee object
  });
});





module.exports = router;  