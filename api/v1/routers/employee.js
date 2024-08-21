const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken')
const {check,validationResult} = require('express-validator')
const moment = require("moment");
const e = require("express");
const employeeModel = require('../models/employee');


const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');

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

          console.log("first", reqData);

          // Perform validation checks here...

          // Check for duplicates
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
          if (result.affectedRows == undefined || result.affectedRows < 1) {
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


router.post('/add',async (req, res) => {
    
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
     console.log("first",checkDuplicate)
     if (checkDuplicate.length) {
       return res.status(404).send({
         "success": false,
         "status": 404,
         "message": "This employee already exists."
       });
     }


  let result = await employeeModel.addNew(reqData);


    if (result.affectedRows == undefined || result.affectedRows < 1) {
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
router.get('/list',async (req, res) => {
  let { offset = 0, limit = 10, key = '' ,unit_name = ''} = req.query;

  try {
    let result = await employeeModel.getList(offset, limit, key,unit_name);

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Employee List.",
      count: result.length,
      data: result
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      status: 500,
      message: "Error retrieving employee list.",
      error: error.message
    });
  }
});


//details
router.get('/details/:id',
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
router.delete('/delete/:id',async (req, res) => {

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
router.put('/update/:id', 
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
  let willWeUpdate = 0; // 1 = yes , 0 = no;
  
  
  
    // check employee_id
    if(existingDataById[0].employee_id != reqData.employee_id){
        willWeUpdate = 1
        updateData.employee_id = reqData.employee_id
  
    }
  
  
    // check name
    if(existingDataById[0].name != reqData.name){
        willWeUpdate = 1
        updateData.name = reqData.name
  
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

    // // artist id update
    // //check artist id empty or not
    // if(isEmpty(reqData.artist_id)){
    //     return res.status(400).send({
    //           "success": false,
    //           "status": 400,
    //           "message": "Artist id should not be empty."
    //     });
    //   }else if(reqData.artist_id < 1){
    //       return res.status(400).send({
    //           "success": false,
    //           "status": 400,
    //           "message": "Artist id should be positive number."
    //     });
    //   }else if(!Array.isArray(reqData.artist_id)){
    //       return res.status(400).send({
    //           "success": false,
    //           "status": 400,
    //           "message": "Artist id should be array."
    //     });
    //   }

    // // check duplicate value this artist id array
    // let tempId = []

    // for (let index = 0; index < reqData.artist_id.length; index++) {

    //     let data = reqData.artist_id[index]

    //     // check this artist id existing in database
    //     let existingByArtistId = await artistModel.getById(data)
    //     if(isEmpty(existingByArtistId)){
    //         return res.status(404).send({
    //             "success": false,
    //             "status": 404,
    //             "message": `This artist no ${index+1} id not found. `
    //     });
    //    }

    //     tempId.push(data)

    //     //duplicate check in array
    //     let checkArtistIdISDuplicate = await duplicateCheckInArray(tempId)
    //     if (checkArtistIdISDuplicate.result) {
    //         return res.status(409).send({
    //             success: false,
    //             status: 409,
    //             message: `Duplicate artist id position no: ${index + 1}.`,
    //         });
    //     }


    // }

    // let artistArrayId = tempId  // assign data


    // // get album wise artist table album id wise artist id find
    // let getByArtistIdInAlbum = await albumWiseArtistModel.getByArtistId(reqData.id)
    // if (isEmpty(getByArtistIdInAlbum)) {
    //     return res.status(404).send({
    //         success: false,
    //         status: 404,
    //         message: "Artist id not found.",
    //     });
    // }


    // // each artist_id store in artistId with table id and artist id to update artist id purpose
    // let artistId = []
    // for (let index = 0; index < getByArtistIdInAlbum.length; index++) {
    //     artistId.push({
    //         id: getByArtistIdInAlbum[index].id,
    //         artist_id: getByArtistIdInAlbum[index].artist_id
    //     })

    // }


    // // this place will be check get separate artist request new artist id and old artist id find
    // // new artist id has this array artistArrayId and previous db artist id has this array artistId

    // let addedArr = [];
    // let deletedArr = [];
    
    // // Use Sets for faster lookups
    // const artistArrayIdSet = new Set(artistArrayId);
    // const artistIdSet = new Set(artistId);
    
    // // Find deleted items
    // deletedArr = artistId.filter(id => !artistArrayIdSet.has(id));
    
    // // Find added items
    // addedArr = artistArrayId.filter(id => !artistIdSet.has(id));
    

    if (isError == 1) {
      return res.status(400).send({
          "success": false,
          "status": 400,
          "message": errorMessage
      });
  }
  
  if (willWeUpdate == 1) {
  console.log("id",reqData.id)
  console.log("data",updateData)
        
    let result = await employeeModel.updateById(id,updateData);
  
  
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


module.exports = router;  