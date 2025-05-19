const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const { check, validationResult } = require("express-validator");
const moment = require("moment");
const e = require("express");
const assetModel = require("../models/asset");
const assetAssignModel = require("../models/asset-assign");
const employeeModel = require("../models/employee");
const superAdminModel = require("../models/super-admins");
const adminModel = require("../models/admins ");
const assetHistoryModel = require("../models/asset-history");
const assetUnitModel = require("../models/asset-unit");
const bcrypt = require("bcrypt");
const userModel = require("../models/user");
const unitModel = require("../models/asset-unit");
const locationModel = require("../models/location");
const { routeAccessChecker } = require("../middlewares/routeAccess");
const commonObject = require("../common/common");
const licensesModel = require("../models/licenses");
const unitAccessModel = require("../models/unit-access");
router.post(
  "/add",
  [verifyToken, routeAccessChecker("addAsset")],
  async (req, res) => {
    // body data
    let reqData = {
      name: req.body.name,
      category: req.body.category,
      purchase_date: req.body.purchase_date,
      serial_number: req.body.serial_number,
      po_number: req.body.po_number,
      asset_no: req.body.asset_no,
      unit_id: req.body.unit_id,
      location: req.body.location,
      model: req.body.model,
      specification: req.body.specification,
      device_remarks: req.body.device_remarks,
      is_assign: req.body.is_assign,
      employee_id: req.body.employee_id,
      is_new_employee: req.body.is_new_employee,
      user_id: req.body.user_id,
      employee_name: req.body.employee_name,
      department: req.body.department,
      designation: req.body.designation,
      email: req.body.email,
      contact_no: req.body.contact_no,
      joining_date: req.body.joining_date,
      employee_unit_name: req.body.employee_unit_name,
      price: req.body.price,
      licenses: req.body.licenses,
      blood_group: req.body.blood_group,
      business_type: req.body.business_type,
      line_of_business: req.body.line_of_business,
      grade: req.body.grade,
      pabx: req.body.pabx,
      assign_date: req.body.assign_date,
    };

    let current_date = new Date();
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format(
      "YYYY-MM-DD HH:mm:ss"
    );
    reqData.created_at = current_time;

    // check name
    if (isEmpty(reqData.name)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Name cannot be empty.",
      });
    }

    // check department
    if (isEmpty(reqData.category)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Category cannot be empty.",
      });
    }

    // date validation
    if (isEmpty(reqData.purchase_date)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Purchase date cannot be empty.",
      });
    }

    current_time = moment();
    if (!moment(reqData.purchase_date, "YYYY-MM-DD", true).isValid()) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Invalid purchase date.",
      });
    } else if (
      current_time.isBefore(moment(reqData.purchase_date, "YYYY-MM-DD"))
    ) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Invalid purchase date.",
      });
    }

    if (isEmpty(reqData.serial_number)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Serial number cannot be empty.",
      });
    }
    // unit validation
    if (isEmpty(reqData.unit_id)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Unit name cannot be empty.",
      });
    }

    const checkUnitId = await unitModel.getById(reqData.unit_id);
    if (isEmpty(checkUnitId)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "Unit not found.",
      });
    }
    const location = await locationModel.getById(reqData.location);
    if (reqData.location && isEmpty(location)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "This location not found.",
      });
    }

    // unit validation
    if (isEmpty(reqData.model)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Model  cannot be empty.",
      });
    }

    // yes =1 , no = 0

    if (reqData.is_new_employee == 0 && reqData.is_assign == 1) {
      let userId = await userModel.getById(reqData.user_id);
      // employee validation
      if (isEmpty(userId)) {
        return res.status(404).send({
          success: false,
          status: 404,
          message: "User not found.",
        });
      }

      if (!moment(reqData.assign_date, "YYYY-MM-DD", true).isValid()) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Invalid assign date.",
        });
      } else if (
        current_time.isBefore(moment(reqData.assign_date, "YYYY-MM-DD"))
      ) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Invalid assign date.",
        });
      }

      let data = {
        name: reqData.name,
        category: reqData.category,
        purchase_date: reqData.purchase_date,
        serial_number: reqData.serial_number,
        po_number: reqData.po_number,
        asset_no: reqData.asset_no,
        is_assign: reqData.is_assign,
        remarks: "assigned",
        unit_id: reqData.unit_id,
        location: reqData.location,
        model: reqData.model,
        specification: reqData.specification,
        device_remarks: reqData.device_remarks,
        price: reqData.price,
      };

      let result = await assetModel.addNew2(data);

      let getAssetId = await assetModel.getLastData();
      let assignData = {
        asset_id: getAssetId[0].id,
        user_id: reqData.user_id,
        assign_date: reqData.assign_date,
      };
      let result2 = await assetAssignModel.addNew(assignData);

      let employeeId = await employeeModel.getDataByEmployeeId(
        reqData.employee_id
      );
      let userLastData = await userModel.getActiveList();
      let asset = await assetModel.getAssetList();

      let assetHistory = {
        asset_id: asset[0].id,
        user_id: userId[0].id,
        history: `This asset assign To ${userId[0].name} and employee id: ${userId[0].employee_id}`,
        asset_assign_date: reqData.assign_date,
      };

      let createAssetHistory = await assetHistoryModel.addNew(assetHistory);

      if (
        createAssetHistory.affectedRows == undefined ||
        createAssetHistory.affectedRows < 1
      ) {
        return res.status(500).send({
          success: true,
          status: 500,
          message: "Something Wrong in system database.",
        });
      }

      return res.status(201).send({
        success: true,
        status: 201,
        message: "Asset added Successfully.",
      });
    }

    let data2 = {
      name: reqData.name,
      category: reqData.category,
      purchase_date: reqData.purchase_date,
      serial_number: reqData.serial_number,
      po_number: reqData.po_number,
      asset_no: reqData.asset_no,
      is_assign: reqData.is_assign,
      unit_id: reqData.unit_id,
      location: reqData.location,
      model: reqData.model,
      specification: reqData.specification,
      device_remarks: reqData.device_remarks,
      price: parseInt(reqData.price),
      created_by: req.decoded.userInfo.id,
    };

    let result = await assetModel.addNew2(data2);

    if (result.affectedRows == undefined || result.affectedRows < 1) {
      return res.status(500).send({
        success: true,
        status: 500,
        message: "Something Wrong in system database.",
      });
    }

    if (reqData.is_new_employee === 1 && reqData.is_assign === 1) {
      // check name
      if (isEmpty(reqData.employee_name)) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Employee name cannot be empty.",
        });
      }

      // check department
      if (isEmpty(reqData.department)) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Department cannot be empty.",
        });
      }

      if (isEmpty(reqData.designation)) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Designation cannot be empty.",
        });
      }

      if (isEmpty(reqData.email)) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Email cannot be empty.",
        });
      }

      // check contact_no
      if (
        isEmpty(reqData.contact_no) ||
        Number(reqData.contact_no.length) > 15
      ) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Give a valid phone number.",
        });
      }

      // date validation
      if (isEmpty(reqData.joining_date)) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Joining date cannot be empty.",
        });
      }

      current_time = moment();
      if (!moment(reqData.joining_date, "YYYY-MM-DD", true).isValid()) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Invalid date.",
        });
      } else if (
        current_time.isBefore(moment(reqData.joining_date, "YYYY-MM-DD"))
      ) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Invalid date.",
        });
      }

      // validation unit_name
      if (isEmpty(reqData.employee_unit_name)) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Employee Unit name cannot be empty.",
        });
      }

      if (reqData.licenses) {
        for (let index = 0; index < reqData.licenses.length; index++) {
          const element = reqData.licenses[index];
          let existingData = await licensesModel.getById(element);
          if (isEmpty(existingData)) {
            return res.status(400).send({
              success: false,
              status: 400,
              message: "This Licenses id not found.",
            });
          }
        }

        reqData.licenses = JSON.stringify(reqData.licenses);
      } else {
        reqData.licenses = null;
      }

      // // check duplicate
      let checkDuplicate = await employeeModel.getByExistsEmployee(
        reqData.employee_id
      );

      if (checkDuplicate.length) {
        return res.status(404).send({
          success: false,
          status: 404,
          message: "This employee already exists.",
        });
      }

      reqData.name = reqData.employee_name;

      let employeeData = {
        employee_id: reqData.employee_id,
        name: reqData.employee_name,
        department: reqData.department,
        designation: reqData.designation,
        email: reqData.email,
        contact_no: reqData.contact_no,
        joining_date: reqData.joining_date,
        unit_name: reqData.employee_unit_name,
        licenses: reqData.licenses,
        blood_group: reqData.blood_group,
        business_type: reqData.business_type,
        line_of_business: reqData.line_of_business,
        grade: reqData.grade,
        pabx: reqData.pabx,
      };

      let result = await employeeModel.addNew(employeeData);

      let employeeId = await employeeModel.getDataByEmployeeId(
        reqData.employee_id
      );
      let password = bcrypt.hashSync(reqData.employee_id, 10);

      let userData = {
        role_id: 3,
        profile_id: employeeId[0].id,
        employee_id: employeeId[0].employee_id,
        name: reqData.name,
        email: reqData.email,
        password: password,
      };

      let user = await userModel.addNew(userData);
      let userLastData = await userModel.getActiveList();

      let getByEmployeeDataByEmployeeId =
        await employeeModel.getDataByEmployeeId(reqData.employee_id);

      if (getByEmployeeDataByEmployeeId) {
        let getAssetId = await assetModel.getLastData();
        let assignData = {
          asset_id: getAssetId[0].id,
          user_id: employeeId[0].id,
          assign_date: reqData.assign_date,
        };

        let res = await assetAssignModel.addNew(assignData);

        // get all asset id

        let asset = await assetModel.getAssetList();

        // check already assign this asset
        let alreadyAssignedHistory = await assetHistoryModel.getByAssetId(
          asset[0].id
        );

        // update status
        let assetRemarksUpdate = await assetModel.updateById(asset[0].id, {
          remarks: "assigned",
        });

        if (alreadyAssignedHistory.length) {
          let updateStatus = await assetAssignModel.updateById(
            alreadyAssignedHistory[0].asset_id,
            { status: 0 }
          );

          let data = {
            status: 0,
            history: `This asset previous assign To ${employeeId[0].name} and employee id: ${employeeId[0].employee_id}`,
          };
          let updateStatusToHistory = await assetHistoryModel.updateById(
            alreadyAssignedHistory[0].id,
            data
          );
        }

        // assign asset history
        let assetHistory = {
          asset_id: asset[0].id,
          user_id: userLastData[0].id,
          history: `This asset assign To ${employeeId[0].name} and employee id: ${employeeId[0].employee_id}`,
          asset_assign_date: reqData.assign_date,
        };

        let assignEmployeeData = {
          asset_id: asset[0].id,
          user_id: userLastData[0].id,
          assign_date: reqData.assign_date,
        };

        let result2 = await assetAssignModel.addNew(assignEmployeeData);
        let createAssetHistory = await assetHistoryModel.addNew(assetHistory);

        if (result2.affectedRows == undefined || result2.affectedRows < 1) {
          return res.status(500).send({
            success: true,
            status: 500,
            message: "Something Wrong in system database.",
          });
        }
      }
    }

    return res.status(201).send({
      success: true,
      status: 201,
      message: "Asset added Successfully.",
      // "duplicate_message":`This Asset serial number ${getDuplicate}  already exists`
    });
  }
);

// list
router.get(
  "/list",
  [verifyToken, routeAccessChecker("assetList")],
  async (req, res) => {
    let reqData = {
      limit: req.query.limit || 100,
      offset: req.query.offset || 0,
      key: req.query.key,
      unit: req.query.unit,
      location: req.query.location,
      type: req.query.type,
      status: parseInt(req.query.status),
      from_date : req.query.from_date,
      to_date : req.query.to_date,
    };

    let { offset, limit, key, unit, type, location, status,from_date,to_date } = reqData;

    let result = await assetModel.getList(
      offset,
      limit,
      key,
      unit,
      type,
      location,
      status,
      from_date,
      to_date 
    );

    for (let index = 0; index < result.length; index++) {
      const element = result[index].unit_id;

      let getUnitname = await unitModel.getById(element);
      if (getUnitname.length) {
        result[index].unit_name = getUnitname[0].title;
      } else {
        result[index].unit_name = "";
      }

      let getLocationName = await locationModel.getById(result[index].location);
      result[index].location_name = getLocationName[0]?.location || "";
      result[index].location = getLocationName[0]?.id || "";

      //let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
      let purchaseDate = new Date(result[index].purchase_date);
      let currentTime = new Date();

      let warrantyEndDate = new Date(purchaseDate);
      warrantyEndDate.setFullYear(warrantyEndDate.getFullYear() + 3);

      if (currentTime <= warrantyEndDate) {
        let timeDiff = warrantyEndDate - currentTime;
        let daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        result[index].warranty = `Remaining warranty ${daysLeft} days.`;
      } else {
        result[index].warranty = "Warranty expired";
      }
    }
    let totalCount = await assetModel.getTotalList(
      key,
      unit,
      type,
      location,
      status,
      from_date,
      to_date 
    );

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Asset List.",
      total: totalCount.length,
      data: result,
    });
  }
);

// total list
router.get(
  "/all-list",
  [verifyToken, routeAccessChecker("assetAllList")],
  async (req, res) => {
    let result = await assetModel.getTotalList();
    for (let index = 0; index < result.length; index++) {
      const element = result[index].unit_id;

      let getUnitname = await unitModel.getById(element);
      if (getUnitname.length) {
        result[index].unit_name = getUnitname[0].title;
      } else {
        result[index].unit_name = "";
      }
    }

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Asset List.",
      count: result.length,
      data: result,
    });
  }
);

//details
router.get(
  "/details/:id",
  [verifyToken, routeAccessChecker("assetDetails")],
  async (req, res) => {
    let id = req.params.id;

    // get id wise data form db
    let result = await assetModel.getById(id);
    // check this id already existing in database or not
    if (isEmpty(result)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "Asset data not found.",
      });
    }

    let assignDataByAssetId = await assetAssignModel.getById(result[0].id);

    if (assignDataByAssetId && assignDataByAssetId.length > 0) {
      let userData = await userModel.getDataById(
        assignDataByAssetId[0].user_id
      );

      if (userData && userData.length > 0) {
        // Check for role_id and handle accordingly
        if (userData[0].role_id == 1) {
          let superData = await superAdminModel.getById(userData[0].profile_id);
          if (superData && superData.length > 0) {
            result[0].user_id = assignDataByAssetId[0].user_id;
            result[0].employee_name = superData[0].name;
            result[0].employee_id_no = superData[0].employee_id;
            result[0].employee_department = superData[0].department;
            result[0].employee_designation = superData[0].designation;
            result[0].employee_unit = superData[0].unit_name;
            result[0].assign_date = assignDataByAssetId[0].assign_date;
          }
        } else if (userData[0].role_id == 2) {
          let adminData = await adminModel.getById(userData[0].profile_id);
          if (adminData && adminData.length > 0) {
            result[0].user_id = assignDataByAssetId[0].user_id;
            result[0].employee_name = adminData[0].name;
            result[0].employee_id_no = adminData[0].employee_id;
            result[0].employee_department = adminData[0].department;
            result[0].employee_designation = adminData[0].designation;
            result[0].employee_unit = adminData[0].unit_name;
            result[0].assign_date = assignDataByAssetId[0].assign_date;
          }
        } else if (userData[0].role_id == 3) {
          let employeeData = await employeeModel.getById(
            userData[0].profile_id
          );
          if (employeeData && employeeData.length > 0) {
            result[0].user_id = assignDataByAssetId[0].user_id;
            result[0].employee_name = employeeData[0].name;
            result[0].employee_id_no = employeeData[0].employee_id;
            result[0].employee_department = employeeData[0].department;
            result[0].employee_designation = employeeData[0].designation;
            result[0].employee_unit = employeeData[0].unit_name;
            result[0].assign_date = assignDataByAssetId[0].assign_date;
          }
        }
      }
    } else {
      // If no data found, set default values
      result[0].user_id = "";
      result[0].employee_name = "";
      result[0].employee_id_no = "";
      result[0].employee_department = "";
      result[0].employee_designation = "";
      result[0].employee_unit = "";
    }

    let assetUnitData = await assetUnitModel.getById(result[0].unit_id);
    if (assetUnitData) {
      result[0].unit_name = assetUnitData[0].title;
    } else {
      result[0].unit_name = "";
    }
    let getLocationName = await locationModel.getById(result[0].location);
    result[0].location_name = getLocationName[0]?.location || "";
    result[0].location = getLocationName[0]?.id || "";

    let getHistory = await assetHistoryModel.getByAssetId(id);

    let arr = [];
    for (let index = 0; index < getHistory.length; index++) {
      const element = getHistory[index];
      arr.push(element);
    }
    result[0].history = arr;

    let current_date = new Date();
    //let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
    let purchaseDate = new Date(result[0].purchase_date);
    let currentTime = new Date();

    let warrantyEndDate = new Date(purchaseDate);
    warrantyEndDate.setFullYear(warrantyEndDate.getFullYear() + 3);

    if (currentTime <= warrantyEndDate) {
      let timeDiff = warrantyEndDate - currentTime;
      let daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

      result[0].warranty = `Remaining warranty ${daysLeft} days.`;
    } else {
      result[0].warranty = "Warranty expired";
    }

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Asset details.",
      data: result[0],
    });
  }
);

//delete
router.delete(
  "/delete/:id",
  [verifyToken, routeAccessChecker("assetUpdate")],
  async (req, res) => {
    let id = req.params.id;

    // get id wise data form db
    let existingById = await assetModel.getById(id);

    // check this id already existing in database or not
    if (isEmpty(existingById)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "Asset data not found.",
      });
    }
    let checkAlreadyAssign = await assetAssignModel.getById(id);
    if (checkAlreadyAssign.length) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "This asset already assign.Please move to stock first.",
      });
    }
    let current_date = new Date();
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format(
      "YYYY-MM-DD HH:mm:ss"
    );

    let data = {
      status: 0, // status = 1 (active) and status = 0 (delete)
    };

    // get id wise data form db
    let result = await assetModel.updateById(id, data);
    // let deleteAssignStock = await assetAssignModel.deleteAssetById(id);
    // let deleteAssignStockHistory = await assetHistoryModel.deleteAssetById(id);

    if (result.affectedRows == undefined || result.affectedRows < 1) {
      return res.status(500).send({
        success: true,
        status: 500,
        message: "Something Wrong in system database.",
      });
    }

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Asset successfully deleted.",
    });
  }
);

// active / deactivate
router.put(
  "/changeStatus/:id",
  [verifyToken, routeAccessChecker("assetChangeStatus")],
  async (req, res) => {
    let id = req.params.id;

    // get id wise data form db
    let existingById = await assetModel.getByIdActiveData(id);

    // check this id already existing in database or not
    if (isEmpty(existingById)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "Asset data not found.",
      });
    }

    let alreadyAssignAsset = await assetAssignModel.getById(id);

    // check this id already existing in database or not
    if (alreadyAssignAsset.length) {
      return res.status(400).send({
        success: false,
        status: 400,
        message:
          "This asset already assign.In this moment your could not inactive this asset.",
      });
    }

    let data = {
      status: existingById[0].status == 1 ? 2 : 1,
    };

    // get id wise data form db
    let result = await assetModel.updateById(id, data);

    if (result.affectedRows == undefined || result.affectedRows < 1) {
      return res.status(500).send({
        success: true,
        status: 500,
        message: "Something Wrong in system database.",
      });
    }

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Asset status successfully updated.",
    });
  }
);

//update
router.put(
  "/update/:id",
  [verifyToken, routeAccessChecker("updateAsset")],
  async (req, res) => {
    let id = req.params.id;
    // body data
    let reqData = {
      name: req.body.name,
      category: req.body.category,
      purchase_date: req.body.purchase_date,
      serial_number: req.body.serial_number,
      po_number: req.body.po_number,
      asset_no: req.body.asset_no,
      unit_id: req.body.unit_id,
      model: req.body.model,
      specification: req.body.specification,
      device_remarks: req.body.device_remarks,
      assign_update: parseInt(req.body.assign_update),
      user_id: req.body.user_id,
      location: req.body.location,
      assign_date: req.body.assign_date,
      price: req.body.price,
    };

    let current_date = new Date();
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format(
      "YYYY-MM-DD HH:mm:ss"
    );

    // get asset all list
    let existingDataById = await assetModel.getById(id);
    if (isEmpty(existingDataById)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "Asset data not found",
      });
    }

    let isError = 0;
    let updateData = {};
    let willWeUpdate = 0; // 1 = yes , 0 = no;

    // check employee_id
    if (existingDataById[0].name != reqData.name) {
      willWeUpdate = 1;
      updateData.name = reqData.name;
    }

    // check name
    if (existingDataById[0].category != reqData.category) {
      willWeUpdate = 1;
      updateData.category = reqData.category;
    }

    // check contact_no
    if (existingDataById[0].purchase_date != reqData.purchase_date) {
      current_time = moment();
      if (!moment(reqData.purchase_date, "YYYY-MM-DD", true).isValid()) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Invalid date.",
        });
      } else if (
        current_time.isBefore(moment(reqData.purchase_date, "YYYY-MM-DD"))
      ) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Invalid date.",
        });
      }

      willWeUpdate = 1;
      updateData.purchase_date = reqData.purchase_date;
    }

    // check serial_number
    if (existingDataById[0].serial_number != reqData.serial_number) {
      willWeUpdate = 1;
      updateData.serial_number = reqData.serial_number;
    }

    // check po_number
    if (existingDataById[0].po_number != reqData.po_number) {
      willWeUpdate = 1;
      updateData.po_number = reqData.po_number;
    }

    // check asset no
    if (existingDataById[0].asset_no != reqData.asset_no) {
      willWeUpdate = 1;
      updateData.asset_no = reqData.asset_no;
    }

    // check unit_id
    if (existingDataById[0].unit_id != reqData.unit_id) {
      willWeUpdate = 1;
      updateData.unit_id = reqData.unit_id;
    }
    if (existingDataById[0].location != reqData.location) {
      // const checkUnitWiseLocation = await locationModel.getById(reqData.location)
      // if(isEmpty(checkUnitWiseLocation)){
      //   return res.status(404).send({
      //       "success": false,
      //       "status": 404,
      //       "message":"This location is not under this unit."
      // });
      // }
      willWeUpdate = 1;
      updateData.location = reqData.location;
    }

    if (existingDataById[0].model != reqData.model) {
      willWeUpdate = 1;
      updateData.model = reqData.model;
    }

    if (existingDataById[0].specification != reqData.specification) {
      willWeUpdate = 1;
      updateData.specification = reqData.specification;
    }

    if (existingDataById[0].device_remarks != reqData.device_remarks) {
      willWeUpdate = 1;
      updateData.device_remarks = reqData.device_remarks;
    }

    if (existingDataById[0].price != reqData.price) {
      willWeUpdate = 1;
      updateData.price = parseInt(reqData.price);
    }

    if (isError == 1) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: errorMessage,
      });
    }

    if (reqData.assign_update === 1) {
      // get asset assign data
      let assetAssignData = await assetAssignModel.getById(id);

      if (assetAssignData.length) {
        if (assetAssignData[0].user_id != reqData.user_id) {
          // employee validation
          if (isEmpty(reqData.user_id)) {
            return res.status(400).send({
              success: false,
              status: 400,
              message: "User id cannot be empty.",
            });
          }

          if (!moment(reqData.assign_date, "YYYY-MM-DD", true).isValid()) {
            return res.status(400).send({
              success: false,
              status: 400,
              message: "Invalid assign date.",
            });
          } else if (
            current_time.isBefore(moment(reqData.assign_date, "YYYY-MM-DD"))
          ) {
            return res.status(400).send({
              success: false,
              status: 400,
              message: "Invalid assign date.",
            });
          }

          let updateEmployeeDataCreate = {
            asset_id: id,
            user_id: reqData.user_id,
            assign_date: reqData.assign_date,
          };

          let updateEmployeeData = {
            asset_id: id,
            status: 0,
          };

          let result2 = await assetAssignModel.updateById(
            id,
            updateEmployeeData
          );

          let createNew = await assetAssignModel.addNew(
            updateEmployeeDataCreate
          );

          // get history id
          let assetHistoryData = await assetHistoryModel.getByAssetId(id);

          let userData = await userModel.getById(reqData.user_id);

          let assetHistoryUpdate = {
            asset_id: id,
            status: 0,
          };

          let assetHistoryCreate = {
            asset_id: id,
            user_id: reqData.user_id,
            history: `This asset assign To ${userData[0].name} and employee id: ${userData[0].employee_id}`,
            asset_assign_date: reqData.assign_date,
          };

          let historyUpdate = await assetHistoryModel.updateById(
            id,
            assetHistoryUpdate
          );
          let historyCreate = await assetHistoryModel.addNew(
            assetHistoryCreate
          );

          if (
            historyCreate.affectedRows == undefined ||
            historyCreate.affectedRows < 1
          ) {
            return res.status(500).send({
              success: true,
              status: 500,
              message: "Something Wrong in system database.",
            });
          }
        }
      } else {
        // employee validation
        if (isEmpty(reqData.user_id)) {
          return res.status(400).send({
            success: false,
            status: 400,
            message: "User id cannot be empty.",
          });
        }

        if (!moment(reqData.assign_date, "YYYY-MM-DD", true).isValid()) {
          return res.status(400).send({
            success: false,
            status: 400,
            message: "Invalid assign date.",
          });
        } else if (
          current_time.isBefore(moment(reqData.assign_date, "YYYY-MM-DD"))
        ) {
          return res.status(400).send({
            success: false,
            status: 400,
            message: "Invalid assign date.",
          });
        }

        let updateEmployeeData = {
          asset_id: id,
          user_id: reqData.employee_id,
          assign_date: reqData.assign_date,
        };

        let result = await assetModel.updateById(id, {
          is_assign: 1,
          remarks: "assigned",
        });
        let result2 = await assetAssignModel.addNew(updateEmployeeData);

        if (result2.affectedRows == undefined || result2.affectedRows < 1) {
          return res.status(500).send({
            success: true,
            status: 500,
            message: "Something Wrong in system database.",
          });
        }
      }
    } else if (reqData.assign_update === 0) {
      let data = {
        status: 0,
      };
      let updateAssignDataStatus = await assetAssignModel.updateById(id, data);
      let updateAssignDataHistoryStatus = await assetHistoryModel.updateById(
        id,
        data
      );

      let result = await assetModel.updateById(id, {
        remarks: "in_stock",
        is_assign: 0,
      });

      if (result.affectedRows == undefined || result.affectedRows < 1) {
        return res.status(500).send({
          success: true,
          status: 500,
          message: "Something Wrong in system database.",
        });
      }
    }

    if (willWeUpdate == 1) {
      let result = await assetModel.updateById(id, updateData);

      if (result.affectedRows == undefined || result.affectedRows < 1) {
        return res.status(500).send({
          success: true,
          status: 500,
          message: "Something Wrong in system database.",
        });
      }

      return res.status(200).send({
        success: true,
        status: 200,
        message: "Asset successfully updated.",
      });
    } else {
      return res.status(200).send({
        success: true,
        status: 200,
        message: "Nothing to update.",
      });
    }
  }
);

// assign employee
router.put(
  "/assign-employee/:id",
  [verifyToken, routeAccessChecker("assignEmployee")],
  async (req, res) => {
    let id = req.params.id;
    let user_id = req.decoded.userInfo.id;
    let reqData = {
      user_id: req.body.user_id,
      assign_date: req.body.assign_date,
    };

    let current_date = new Date();
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format(
      "YYYY-MM-DD HH:mm:ss"
    );

    // get id wise data form db
    let result = await assetModel.getById(id);

    // check this id already existing in database or not
    if (isEmpty(result)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "Asset data not found.",
      });
    }

    // employee validation
    if (isEmpty(reqData.user_id)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "User id cannot be empty.",
      });
    }

    const userData = await userModel.getById(reqData.user_id);
    if (isEmpty(userData)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "This user not found.",
      });
    }

    if (!moment(reqData.assign_date, "YYYY-MM-DD", true).isValid()) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Invalid assign date.",
      });
    }

    let assignEmployeeData = {
      asset_id: id,
      user_id: reqData.user_id,
      assign_date: reqData.assign_date,
      created_at: current_time,
    };

    let updateRemarks = await assetModel.updateById(id, {
      is_assign: 1,
      remarks: "assigned",
    });

    //let getUserIdByEmployeeId = await userModel.getByEmployeeId(reqData.employee_id)

    // check already assign this asset
    let alreadyAssignedHistory = await assetHistoryModel.getByAssetId(id);

    if (alreadyAssignedHistory.length) {
      let updateStatus = await assetAssignModel.updateById(
        alreadyAssignedHistory[0].asset_id,
        { status: 0 }
      );

      let data = {
        status: 0,
        history: `This asset previous assign To ${userData[0].name} and employee id: ${userData[0].employee_id}`,
      };
      let updateStatusToHistory = await assetHistoryModel.updateById(
        alreadyAssignedHistory[0].id,
        data
      );
    }

    // get asset assign date
    //et getAssetDate = await assetAssignModel.getById()

    // assign asset history
    let assetHistory = {
      asset_id: id,
      user_id: userData[0].id,
      history: `This asset assign To ${userData[0].name} and employee id: ${userData[0].employee_id}`,
      asset_assign_date: reqData.assign_date,
    };
    let result2 = await assetAssignModel.addNew(assignEmployeeData);
    let createAssetHistory = await assetHistoryModel.addNew(assetHistory);

    // get employee email data
    let employeeData = await employeeModel.getById(userData[0].profile_id);

    // get assign time
    let getAssinDate = await assetAssignModel.getById(id);

    // get assign name
    let getAssignName = await userModel.getById(user_id);
    // get unit name
    let getUnitName = await unitModel.getById(result[0].unit_id);

    try {
      if (employeeData) {
        let assignDate = new Date(getAssinDate[0].assign_date).toDateString(); // Convert to readable date format

        let sendEmail = await commonObject.sentEmailByHtmlFormate(
          userData[0].email,
          "Asset Disbursement",
          userData[0].name || "", // employee name
          result[0].name || "", // asset name
          result[0].category || "", // asset type - category
          result[0].serial_number || "", // serial no
          assignDate, // formatted assign date
          getAssignName[0].name || "", // assigned by
          getUnitName[0].title || "" // assigned unit
        );
      }
    } catch (error) {
      console.log("Assign asset email sending error : ", error);
    }
    if (
      createAssetHistory.affectedRows == undefined ||
      createAssetHistory.affectedRows < 1
    ) {
      return res.status(500).send({
        success: true,
        status: 500,
        message: "Something Wrong in system database.",
      });
    }

    return res.status(201).send({
      success: true,
      status: 201,
      message: "Employee assign Successfully Done.",
    });
  }
);

router.get(
  "/distributed-asset",
  [verifyToken, routeAccessChecker("distributedAsset")],
  async (req, res) => {
    let assignData;
    if (req.decoded.userInfo.role_id === 2) {
      const assign_unit = await unitAccessModel.getById(
        req.decoded.userInfo.id
      );
      if (assign_unit) {
        assignData = assign_unit[0].unit_id;
      }
    }
    let reqData = {
      limit: req.query.limit || 50,
      offset: req.query.offset || 0,
      key: req.query.key,
      unit: req.query.unit || assignData,
      location: req.query.location,
      type: req.query.type,
      employee_type: req.query.employee_type,
      from_date : req.query.from_date,
      to_date : req.query.to_date,

    };
    let { offset, limit, key, unit, type, employee_type, location, from_date,to_date } = reqData;

    let result = await assetModel.distributedAssetList(
      offset,
      limit,
      key,
      unit,
      type,
      employee_type,
      location,
      from_date,
      to_date
    );
    let totalResult = await assetModel.distributedAssetTotalList(
      key,
      unit,
      type,
      employee_type,
      location,
      from_date,
      to_date
    );

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Distributed asset list.",
      total: totalResult.length,
      data: result,
    });
  }
);

router.get(
  "/admin-distributed-asset",
  [verifyToken, routeAccessChecker("adminDistributedAsset")],
  async (req, res) => {
    let reqData = {
      limit: req.query.limit || 50,
      offset: req.query.offset || 0,
      key: req.query.key,
      unit: req.query.unit,
      location: req.query.location,
      type: req.query.type,
      employee_type: req.query.employee_type,
    };
    let { offset, limit, key, unit, type, employee_type, location } = reqData;
    let user_id = req.decoded.userInfo.id;
    let result = await assetModel.adminDistributedAssetList(
      offset,
      limit,
      key,
      unit,
      type,
      employee_type,
      location,
      user_id
    );
    let totalResult = await assetModel.adminDistributedAssetTotalList(
      key,
      unit,
      type,
      employee_type,
      location,
      user_id
    );

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Distributed asset list.",
      total: totalResult.length,
      data: result,
    });
  }
);

//distributed asset list
router.get(
  "/all-distributed-asset",
  [verifyToken, routeAccessChecker("allDistributedAsset")],
  async (req, res) => {
    let result = await assetModel.distributedAssetTotalList();

    for (let i = 0; i < result.length; i++) {
      const resultId = result[i].id;

      // Get assign data
      let assignDataByAssetId = await assetAssignModel.getById(resultId);

      if (!isEmpty(assignDataByAssetId)) {
        result[i].employee_id = assignDataByAssetId[0].employee_id;
        result[i].assign_date = assignDataByAssetId[0].assign_date;

        // Get employee data based on the employee_id from assignDataByAssetId
        let employeeData = await employeeModel.getById(
          assignDataByAssetId[0].employee_id
        );

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
      total: result.length,
      data: result,
    });
  }
);

//details
router.get(
  "/distributed-details/:id",
  [verifyToken, routeAccessChecker("distributedDetails")],
  async (req, res) => {
    let id = req.params.id;

    // get id wise data form db
    let result = await assetModel.getDistributedData(id);

    // check this id already existing in database or not
    if (isEmpty(result)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "Asset data not found.",
      });
    }

    let getHistory = await assetHistoryModel.getByAssetId(id);

    let arr = [];
    for (let index = 0; index < getHistory.length; index++) {
      const element = getHistory[index];
      arr.push(element);
    }
    result[0].history = arr;

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Asset details.",
      data: result[0],
    });
  }
);

const multer = require("multer");
const xlsx = require("xlsx");
const path = require("path");
const { get } = require("http");
const { ADDRGETNETWORKPARAMS } = require("dns");

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/asset/"); // Set the destination folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
  },
});

const upload = multer({ storage: storage });

// API to upload Excel file and save data
const xlsxDateToJSDate = (serial) => {
  const epoch = new Date(Date.UTC(0, 0, serial - 1));
  return new Date(epoch.getTime() + epoch.getTimezoneOffset() * 60000);
};

router.post(
  "/upload-asset",
  [verifyToken, routeAccessChecker("uploadAsset")],
  upload.single("file"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "No file uploaded.",
      });
    }

    try {
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);

      // Required fields
      const requiredFields = [
        "Name",
        "Category",
        "Serial number",
        "Model",
        "Unit name",
      ];

      // Iterate through each row and save to the database
      for (let row of data) {
        // Check for missing fields
        for (const field of requiredFields) {
          if (!row[field]) {
            return res.status(400).send({
              success: false,
              status: 400,
              message: `Missing required field: ${field}.`,
            });
          }
        }

        // Handle purchase_date conversion
        let purchase_date = row["Purchase date"];
        if (typeof purchase_date === "number") {
          purchase_date = xlsxDateToJSDate(purchase_date)
            .toISOString()
            .split("T")[0];
        }

        let reqData = {
          name: row["Name"],
          category: row["Category"],
          purchase_date: purchase_date,
          serial_number: row["Serial number"],
          po_number: row["PO number"],
          asset_no: row["Asset no"],
          model: row["Model"],
          specification: row["Specification"],
          device_remarks: row["Device remarks"],
          unit_name: row["Unit name"],
          location_name: row["Location"],
          price: row["Price"],
          created_by: req.decoded.userInfo.id,
        };

        let unitArr = [];
        // get asset unit data
        let assetUnitData = await assetUnitModel.getOnlyDataList();
        for (let index = 0; index < assetUnitData.length; index++) {
          const data = assetUnitData[index];
          unitArr.push(data);
        }

        // Loop through unitArr to find the matching unit
        let unitMatch = false;
        for (let index = 0; index < unitArr.length; index++) {
          const element = unitArr[index];
          // Check if unit_name matches the title in the assetUnitData
          if (element.title.toLowerCase() === reqData.unit_name.toLowerCase()) {
            reqData.unit_id = element.id;
            unitMatch = true;
            break;
          }
        }

        // If no matching unit is found, return an error
        if (!unitMatch) {
          return res.status(400).send({
            success: false,
            status: 400,
            message: `Unit name ${reqData.unit_name} does not match any known units.`,
          });
        }

        // Remove unit_name from reqData since it is no longer needed
        delete reqData.unit_name;

        let locationArr = [];
        // get asset unit data
        let locationData = await locationModel.getOnlyDataList();

        for (let index = 0; index < locationData.length; index++) {
          const data = locationData[index];
          locationArr.push(data); // Store the asset unit data in unitArr
        }

        // Loop through unitArr to find the matching unit
        let locationMatch = false;
        for (let index = 0; index < locationArr.length; index++) {
          const element = locationArr[index];
          // Check if unit_name matches the title in the assetUnitData
          if (
            element &&
            element.location.toLowerCase() ===
              reqData.location_name.toLowerCase()
          ) {
            reqData.location = element.id; // Assign the matched id to unit_id
            locationMatch = true;
            break; // Exit the loop once a match is found
          }
        }

        // If no matching unit is found, return an error
        if (!locationMatch) {
          return res.status(400).send({
            success: false,
            status: 400,
            message: `Location ${reqData.location_name} does not match any known location.`,
          });
        }

        // Remove unit_name from reqData since it is no longer needed
        delete reqData.location_name;

        // Save to database
        let result = await assetModel.addNew2(reqData);
        if (!result.affectedRows || result.affectedRows < 1) {
          return res.status(500).send({
            success: false,
            status: 500,
            message: "Something went wrong in the database.",
          });
        }
      }

      return res.status(201).send({
        success: true,
        status: 201,
        message: "All assets added successfully.",
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        status: 500,
        message: "Error processing the file.",
        error: error.message,
      });
    }
  }
);

// list
router.get(
  "/admin-unit-assign-list",
  [verifyToken, routeAccessChecker("adminAssinUnitAsset")],
  async (req, res) => {
    let reqData = {
      limit: req.query.limit || 100,
      offset: req.query.offset || 0,
      key: req.query.key,
      unit: req.query.unit,
      location: req.query.location,
      type: req.query.type,
      status: req.query.status,
    };
    let user_id = req.decoded.userInfo.id;
    let { offset, limit, key, unit, type, location, status } = reqData;

    let result = await assetModel.getList(
      offset,
      limit,
      key,
      unit,
      type,
      location,
      status
    );

    let getUnitAssignList = await unitAccessModel.getUserWise(user_id);

    getUnitAssignList = JSON.parse(JSON.stringify(getUnitAssignList));

    // Filter result to include only matching unit_ids
    let filteredResult = result.filter((item) =>
      getUnitAssignList.some(
        (assign) => assign.unit_id === parseInt(item.unit_id)
      )
    );

    for (let index = 0; index < filteredResult.length; index++) {
      const element = filteredResult[index].unit_id;

      let getUnitname = await unitModel.getById(element);
      if (getUnitname.length) {
        filteredResult[index].unit_name = getUnitname[0].title;
      } else {
        filteredResult[index].unit_name = "";
      }

      let current_date = new Date();
      let purchaseDate = new Date(filteredResult[index].purchase_date);
      let currentTime = new Date();

      let warrantyEndDate = new Date(purchaseDate);
      warrantyEndDate.setFullYear(warrantyEndDate.getFullYear() + 3);

      if (currentTime <= warrantyEndDate) {
        let timeDiff = warrantyEndDate - currentTime;
        let daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        filteredResult[index].warranty = `Remaining warranty ${daysLeft} days.`;
      } else {
        filteredResult[index].warranty = "Warranty expired";
      }
    }

    let unitDefine;
    let count = 0;
    if (req.decoded.userInfo.role_id === 2) {
      if (getUnitAssignList.length > 1 && isEmpty(unit)) {
        unitDefine = getUnitAssignList[0].unit_id;
        totalCount = await assetModel.getTotalList(
          key,
          unitDefine,
          type,
          status
        );
        count = totalCount.length;
      } else if (!isEmpty(unit)) {
        totalCount = await assetModel.getTotalList(key, unit, type);
        count = totalCount.length;
      } else {
        count = 0;
      }
    }

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Asset List.",
      total: count,
      data: filteredResult,
    });
  }
);

module.exports = router;
