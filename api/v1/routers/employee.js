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

router.post('/upload', upload.single('file'), async (req, res) => {
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

      // Iterate through each row and save to database
      for (let row of data) {
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
              unit_name: row['Unit name']
          };

         

          // Perform validation checks here...

          //Check for duplicates
          let checkDuplicate = await employeeModel.getByExistsEmployee(reqData.employee_id);
          if (checkDuplicate.length) {
              return res.status(400).send({
                  success: false,
                  status: 400,
                  message: `Employee ID ${reqData.employee_id} already exists.`
              });
          }

          // Save to database
          let result = await employeeModel.addNew(reqData);

          let employeeId = await employeeModel.getDataByEmployeeId(reqData.employee_id)
          let password = bcrypt.hashSync(reqData.employee_id.toString(), 10);
          
          let userData = {
            role_id : 3,
            profile_id : employeeId[0].id,
            employee_id : reqData.employee_id,
            name : row['Name'],
            email : row['Email'],
            password : password
          }


        let user = await userModel.addNew(userData);


          if (user.affectedRows == undefined || user.affectedRows < 1) {
              return res.status(500).send({
                  success: false,
                  status: 500,
                  message: 'Something went wrong in the database.'
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
  }

  let current_date = new Date(); 
  let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
  reqData.created_at = current_time;




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

  // // check duplicate 
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
    "unit": req.query.unit,
}
 let { offset, limit , key, unit}  = reqData;



    let result = await employeeModel.getList(offset, limit, key, unit);

    let countResult = await employeeModel.getTotalList(key, unit);

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


    let result = await employeeModel.getTotalList();

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
router.get('/details/:id',[verifyToken, routeAccessChecker("employeeDatails")],
  async (req, res) => {
    
    let id = req.params.id

    // get id wise data form db 
    let result = await employeeModel.getById(id);;

     // check this id already existing in database or not
     if (isEmpty(result)) {
        return res.status(404).send({
          success: false,
          status: 404,
          message: "Employee data not found."
        });
  
      } 


  return res.status(200).send({
      success: true,
      status: 200,
      message: "Employee details.",
      data: result[0],
  });
      
    
});




//delete
router.delete('/delete/:id',[verifyToken, routeAccessChecker("employeeDelete")],async (req, res) => {

    let id = req.params.id
  
    // get id wise data form db 
    let existingById = await employeeModel.getById(id);
  
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
     }
  
      // get id wise data form db 
      let result = await employeeModel.updateById(id,data);
  
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
      }

  
    let current_date = new Date(); 
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");


    // get artist all list
    let existingDataById = await employeeModel.getById(id)
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
    userUpdateData.email = reqData.email
  

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

    if (isError == 1) {
      return res.status(400).send({
          "success": false,
          "status": 400,
          "message": errorMessage
      });
  }
  
  if (willWeUpdate == 1) {

    let result = await employeeModel.updateById(id,updateData);

    let updateUser = await userModel.updateByEmployeeUser(id,userUpdateData);
  
  
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
  let employeeData = await employeeModel.getById(id);

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

  }  


  let result = await adminModel.addNew(data);

  let delete_employee_data = await employeeModel.getByIdForDeleted(id)

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



router.get('/employee-asset-assign-list', [verifyToken, routeAccessChecker("employeeAssignList")], async (req, res) => {

  let id = req.decoded.userInfo.id

  let userProfileId = await userModel.getById(id)

  
  let result = await assetModel.getByEmployeeId(userProfileId[0].profile_id);

  return res.status(200).send({
      "success": true,
      "status": 200,
      "message": "Employee Wise asset List.",
      "count": result.length,
      "data": result
  });
});


module.exports = router;  