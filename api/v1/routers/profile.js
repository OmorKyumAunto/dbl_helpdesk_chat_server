const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken')
const {check,validationResult} = require('express-validator')
const moment = require("moment");
const e = require("express");
const userModel = require('../models/user');
const assignModel = require('../models/asset-assign');
const unitAccessModel = require('../models/unit-access');
const licensesModel = require('../models/licenses');
const assetUnitModel = require('../models/asset-unit');
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
              price: license.price
            });
          }
        }

        // Replace licenses with detailed information
        employee.licenses = licenseDetails;
      } else {
        console.error("Licenses is not a valid array:", employee.licenses);
      }
    } catch (error) {
      console.error("Error parsing licenses for employee:", employee.employee_id, error);
    }
  }

  // Fetch access data for the current user
  const getAccessData = await unitAccessModel.getById(id);

  if (getAccessData && getAccessData.length > 0) {
    employee.searchAccess = [];

    // Iterate through each access record
    for (let access of getAccessData) {
      // Fetch the title (unit_name) from the assetUnitModel based on unit_id
      const existingDataById = await assetUnitModel.getById(access.unit_id);

      const unit_name = existingDataById && existingDataById.length > 0
        ? existingDataById[0].title
        : null;

      // Add the unit_name to the access object and push it into searchAccess
      employee.searchAccess.push({
        ...access,
        unit_name: unit_name
      });
    }
  } else {
    employee.searchAccess = [];  // Ensure searchAccess is an empty array if no access data
  }

  // Return the employee details
  return res.status(200).send({
    success: true,
    status: 200,
    message: "Employee details.",
    data: employee
  });
});



// router.get('/me', [verifyToken], async (req, res) => {
//   let id = req.decoded.userInfo.id;

//   // Get data from the database by id
//   let result = await userModel.getById(id);

//   // Check if this id already exists in the database
//   if (isEmpty(result)) {
//     return res.status(404).send({
//       success: false,
//       status: 404,
//       message: "Employee data not found."
//     });
//   }

//   // Assuming result[0] contains the employee data
//   let employee = result[0];

//   // Only proceed if licenses exist and is not empty
//   if (!isEmpty(employee.licenses)) {
//     try {
//       // Try parsing the licenses string to an array
//       let licenses = JSON.parse(employee.licenses);
    

//       // Ensure licenses is an array before proceeding
//       if (Array.isArray(licenses)) {
//         // Array to store the fetched license details
//         let licenseDetails = [];

//         // Loop through each license ID, fetch the details, and store them
//         for (let licenseId of licenses) {
//           let existingData = await licensesModel.getById(licenseId);
//           if (existingData && existingData.length > 0) {
//             // Assuming existingData is an array, access the first element
//             let license = existingData[0];  // Access the first RowDataPacket

//             licenseDetails.push({
//               id: license.id,
//               title: license.title,
//               price: license.price
//             });
//           }
//         }

//         // Replace the licenses field with the fetched license details
//         employee.licenses = licenseDetails;
//       } else {
//         console.error("Licenses is not a valid array:", employee.licenses);
//       }
//     } catch (error) {
//       // Log the error and the faulty data, skip parsing invalid JSON
//       console.error(`Error parsing licenses for employee ${employee.employee_id}:`, error.message);
//       employee.licenses = []; // Set to an empty array if parsing fails
//     }
//   }

//   return res.status(200).send({
//     success: true,
//     status: 200,
//     message: "Profile data.",
//     data: employee  // Send the modified employee object
//   });
// });


module.exports = router;  