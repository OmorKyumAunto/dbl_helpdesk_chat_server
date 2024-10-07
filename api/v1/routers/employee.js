const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken')
const {check,validationResult} = require('express-validator')
const moment = require("moment");
const e = require("express");
const employeeModel = require('../models/employee');
const userModel = require('../models/user');
const adminModel = require('../models/admins ');
const assetModel = require('../models/asset');
const licensesModel = require('../models/licenses');
const assetAssignModel = require('../models/asset-assign');
const superModel = require('../models/super-admins');
const { routeAccessChecker } = require("../middlewares/routeAccess");

const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const { off } = require("process");
const { profile } = require("console");
const bcrypt = require('bcrypt');


// Configure Multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Set the destination folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
    }
});

const upload = multer({ storage: storage });

// API to upload Excel file and save data
const xlsxDateToJSDate = (serial) => {
  const epoch = new Date(Date.UTC(0, 0, serial - 1)); 
  return new Date(epoch.getTime() + epoch.getTimezoneOffset() * 60000);
};


router.post('/upload', [verifyToken, routeAccessChecker("employeeAdd")], upload.single('file'), async (req, res) => {
  if (!req.file) {
      return res.status(400).send({
          success: false,
          status: 400,
          message: 'No file uploaded.'
      });
  }

  try {
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);

      for (let row of data) {
          // Required fields
          const requiredFields = ['Employee id', 'Name', 'Department', 'Designation', 'Email', 'Contact no', 'Joining date', 'Unit name','Blood group','Business type','Line of business','Grade','Pabx'];

          // Check for missing fields
          for (const field of requiredFields) {
              if (!row[field]) {
                  return res.status(400).send({
                      success: false,
                      status: 400,
                      message: `Missing required field: ${field}.`
                  });
              }
          }

          let joining_date = row['Joining date'];
          if (typeof joining_date === 'number') {
              joining_date = xlsxDateToJSDate(joining_date).toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
          }

          let reqData = {
              employee_id: row['Employee id'],
              name: row['Name'],
              department: row['Department'],
              designation: row['Designation'],
              email: row['Email'],
              contact_no: row['Contact no'],
              joining_date: joining_date,
              unit_name: row['Unit name'],
              licenses : row['Licenses'],
              blood_group : row['Blood group'],
              business_type : row['Business type'],
              line_of_business : row['Line of business'],
              grade : row['Grade'],
              pabx : row['Pabx'],
              created_by: req.decoded.userInfo.id,
          };
          //Microsoft E1


          // Check for duplicates
          // let checkDuplicate = await employeeModel.getByExistsEmployee(reqData.employee_id);
          // if (checkDuplicate.length) {
          //     return res.status(400).send({
          //         success: false,
          //         status: 400,
          //         message: `Employee ID ${reqData.employee_id} already exists.`
          //     });
          // }

          // Save to database
          let result = await employeeModel.addNew(reqData);
          let employeeId = await employeeModel.getDataByEmployeeId(reqData.employee_id);
          let password = bcrypt.hashSync(reqData.employee_id.toString(), 10);

          let userData = {
              role_id: 3,
              profile_id: employeeId[0].id,
              employee_id: reqData.employee_id,
              name: reqData.name,
              email: reqData.email,
              password: password,
              created_by: req.decoded.userInfo.id,
          };

          // Validate user data before saving
          if (reqData.department && reqData.name && reqData.employee_id && reqData.email && reqData.contact_no && reqData.joining_date && reqData.unit_name && reqData.licenses && reqData.created_by ) {
              let user = await userModel.addNew(userData);

              if (!user.affectedRows || user.affectedRows < 1) {
                  return res.status(500).send({
                      success: false,
                      status: 500,
                      message: 'Something went wrong in the database.'
                  });
              }
          } else {
              return res.status(400).send({
                  success: false,
                  status: 400,
                  message: 'Employee upload fields do not match the required format.'
              });
          }
      }

      return res.status(201).send({
          success: true,
          status: 201,
          message: 'All employees added successfully.'
      });

  } catch (error) {
      return res.status(500).send({
          success: false,
          status: 500,
          message: 'Error processing the file.',
          error: error.message
      });
  }
});


router.post('/add',[verifyToken, routeAccessChecker("employeeAdd")],async (req, res) => {
 
  // body data
  let reqData = {
      "employee_id": req.body.employee_id,
      "name":req.body.name,
      "department":req.body.department,
      "designation":req.body.designation,
      "email":req.body.email,
      "contact_no":req.body.contact_no,
      "joining_date":req.body.joining_date,
      "unit_name":req.body.unit_name,
      "licenses": req.body.licenses,
      "blood_group" :req.body.blood_group,
      "business_type": req.body.business_type,
      "line_of_business": req.body.line_of_business,
      "grade": req.body.grade,
      "pabx": req.body.pabx
  }

  let current_date = new Date(); 
  let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
  reqData.created_at = current_time;

  reqData.created_by = req.decoded.userInfo.id


  // check employee id
  if(isEmpty(reqData.employee_id)){
      return res.status(400).send({
        "success": false,
        "status": 400,
        "message":"Employee id cannot be empty."
      });
  }


    // check name
    if(isEmpty(reqData.name)){
      return res.status(400).send({
        "success": false,
        "status": 400,
        "message":"Name cannot be empty."
      });
  }


    // check department
    if(isEmpty(reqData.department)){
      return res.status(400).send({
        "success": false,
        "status": 400,
        "message":"Department cannot be empty."
      });
  }

  if(isEmpty(reqData.designation)){
    return res.status(400).send({
      "success": false,
      "status": 400,
      "message":"Designation cannot be empty."
    });
}


if(isEmpty(reqData.email)){
  return res.status(400).send({
    "success": false,
    "status": 400,
    "message":"Email cannot be empty."
  });
}


  // check contact_no
  if(isEmpty(reqData.contact_no) || Number(reqData.contact_no.length) > 15){
      return res.status(400).send({
        "success": false,
        "status": 400,
        "message":"Give a valid phone number."
      });
  }


  // date validation
  if(isEmpty(reqData.joining_date)){
      return res.status(400).send({
          "success": false,
          "status": 400,
          "message":"Joining date cannot be empty."
        });
  }

  current_time = moment(); 
  if (!moment(reqData.joining_date, "YYYY-MM-DD", true).isValid()) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid date."
    });
  } else if (current_time.isBefore(moment(reqData.joining_date, "YYYY-MM-DD"))) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid date."
    });
  }
  

  
  // validation unit_name
    if(isEmpty(reqData.unit_name)){
      return res.status(400).send({
          "success": false,
          "status": 400,
          "message":"Unit name cannot be empty."
        });
   }

    if(isEmpty(reqData.licenses)){
      return res.status(400).send({
          "success": false,
          "status": 400,
          "message":"Licenses cannot be empty."
        });
  }
    if(!Array.isArray(reqData.licenses)){
      return res.status(400).send({
        "success": false,
        "status": 400,
        "message":"Licenses cannot be array."
      });
    }

    for (let index = 0; index < reqData.licenses.length; index++) {
      const element = reqData.licenses[index];
      let existingData = await licensesModel.getById(element);
      if(isEmpty(existingData)){
        return res.status(400).send({
          "success": false,
          "status": 400,
          "message":"This Licenses id not found."
        });
      }
    }

    reqData.licenses = JSON.stringify(reqData.licenses)

   // blood group validation
   if(isEmpty(reqData.blood_group)){
    return res.status(400).send({
        "success": false,
        "status": 400,
        "message":"Blood group cannot be empty."
      });
 }

    // check duplicate 
     let checkDuplicate = await employeeModel.getByExistsEmployee(reqData.employee_id);
     if (checkDuplicate.length) {
       return res.status(404).send({
         "success": false,
         "status": 404,
         "message": "This employee already exists."
       });
     }


     let employeeData = {
      employee_id : reqData.employee_id,
      name : reqData.name,
       department : reqData.department,
      designation : reqData.designation,
      email : reqData.email,
      contact_no : reqData.contact_no,
      joining_date : reqData.joining_date,
      unit_name : reqData.unit_name,
      licenses : reqData.licenses,
      blood_group : reqData.blood_group,
      business_type : reqData.business_type,
      line_of_business : reqData.line_of_business,
      grade : reqData.grade,
      pabx:reqData.pabx,
      created_by : reqData.created_by

    }



    let result = await employeeModel.addNew(employeeData);

    let employeeId = await employeeModel.getDataByEmployeeId(reqData.employee_id)
    let password = bcrypt.hashSync(reqData.employee_id, 10);
    
    let userData = {
      role_id : 3,
      profile_id :employeeId[0].id,
      employee_id : reqData.employee_id,
      name : reqData.name,
      email : reqData.email,
      password : password
    }


  let user = await userModel.addNew(userData);


    if (user.affectedRows == undefined || user.affectedRows < 1) {
      return res.status(500).send({
          "success": true,
          "status": 500,
          "message": "Something Wrong in system database."
      });
  }

  return res.status(201).send({
      "success": true,
      "status": 201,
      "message": "Employee added Successfully."
  });
 
});


// list
router.get('/list',[verifyToken, routeAccessChecker("employeeList")],async (req, res) => {

  let reqData = {
    "limit": req.query.limit || 50,
    "offset": req.query.offset || 0,
    "key": req.query.key,
    "unit_name": req.query.unit_name,
    "status": req.query.status,
    "blood_group": req.query.blood_group ? req.query.blood_group.replace(/ /g, '+') : null
}
 let { offset, limit , key, unit_name,status,blood_group}  = reqData;


    let result = await userModel.getEmployeeList(offset, limit, key, unit_name,status,blood_group);

    let countResult = await userModel.getTotalEmployeeList(key, unit_name,status,blood_group);
    

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
                  id : license.id,
                  title: license.title,
                  price: license.price
                });
              }
            }
            employee.licenses = licenseDetails;
          } 
        } catch (error) {
          console.error("Error parsing licenses for employee:",error);
        }
      }
    }
    console.log("first")
    return res.status(200).send({
      success: true,
      status: 200,
      message: "Employee List.",
      total: countResult.length,
      data: result
    });

});



router.get('/employee-list',[verifyToken, routeAccessChecker("onlyEmployeeList")],async (req, res) => {

  let reqData = {
    "limit": req.query.limit || 50,
    "offset": req.query.offset || 0,
    "key": req.query.key,
    "unit_name": req.query.unit_name,
    "blood_group" : req.query.blood_group
}
  let { offset, limit , key, unit_name,blood_group}  = reqData;



    let result = await userModel.getOnlyEmployeeList(offset, limit, key, unit_name,blood_group);

    let countResult = await userModel.getOnlyTotalEmployeeList(key, unit_name,blood_group);

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Employee List.",
      total: countResult.length,
      data: result
    });

});



// list
router.get('/all-list',[verifyToken, routeAccessChecker("employeeAllList")],async (req, res) => {


    let result = await userModel.getList();

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Employee List.",
      total: result.length,
      data: result
    });
 
  
});


// list
router.get('/list-2',[verifyToken, routeAccessChecker("employeeList")],async (req, res) => {
  let result = await employeeModel.getList22();

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Employee List.",
      count: result.length,
      data: result
    });
  
});



//details
router.get('/details/:id', [verifyToken, routeAccessChecker("employeeDatails")], async (req, res) => {
    
  let id = req.params.id;

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
      // Log the error and the faulty data
      console.error("Error parsing licenses for employee:", employee.employee_id, error);
    }
  }

  // Return the employee details
  return res.status(200).send({
    success: true,
    status: 200,
    message: "Employee details.",
    data: employee,  // Return the single employee object
  });
});




//delete
router.delete('/delete/:id',[verifyToken, routeAccessChecker("employeeDelete")],async (req, res) => {

    let id = req.params.id
  
    // get id wise data form db 
    let existingById = await userModel.getById(id);
  
    // check this id already existing in database or not
    if (isEmpty(existingById)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "Employee data not found."
      });
  
    } 
  
    let current_date = new Date(); 
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
  
    let data = {
      status : 0,   // status = 1 (active) and status = 0 (delete)
      updated_by : req.decoded.userInfo.id
     }

   let userData = {
      status : 0,   // status = 1 (active) and status = 0 (delete)
      updated_by : req.decoded.userInfo.id
   }
  
  
      let userDataUpdate = await userModel.updateById(id,userData);
    
  
       if (userDataUpdate.affectedRows == undefined || userDataUpdate.affectedRows < 1) {
           return res.status(500).send({
               "success": true,
               "status": 500,
               "message": "Something Wrong in system database."
           });
       }
     
     
       return res.status(200).send({
           "success": true,
           "status": 200,
           "message": "Employee successfully deleted."
       });
    
  
});



//update
router.put('/update/:id', [verifyToken, routeAccessChecker("employeeUpdate")],
  async (req, res) => {
    
   let id = req.params.id
  
      // body data
      let reqData = {
        "employee_id": req.body.employee_id,
        "name":req.body.name,
        "department":req.body.department,
        "designation":req.body.designation,
        "email":req.body.email,
        "contact_no":req.body.contact_no,
        "joining_date":req.body.joining_date,
        "unit_name":req.body.unit_name,
        "licenses" : req.body.licenses,
        "blood_group": req.body.blood_group,
        "business_type": req.body.business_type,
        "line_of_business": req.body.line_of_business,
        "grade": req.body.grade,
        "pabx":req.body.pabx,
      }

    let current_date = new Date(); 
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");


    // get artist all list
    let existingDataById = await userModel.getById(id)
    if (isEmpty(existingDataById)) {
      return res.status(404).send({
          "success": false,
          "status": 404,
          "message": "Employee data not found",
      });
  } 

  let isError = 0
  let updateData = {};
  let userUpdateData = {};
  let willWeUpdate = 0; // 1 = yes , 0 = no;
  
  
   userUpdateData.employee_id = existingDataById[0].employee_id 
   userUpdateData.name = existingDataById[0].name 
   userUpdateData.employee_id = existingDataById[0].employee_id 
   userUpdateData.updated_by = req.decoded.userInfo.id
   
    // check employee_id
    if(existingDataById[0].employee_id != reqData.employee_id){
        willWeUpdate = 1
        updateData.employee_id = reqData.employee_id
        userUpdateData.employee_id = reqData.employee_id
  
    }
  
    // check name
    if(existingDataById[0].name != reqData.name){
        willWeUpdate = 1
        updateData.name = reqData.name
        userUpdateData.name = reqData.name
  
    }

    // check department
      if(existingDataById[0].department != reqData.department){
        willWeUpdate = 1
        updateData.department = reqData.department
    
     }

    // check designation
    if(existingDataById[0].designation != reqData.designation){
      willWeUpdate = 1
      updateData.designation = reqData.designation
  
    }



   // check email
   if(existingDataById[0].email != reqData.email){
    willWeUpdate = 1
    updateData.email = reqData.email

  }




   // check contact_no
   if(existingDataById[0].contact_no != reqData.contact_no){
    willWeUpdate = 1
    updateData.contact_no = reqData.contact_no

  }


   // check contact_no
   if(existingDataById[0].joining_date != reqData.joining_date){

    current_time = moment(); 
    if (!moment(reqData.joining_date, "YYYY-MM-DD", true).isValid()) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Invalid date."
      });
    } else if (current_time.isBefore(moment(reqData.joining_date, "YYYY-MM-DD"))) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Invalid date."
      });
    }
  
    
    willWeUpdate = 1
    updateData.joining_date = reqData.joining_date

  }


   // check unit_name
   if(existingDataById[0].unit_name != reqData.unit_name){
    willWeUpdate = 1
    updateData.unit_name = reqData.unit_name

  }

// update licenses
    if(!Array.isArray(reqData.licenses)){
      return res.status(400).send({
        "success": false,
        "status": 400,
        "message":"Licenses cannot be array."
      });
    }

    for (let index = 0; index < reqData.licenses.length; index++) {
      const element = reqData.licenses[index];
      let existingData = await licensesModel.getById(element);
      if(isEmpty(existingData)){
        return res.status(400).send({
          "success": false,
          "status": 400,
          "message":"This Licenses id not found."
        });
      }
    }

    reqData.licenses = JSON.stringify(reqData.licenses)
    updateData.licenses = reqData.licenses

    // check unit_name
    if(existingDataById[0].blood_group != reqData.blood_group){
      willWeUpdate = 1
      updateData.blood_group = reqData.blood_group
    }

    // check unit_name
    if(existingDataById[0].business_type != reqData.business_type){
      willWeUpdate = 1
      updateData.business_type = reqData.business_type
    }

   // check unit_name
    if(existingDataById[0].line_of_business != reqData.line_of_business){
      willWeUpdate = 1
      updateData.line_of_business = reqData.line_of_business
    }

       // check unit_name
       if(existingDataById[0].grade != reqData.grade){
        willWeUpdate = 1
        updateData.grade = reqData.grade
      }
      updateData.pabx = reqData.pabx

    if (isError == 1) {
      return res.status(400).send({
          "success": false,
          "status": 400,
          "message": errorMessage
      });
  }
  
  updateData.updated_by = req.decoded.userInfo.id
  if (willWeUpdate == 1) {

    //console.log("first====",existingDataById[0].profile_id)
    let result 
    let updateUser
    if(existingDataById[0].role_id == 1){
     result = await superModel.updateById(existingDataById[0].profile_id,updateData);

      updateUser = await userModel.updateByEmployeeUser(id,userUpdateData);
    }
    else if(existingDataById[0].role_id == 2){
       result = await adminModel.updateById(existingDataById[0].profile_id,updateData);

       updateUser = await userModel.updateByEmployeeUser(id,userUpdateData);
    }
    else if(existingDataById[0].role_id == 3){
    console.log("first sss ss ",updateData)
    console.log("first sss ss ",existingDataById[0].profile_id)
       result = await employeeModel.updateById(existingDataById[0].profile_id,updateData);

       updateUser = await userModel.updateByEmployeeUser(id,userUpdateData);
    }
 
  
  
    if (updateUser.affectedRows == undefined || updateUser.affectedRows < 1) {
        return res.status(500).send({
            "success": true,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    }
  
  
    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Employee successfully updated."
    });
  
  
  } else {
    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Nothing to update."
    });
  }
  
});


// change statis
router.put('/changeStatus/:id', [verifyToken, routeAccessChecker("changeEmployeeStatus")], async (req, res) => {

  let id = req.params.id

  updated_by = req.decoded.userInfo.id;
  let current_date = new Date(); 
  let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");

  let existingDataById = await userModel.getById(id);
  if (isEmpty(existingDataById)) {
      return res.status(404).send({
          "success": false,
          "status": 404,
          "message": "No data found",

      });
  }

  let data = {
      status: existingDataById[0].status == 1 ? 2 : 1,
      updated_by: updated_by,
      updated_at: current_time
  }


  let result = await userModel.updateById(id, data);


  if (result.affectedRows == undefined || result.affectedRows < 1) {
      return res.status(500).send({
          "success": true,
          "status": 500,
          "message": "Something Wrong in system database."
      });
  }


  return res.status(200).send({
      "success": true,
      "status": 200,
      "message": "Employee status has successfully changed."
  });

});




// album wise artist list
router.post('/album-wise-artist-list', verifyToken, [
    // Example body validations
    check('album_id').isInt().withMessage('Please provide a valid album id.')
  ],
  async (req, res) => {
    // Handle the request only if there are no validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    let album_id = req.body.album_id
  
    // Existing id on database
    let existingDataById = await albumModel.getById(album_id)
    if (isEmpty(existingDataById)) {
      return res.status(404).send({
        "success": false,
        "status": 404,
        "message": "Album data not found",
      });
    }


    
    // get album wise artist list
    let artistList = await albumModel.getArtistListByAlbumId(album_id);

    // get genre id by title
    let genreData = await genreModel.getById(existingDataById[0].genre_id)
    if(isEmpty(genreData)){
        existingDataById[0].genre_title = ""
    }else{
        existingDataById[0].genre_title = genreData[0].title
    }
   

    let singer = []
    singer.push(...artistList)
    existingDataById[0].singer = singer
    

  
    return res.status(200).send({
      success: true,
      status: 200,
      count: existingDataById.length,
      message: "Album wise artist list.",
      data: existingDataById[0]
    });
  
});
  




// check duplicate value common function
let duplicateCheckInArray = async (arrayData = []) => {
    let set = new Set();
  
    for (let element of arrayData) {
      if (set.has(element)) {
        return {
          result: true,
          message: "Duplicate value found.",
        };
      }
      set.add(element);
    }
  
    return {
      result: false,
      message: "Duplicate value not found.",
    };
};





// assign to admin
router.post('/assign-admin/:id',[verifyToken, routeAccessChecker("assignAdmin")],async (req, res) => {

  let id = req.params.id

  // get id wise data form db 
  let employeeData = await userModel.getById(id);

  // check this id already existing in database or not
  if (isEmpty(employeeData)) {
    return res.status(404).send({
      success: false,
      status: 404,
      message: "Employee data not found."
    });

  } 

  let data = {
    employee_id : employeeData[0].employee_id,
    name :  employeeData[0].name,
    department :  employeeData[0].department,
    designation :  employeeData[0].designation,
    email :  employeeData[0].email,
    contact_no :  employeeData[0].contact_no,
    joining_date :  employeeData[0].joining_date,
    unit_name :  employeeData[0].unit_name,
    blood_group :  employeeData[0].blood_group,
    business_type :  employeeData[0].business_type,
    line_of_business :  employeeData[0].line_of_business,
    grade :  employeeData[0].grade,
    licenses :  employeeData[0].licenses,

  }  

  let result = await adminModel.addNew(data);

  let delete_employee_data = await employeeModel.getByIdForDeleted(employeeData[0].profile_id)

  let getPresentData = await adminModel.getUserByEmail(employeeData[0].email)

  let userData = {
    role_id : 2,
    profile_id : getPresentData[0].id
  }


  let user = await userModel.updateById(id,userData);


    if (user.affectedRows == undefined || user.affectedRows < 1) {
      return res.status(500).send({
          "success": true,
          "status": 500,
          "message": "Something Wrong in system database."
      });
  }

  
   
     return res.status(200).send({
         "success": true,
         "status": 200,
         "message": "Employee successfully assing."
     });
  

});

// assign to employee demoted
router.post('/assign-admin-demoted/:id',[verifyToken, routeAccessChecker("assignAdmin")],async (req, res) => {

  let id = req.params.id

  // get id wise data form db 
  let employeeData = await userModel.getById(id);

  // check this id already existing in database or not
  if (isEmpty(employeeData)) {
    return res.status(404).send({
      success: false,
      status: 404,
      message: "Employee data not found."
    });

  } 



  let getData = await adminModel.getByProfileId(employeeData[0].profile_id);

  let data = {
    employee_id : employeeData[0].employee_id,
    name :  employeeData[0].name,
    department :  getData[0].department,
    designation :  getData[0].designation,
    email :  getData[0].email,
    contact_no :  getData[0].contact_no,
    joining_date :  getData[0].joining_date,
    unit_name :  getData[0].unit_name,
    licenses :  employeeData[0].licenses,
    blood_group :  getData[0].blood_group,
    business_type :  getData[0].business_type,
    line_of_business :  getData[0].line_of_business,
    grade :  getData[0].grade,
    
  }  


  let result = await employeeModel.addNew(data);

  let delete_admin_data = await adminModel.getByIdForDeleted(employeeData[0].profile_id)

  let getPresentData = await employeeModel.getUserByEmployeeIdNo(employeeData[0].employee_id)

  console.log("first",getPresentData)
  let userData = {
    role_id : 3,
    profile_id : getPresentData[0].id
  }


  let user = await userModel.updateById(id,userData);


    if (user.affectedRows == undefined || user.affectedRows < 1) {
      return res.status(500).send({
          "success": true,
          "status": 500,
          "message": "Something Wrong in system database."
      });
  }

  
   
     return res.status(200).send({
         "success": true,
         "status": 200,
         "message": "Admin demoted successfully."
     });
  

});



// api complete baki ache
router.get('/employee-asset-assign-list', [verifyToken, routeAccessChecker("employeeAssignList")], async (req, res) => {

  let id = req.decoded.userInfo.id
  let userProfileId = await userModel.getById(id)
  if(isEmpty(userProfileId)){
    return res.status(404).send({
      "success": false,
      "status": 404,
      "message": "Not found.",
    })
  }

  
  let result = await userModel.getDataByAssetId(id);
  return res.status(200).send({
      "success": true,
      "status": 200,
      "message": "Employee Wise asset List.",
      "count": result.length,
      "data": result
  });
});




//employee total assign asset
router.get('/employee-asset-assign-count',[verifyToken, routeAccessChecker("employeeTotalAssetAssignCount")],
  async (req, res) => {
    
    let id = req.decoded.userInfo.id

    // get id wise data form db 
    let result = await userModel.getById(id);;

     // check this id already existing in database or not
     if (isEmpty(result)) {
        return res.status(404).send({
          success: false,
          status: 404,
          message: "Invalid User"
        });
  
      } 

    // get employee total data

    let totalAssignAssetCount = await assetAssignModel.totalAssignAssetCount(id)

  return res.status(200).send({
      success: true,
      status: 200,
      message: "Employee Assign asset count.",
      data: totalAssignAssetCount,
  });
      
    
});



//change password
router.post("/password-change", [verifyToken,routeAccessChecker("changePassword")],
  async (req, res) => {
    console.log("first")
      // Get User data from user table.
      let old_password = req.body.old_password;
      let new_password = req.body.new_password;

      let userData = await userModel.getDataById(req.decoded.userInfo.id);

      if (isEmpty(userData)) {
          return res.status(400).send({
              success: false,
              status: 400,
              message: "Unauthorize Request. User not found, please login again.",
          });
      }


      if (bcrypt.compareSync(old_password, userData[0].password)) {
          new_password = bcrypt.hashSync(new_password, 10); // hashing Password
          console.log("first",new_password)
          let result = await userModel.updateById(
              req.decoded.userInfo.id,
              {password:new_password}
          );

          if (!isEmpty(result) && result.affectedRows == 0) {
              return res.status(500).send({
                  success: false,
                  status: 500,
                  message: "Password change fail! Try again",
              });
          } 
      } 
      
      
      else {
          return res.status(400).send({
              success: false,
              status: 400,
              message: "Old password not match.",
          });
      }


      return res.status(200).send({
        success: false,
        status: 200,
        message: "Password successfully change.",
    });
  }
);



// router.get('/employee-calculation',[verifyToken, routeAccessChecker("employeeCalculation")],async (req, res) => {

//   let reqData = {
//     "limit": req.query.limit || 50,
//     "offset": req.query.offset || 0,
//     "key": req.query.key,
//     "unit_name": req.query.unit_name,
//   }

//   let { offset, limit , key, unit_name}  = reqData;

//   let result = await userModel.getEmployeeList(offset, limit, key, unit_name);

//   let countResult = await userModel.getTotalEmployeeList(key, unit_name);


// // Iterate through each employee
// for (let index = 0; index < result.length; index++) {
//   let licenses = result[index].licenses;
//  let licenseDetails = []
//   try {
//     // Attempt to parse the licenses string
//     let validData = JSON.parse(licenses);

//     if(validData){
//       for (let index = 0; index < validData.length; index++) {
//         const data = validData[index];

//         let existingData = await licensesModel.getById(data);

//               if (existingData && existingData.length > 0) {
           
//                 let license = existingData[0];  

//                 licenseDetails.push({
//                   id : license.id,
//                   title: license.title,
//                   price: license.price
//                 });
//               }
//             }
//       }
    
//     // If licenses are parsed successfully, continue processing...
//     result[index].licenses = licenseDetails;

//     const getAssignAssetId = await assetAssignModel.getByAssignUser(result[index].id)
//     for (let index = 0; index < getAssignAssetId.length; index++) {
//       const element = getAssignAssetId[index].asset_id;
//       console.log("first ======= ",element)
//       let assetPrice = await assetModel.getById(element);
//       for (let index = 0; index < array.length; index++) {
//         const element = array[index];
        
//       }
//     }

//   } catch (error) {
    
//     console.error(`Error parsing licenses for employee at index ${index}:`, error.message);
//     result[index].licenses = []; 
//   }
// }


//     return res.status(200).send({
//       success: true,
//       status: 200,
//       message: "Employee List.",
//       total: countResult.length,
//       data: result
//     });

// });


router.get('/employee-calculation', [verifyToken, routeAccessChecker("employeeCalculation")], async (req, res) => {

  let reqData = {
    "limit": req.query.limit || 50,
    "offset": req.query.offset || 0,
    "key": req.query.key,
    "unit_name": req.query.unit_name,
  }

  let { offset, limit, key, unit_name } = reqData;

  // Fetch employee list and total employee count
  let result = await userModel.getEmployeeList(offset, limit, key, unit_name);
  let countResult = await userModel.getTotalEmployeeList(key, unit_name);

  // Iterate through each employee
  for (let index = 0; index < result.length; index++) {
    let licenses = result[index].licenses;
    let licenseDetails = [];
    let totalAssetPrice = 0;
    let totalLicensesPrice = 0; 

    try {
      // Attempt to parse the licenses string
      let validData = JSON.parse(licenses);

      if (validData && Array.isArray(validData)) {
        // Loop through each license ID, fetch details, and push to licenseDetails
        for (let licenseId of validData) {
          let existingData = await licensesModel.getById(licenseId);
          if (existingData && existingData.length > 0) {
            let license = existingData[0]; 
            licenseDetails.push({
              id: license.id,
              title: license.title,
              price: license.price
            });

            // Sum up the license prices for total license price calculation
            totalLicensesPrice += license.price;
          }
        }
      }

      // Replace the licenses field with the fetched license details
      result[index].licenses = licenseDetails;

      // Fetch assigned assets for the employee
      let getAssignAssetId = await assetAssignModel.getByAssignUser(result[index].id);
      let assetDetails = [];

      // Loop through each assigned asset ID, fetch details, and push to assetDetails
      for (let assetAssignment of getAssignAssetId) {
        let assetId = assetAssignment.asset_id;
        let assetPriceData = await assetModel.getById(assetId);

        if (assetPriceData && assetPriceData.length > 0) {
          let asset = assetPriceData[0]; // Access the first RowDataPacket
          assetDetails.push({
            id: asset.id,
            name: asset.name, 
            serial_number: asset.serial_number, 
            price: asset.price
          });

          // Sum up the asset prices for total asset price calculation
          totalAssetPrice += asset.price;
        }
      }

      // Add the asset details and total asset price to the employee object
      result[index].assets = assetDetails;
      result[index].total_asset_price = totalAssetPrice; 
      result[index].monthly_asset_cost = Number((totalAssetPrice / 36).toFixed(2));
      
      // Add the total licenses price to the employee object
      result[index].montly_licenses_price = totalLicensesPrice;
      result[index].total_ctc_per_month = (result[index].monthly_asset_cost + result[index].montly_licenses_price)
      result[index].total_ctc_per_year = (result[index].total_ctc_per_month * 12)

    } catch (error) {
      // Handle any parsing or data fetching errors
      console.error(`Error processing employee at index ${index}:`, error.message);
      result[index].licenses = [];
      result[index].assets = [];
      result[index].total_asset_price = 0; // Set total asset price to 0 if there's an error
      result[index].montly_licenses_price = 0; // Set total license price to 0 if there's an error
      result[index].total_ctc_per_month  = 0
    }
  }

  // Return the response
  return res.status(200).send({
    success: true,
    status: 200,
    message: "Employee List.",
    total: countResult.length,
    data: result
  });

});


module.exports = router;  