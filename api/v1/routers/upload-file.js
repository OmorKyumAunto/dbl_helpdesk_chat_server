const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const employeeModel = require("../models/employee");
const userModel = require("../models/user");
const locationUpdateTrackModel = require("../models/location-update-track");
const unitModel = require("../models/asset-unit");
const seatingLocationModel = require("../models/seating-location");
const { routeAccessChecker } = require("../middlewares/routeAccess");
const xlsx = require('xlsx');
const createFileUploader = require("../common/upload-file");
const path = require('path');
const fs = require('fs');

//Create file uploader instance
const { uploadFile, multerErrorHandler } = createFileUploader({
  folderPath: path.join(__dirname, '../../../uploads/seating-location'),
  allowedTypes: ['xlsx', 'xls'],
  maxSizeMB: 5,
});


router.post(
  "/update-employee-location",
   [
    verifyToken,
    routeAccessChecker('modifiedEmployeeSeatingLocation'),
    uploadFile.single('file'), 
    multerErrorHandler,
  ],
  async (req, res) => {
    if (!req.file) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "No file uploaded.",
      });
    }
   let uploadedFilePath = req.file.path; 
    try {
      const id = req.decoded.userInfo.id
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);


       // Required fields
        const requiredFields = [
          "Employee ID",
          "Employee Name",
          "Setting Unit Name",
          "Building Name",
          "Seating Location",
        ];

        // Check if all required columns exist
        const firstRow = data[0] || {};
        const excelColumns = Object.keys(firstRow);
        const missingFields = requiredFields.filter(
          (field) => !excelColumns.includes(field)
        );

        if (missingFields.length > 0) {
           fs.unlinkSync(uploadedFilePath);
          return res.status(400).send({
            success: false,
            status: 400,
            message: `Missing required field(s): ${missingFields.join(', ')}`,
          });
        }

      let total_update = 0
      let total_get = 0
      let total_id_matched = 0
      for (let row of data) {
        let reqData = {
          employee_id: row["Employee ID"],
          unit: row["Setting Unit Name"],
          building_name : row["Building Name"],
          seating_location : row["Seating Location"]
        };

      total_get ++
      const userInfo = await userModel.getUserByEmployeeId(reqData.employee_id)
      
      if(userInfo.length){
       if(userInfo[0].role_id === 3){
          total_id_matched ++
          const employeeData = await employeeModel.getById(userInfo[0].profile_id)
          if(employeeData.length && employeeData[0].seating_location === null){
        //check location 
         const seatingLocation = await seatingLocationModel.getByName(reqData.seating_location,reqData.building_name,reqData.unit)
         if(seatingLocation.length){
           const employee = await employeeModel.updateById(userInfo[0].profile_id,{seating_location: seatingLocation[0].seating_location_id})
            total_update ++
            if (employee.affectedRows == undefined || employee.affectedRows < 1) {
              fs.unlinkSync(uploadedFilePath);
            return res.status(500).send({
              success: false,
              status: 500,
              message: "Employee location file upload update Something Wrong in system database.",
            });
          }

         }else{
          console.log("Location not matched")
         }
          }

       }else{
        console.log("This user is another role.")
       }
      }else{
        console.log("Employee not found in DB.")
      }

      }
       fs.unlinkSync(uploadedFilePath);

      const getUnitInfo = await unitModel.getByTitle(data[0]["Setting Unit Name"])
      const track_data = {
          unit_id : getUnitInfo[0]?.id || null ,
          unit_name :  getUnitInfo[0]?.title || null ,
          total_id_matched : total_id_matched,
          total_update : total_update,
          total_get : total_get,
          created_by : id,
          updated_by : id,
      }

      const getTrackData = await locationUpdateTrackModel.getByUnitName(getUnitInfo[0].title)
      if(getTrackData.length){
       await locationUpdateTrackModel.updateById(getTrackData[0].id,{total_update:total_update,total_get:total_get,total_id_matched:total_id_matched,updated_by:id})
      }else{
      const track = await locationUpdateTrackModel.addNew(track_data)
      if (track.affectedRows == undefined || track.affectedRows < 1) {
          fs.unlinkSync(uploadedFilePath);
          return res.status(500).send({
            success: false,
            status: 500,
            message: "Location update track save data Something Wrong in system database.",
          });
      }
      }

      return res.status(200).send({
        success: true,
        status: 200,
        message: "Seating Location data updated.",
      });
    } catch (error) {
      if (fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }
      return res.status(500).send({
        success: false,
        status: 500,
        message: "Error processing the file.",
        error: error.message,
      });
    }
  }
);

router.get('/upload-unit-list', [verifyToken, routeAccessChecker("uploadUnitList")], async (req, res) => {

 const {limit = 50,offset = 0,unit_id,key} = req.query

    let result = await locationUpdateTrackModel.getList(offset,limit,unit_id,key);
    let countData = await locationUpdateTrackModel.getListCount(unit_id,key);

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Upload Unit data List.",
        "count": countData.length,
        "data": result
    });
});



module.exports = router;
