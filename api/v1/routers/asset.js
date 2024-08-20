const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken')
const {check,validationResult} = require('express-validator')
const moment = require("moment");
const e = require("express");
const assetModel = require('../models/asset');
const assetAssignModel = require('../models/asset-assign');
const employeeModel = require('../models/employee');



router.post('/add', verifyToken,async (req, res) => {
    
  // body data
  let reqData = {
      "name": req.body.name,
      "category":req.body.category,
      "purchase_date":req.body.purchase_date,
      "serial_number":req.body.serial_number,
      "po_number":req.body.po_number,
      "asset_history":req.body.asset_history,
      "unit_name":req.body.unit_name,
      "is_assign":req.body.is_assign,
      "employee_id":req.body.employee_id,
      "assign_date":req.body.assign_date
  }

  let current_date = new Date(); 
  let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
  reqData.created_at = current_time;




    // check name
    if(isEmpty(reqData.name)){
      return res.status(400).send({
        "success": false,
        "status": 400,
        "message":"Name cannot be empty."
      });
  }


    // check department
    if(isEmpty(reqData.category)){
      return res.status(400).send({
        "success": false,
        "status": 400,
        "message":"Category cannot be empty."
      });
  }


  // date validation
    if(isEmpty(reqData.purchase_date)){
      return res.status(400).send({
          "success": false,
          "status": 400,
          "message":"Purchase date cannot be empty."
        });
  }

  current_time = moment(); 
  if (!moment(reqData.purchase_date, "YYYY-MM-DD", true).isValid()) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid purchase date."
    });
  } else if (current_time.isBefore(moment(reqData.purchase_date, "YYYY-MM-DD"))) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid purchase date."
    });
  }



  if(isEmpty(reqData.serial_number)){
    return res.status(400).send({
      "success": false,
      "status": 400,
      "message":"Serial number cannot be empty."
    });
}


if(isEmpty(reqData.po_number)){
  return res.status(400).send({
    "success": false,
    "status": 400,
    "message":"Po number cannot be empty."
  });
}

// unit validation
if(isEmpty(reqData.unit_name)){
  return res.status(400).send({
      "success": false,
      "status": 400,
      "message":"Unit name  cannot be empty."
});
} 

// if is_assign employee

// yes =1 , no = 0




if(reqData.is_assign === 1){

  // employee validation
  if(isEmpty(reqData.employee_id)){
    return res.status(400).send({
        "success": false,
        "status": 400,
        "message":"Employee id cannot be empty."
  });
  }



 if (!moment(reqData.assign_date, "YYYY-MM-DD", true).isValid()) {
  return res.status(400).send({
    success: false,
    status: 400,
    message: "Invalid assign date."
  });
} else if (current_time.isBefore(moment(reqData.assign_date, "YYYY-MM-DD"))) {
  return res.status(400).send({
    success: false,
    status: 400,
    message: "Invalid assign date."
  });
}

 let data = {
  name: reqData.name,
  category: reqData.category,
  purchase_date: reqData.purchase_date,
  serial_number: reqData.serial_number,
  po_number: reqData.po_number,
  asset_history: reqData.asset_history,
  is_assign: reqData.is_assign,
  remarks : 'assigned',
  unit_name : reqData.unit_name
}

let result = await assetModel.addNew2(data);

let getAssetId = await assetModel.getLastData()
let assignData = {
  asset_id : getAssetId[0].id,
  employee_id : reqData.employee_id,
  assign_date : reqData.assign_date
}
let result2 = await assetAssignModel.addNew(assignData);

if (result2.affectedRows == undefined || result2.affectedRows < 1) {
  return res.status(500).send({
      "success": true,
      "status": 500,
      "message": "Something Wrong in system database."
  });
}

return res.status(201).send({
  "success": true,
  "status": 201,
  "message": "Asset added Successfully."
});
}


 let data2 = {
  name: reqData.name,
  category: reqData.category,
  purchase_date: reqData.purchase_date,
  serial_number: reqData.serial_number,
  po_number: reqData.po_number,
  asset_history: reqData.asset_history,
  is_assign: reqData.is_assign,
  unit_name : reqData.unit_name
}

  let result = await assetModel.addNew2(data2);


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
      "message": "Asset added Successfully."
  });
 
});




// list
router.get('/list', verifyToken, async (req, res) => {
  let { offset = 0, limit = 10, key = '' } = req.query;

    let result = await assetModel.getList(offset, limit, key);

 
    return res.status(200).send({
      success: true,
      status: 200,
      message: "Asset List.",
      count: result.length,
      data: result
    });
  
});


//details
router.get('/details/:id',verifyToken,
  async (req, res) => {
    
    let id = req.params.id

    // get id wise data form db 
    let result = await assetModel.getById(id);;

     // check this id already existing in database or not
     if (isEmpty(result)) {
        return res.status(404).send({
          success: false,
          status: 404,
          message: "Asset data not found."
        });
  
      } 
   // get assign data
   let assignDataByAssetId = await assetAssignModel.getById(result[0].id)

   if(assignDataByAssetId.length){
 
     result[0].employee_id = assignDataByAssetId[0].employee_id,
     result[0].assign_date = assignDataByAssetId[0].assign_date
   }else{
    result[0].employee_id = ""
    result[0].assign_date =  ""
   }

   if(assignDataByAssetId[0].employee_id){
    let employeeData = await employeeModel.getById(assignDataByAssetId[0].employee_id)
    console.log("first",employeeData[0])
    result[0].employee_name = employeeData[0].name,
    result[0].employee_id_no = employeeData[0].employee_id,
    result[0].employee_department = employeeData[0].department,
    result[0].employee_designation = employeeData[0].designation,
    result[0].employee_unit = employeeData[0].unit_name
   }
    result[0].employee_name = "",
    result[0].employee_id_no = "",
    result[0].employee_department = "",
    result[0].employee_designation = "",
    result[0].employee_unit = ""
   


  return res.status(200).send({
      success: true,
      status: 200,
      message: "Asset details.",
      data: result[0],
  });
      
    
});




//delete
router.delete('/delete/:id',verifyToken,async (req, res) => {

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
router.put('/update/:id', verifyToken, 
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