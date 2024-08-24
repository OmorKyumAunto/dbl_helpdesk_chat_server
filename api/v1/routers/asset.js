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



router.post('/add',async (req, res) => {
    
  // body data
  let reqData = {
      "name": req.body.name,
      "category":req.body.category,
      "purchase_date":req.body.purchase_date,
      "serial_number":req.body.serial_number,
      "po_number":req.body.po_number,
      "asset_history":req.body.asset_history,
      "unit_name":req.body.unit_name,
      "model":req.body.model,
      "specification":req.body.specification,
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

// unit validation
if(isEmpty(reqData.unit_name)){
  return res.status(400).send({
      "success": false,
      "status": 400,
      "message":"Unit name  cannot be empty."
});
} 


  // unit validation
  if(isEmpty(reqData.model)){
    return res.status(400).send({
        "success": false,
        "status": 400,
        "message":"Model  cannot be empty."
  });
  } 

  // unit validation
  if(isEmpty(reqData.specification)){
    return res.status(400).send({
        "success": false,
        "status": 400,
        "message":"Specification cannot be empty."
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
  unit_name : reqData.unit_name,
  model : reqData.model,
  specification : reqData.specification
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
  unit_name : reqData.unit_name,
  model : reqData.model,
  specification : reqData.specification,
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
router.get('/list', async (req, res) => {
  let { offset = 0, limit = 10, key = '' ,unit=''} = req.query;

    let result = await assetModel.getList(offset, limit, key,unit);

 
    return res.status(200).send({
      success: true,
      status: 200,
      message: "Asset List.",
      count: result.length,
      data: result
    });
  
});


//details
router.get('/details/:id',
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
   if(!isEmpty(assignDataByAssetId)){
     result[0].employee_id = assignDataByAssetId[0].employee_id,
     result[0].assign_date = assignDataByAssetId[0].assign_date
   }else{
    result[0].employee_id = ""
    result[0].assign_date =  ""
   }

   if(!isEmpty(assignDataByAssetId)){
  let employeeData = await employeeModel.getById(assignDataByAssetId[0].employee_id)


    if(!isEmpty(employeeData)){
      result[0].employee_name = employeeData[0].name,
      result[0].employee_id_no = employeeData[0].employee_id,
      result[0].employee_department = employeeData[0].department,
      result[0].employee_designation = employeeData[0].designation,
      result[0].employee_unit = employeeData[0].unit_name
    }else{
      result[0].employee_name = "",
        result[0].employee_id_no = "",
        result[0].employee_department = "",
        result[0].employee_designation = "",
        result[0].employee_unit = ""
      
    }
      
    }


  return res.status(200).send({
      success: true,
      status: 200,
      message: "Asset details.",
      data: result[0],
  });
      
    
});




//delete
router.delete('/delete/:id',async (req, res) => {

    let id = req.params.id
  
    // get id wise data form db 
    let existingById = await assetModel.getById(id);
  
    // check this id already existing in database or not
    if (isEmpty(existingById)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "Asset data not found."
      });
  
    } 
  
    let current_date = new Date(); 
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
  
    let data = {
      status : 0,   // status = 1 (active) and status = 0 (delete)
     }
  
      // get id wise data form db 
      let result = await assetModel.updateById(id,data);
  
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
           "message": "Asset successfully deleted."
       });
    
  
});



//update
router.put('/update/:id', 
  async (req, res) => {
    
   let id = req.params.id
  
      // body data
      let reqData = {
        "name": req.body.name,
        "category":req.body.category,
        "purchase_date":req.body.purchase_date,
        "serial_number":req.body.serial_number,
        "po_number":req.body.po_number,
        "asset_history":req.body.asset_history,
        "unit_name":req.body.unit_name,
        "model":req.body.model,
        "specification":req.body.specification,
        "assign_update": req.body.assign_update,
        "employee_id":req.body.employee_id,
        "assign_date":req.body.assign_date
      }

  
    let current_date = new Date(); 
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");


    // get artist all list
    let existingDataById = await assetModel.getById(id)
    if (isEmpty(existingDataById)) {
      return res.status(404).send({
          "success": false,
          "status": 404,
          "message": "Asset data not found",
      });
  } 

  let isError = 0
  let updateData = {};
  let willWeUpdate = 0; // 1 = yes , 0 = no;
  
  
  
    // check employee_id
    if(existingDataById[0].name != reqData.name){
        willWeUpdate = 1
        updateData.name = reqData.name
  
    }
  

    // check name
    if(existingDataById[0].category != reqData.category){
        willWeUpdate = 1
        updateData.category = reqData.category
  
    }

      // check contact_no
   if(existingDataById[0].purchase_date != reqData.purchase_date){

    current_time = moment(); 
    if (!moment(reqData.purchase_date, "YYYY-MM-DD", true).isValid()) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Invalid date."
      });
    } else if (current_time.isBefore(moment(reqData.purchase_date, "YYYY-MM-DD"))) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Invalid date."
      });
    }
  
    
    willWeUpdate = 1
    updateData.purchase_date = reqData.purchase_date

  }



    // check serial_number
      if(existingDataById[0].serial_number != reqData.serial_number){
        willWeUpdate = 1
        updateData.serial_number = reqData.serial_number
    
     }

    // check po_number
    if(existingDataById[0].po_number != reqData.po_number){
      willWeUpdate = 1
      updateData.po_number = reqData.po_number
  
    }



   // check email
   if(existingDataById[0].asset_history != reqData.asset_history){
    willWeUpdate = 1
    updateData.asset_history = reqData.asset_history

  }


 

   // check unit_name
   if(existingDataById[0].unit_name != reqData.unit_name){
    willWeUpdate = 1
    updateData.unit_name = reqData.unit_name

  }

     // check unit_name
     if(existingDataById[0].model != reqData.model){
      willWeUpdate = 1
      updateData.model = reqData.model
  
    }

       // check unit_name
   if(existingDataById[0].specification != reqData.specification){
    willWeUpdate = 1
    updateData.specification = reqData.specification

  }

   
    if (isError == 1) {
      return res.status(400).send({
          "success": false,
          "status": 400,
          "message": errorMessage
      });
  }


if(reqData.assign_update == 1){

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


let updateEmployeeData = {
  asset_id : id,
  employee_id : reqData.employee_id,
  assign_date : reqData.assign_date
}



let result2 = await assetAssignModel.updateById(id,updateEmployeeData);

if (result2.affectedRows == undefined || result2.affectedRows < 1) {
  return res.status(500).send({
      "success": true,
      "status": 500,
      "message": "Something Wrong in system database."
  });
}


}

  
  if (willWeUpdate == 1) {


    let result = await assetModel.updateById(id,updateData);
  
  
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
        "message": "Asset successfully updated."
    });
  
  
  } else {
    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Nothing to update."
    });
  }
  
});


// assign employee
router.put('/assign-employee/:id',async(req,res) =>{

  let id = req.params.id
  let reqData = {
    "employee_id": req.body.employee_id,
    "assign_date":req.body.assign_date
  }

  let current_date = new Date(); 
  let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");


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
  } 

  let assignEmployeeData = {
    asset_id : id,
    employee_id : reqData.employee_id,
    assign_date : reqData.assign_date,
    created_at : current_time
  }

  let updateRemarks = await assetModel.updateById(id,{is_assign : 1 ,remarks:'assigned'});

  let result2 = await assetAssignModel.addNew(assignEmployeeData);

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
  "message": "Employee assign Successfully Done."
});


});



//distributed asset list
router.get('/distributed-asset', async (req, res) => {
  let { offset = 0, limit = 10, key = '' } = req.query;

  let result = await assetModel.distributedAssetList(offset, limit, key);

  for (let i = 0; i < result.length; i++) {
    const resultId = result[i].id;

    // Get assign data
    let assignDataByAssetId = await assetAssignModel.getById(resultId);

    if (!isEmpty(assignDataByAssetId)) {
      result[i].employee_id = assignDataByAssetId[0].employee_id;
      result[i].assign_date = assignDataByAssetId[0].assign_date;

      // Get employee data based on the employee_id from assignDataByAssetId
      let employeeData = await employeeModel.getById(assignDataByAssetId[0].employee_id);

      if (!isEmpty(employeeData)) {
        result[i].employee_name = employeeData[0].name;
        result[i].employee_id_no = employeeData[0].employee_id;
        result[i].employee_department = employeeData[0].department;
        result[i].employee_designation = employeeData[0].designation;
        result[i].employee_unit = employeeData[0].unit_name;
      } else {
        result[i].employee_name = "";
        result[i].employee_id_no = "";
        result[i].employee_department = "";
        result[i].employee_designation = "";
        result[i].employee_unit = "";
      }
    } else {
      result[i].employee_id = "";
      result[i].assign_date = "";
      result[i].employee_name = "";
      result[i].employee_id_no = "";
      result[i].employee_department = "";
      result[i].employee_designation = "";
      result[i].employee_unit = "";
    }
  }

  return res.status(200).send({
    success: true,
    status: 200,
    message: "Distributed asset list.",
    data: result,
  });
});


//details
router.get('/distributed-details/:id',
  async (req, res) => {
    
    let id = req.params.id

    // get id wise data form db 
    let result = await assetModel.getByIdAssign(id);;

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
   if(!isEmpty(assignDataByAssetId)){
     result[0].employee_id = assignDataByAssetId[0].employee_id,
     result[0].assign_date = assignDataByAssetId[0].assign_date
   }else{
    result[0].employee_id = ""
    result[0].assign_date =  ""
   }

   if(!isEmpty(assignDataByAssetId)){
  let employeeData = await employeeModel.getById(assignDataByAssetId[0].employee_id)


    if(!isEmpty(employeeData)){
      result[0].employee_name = employeeData[0].name,
      result[0].employee_id_no = employeeData[0].employee_id,
      result[0].employee_department = employeeData[0].department,
      result[0].employee_designation = employeeData[0].designation,
      result[0].employee_unit = employeeData[0].unit_name
    }else{
      result[0].employee_name = "",
        result[0].employee_id_no = "",
        result[0].employee_department = "",
        result[0].employee_designation = "",
        result[0].employee_unit = ""
      
    }
      
    }


  return res.status(200).send({
      success: true,
      status: 200,
      message: "Asset details.",
      data: result[0],
  });
      
    
});




const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/asset/'); // Set the destination folder
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

router.post('/upload-asset', upload.single('file'), async (req, res) => {
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
        let purchase_date = row['Purchase date'];
        if (typeof purchase_date === 'number') {
          purchase_date = xlsxDateToJSDate(purchase_date).toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
        }

        let reqData = {
            name: row['Name'],
            category: row['Category'],
            purchase_date: purchase_date,
            serial_number: row['Serial number'],
            po_number: row['PO number'],
            asset_history: row['Asset history'],
            model: row['Model'],
            specification: row['Specification'],
            unit_name: row['Unit name']
        };

     


        // Save to database
        let result = await assetModel.addNew2(reqData);
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
        message: 'All asset added successfully.'
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





module.exports = router;  