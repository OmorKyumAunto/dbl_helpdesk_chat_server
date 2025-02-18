const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const assetUnitModel = require("../models/asset-unit");
const assetModel = require("../models/asset");
const unitAccessModel = require("../models/unit-access");
const userModel = require("../models/user");
const locationModel = require("../models/location");

const verifyToken = require("../middlewares/verifyToken");
const { routeAccessChecker } = require("../middlewares/routeAccess");
const moment = require("moment");
const ticketCategoryModel = require("../models/ticket-category");
require("dotenv").config();

router.get(
  "/list",
  [verifyToken, routeAccessChecker("ticketCategoryList")],
  async (req, res) => {
    const status = req.query.status;

    let result = await ticketCategoryModel.getList(status);

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Ticket category List.",
      count: result.length,
      data: result,
    });
  }
);

router.get(
  "/active-list",
  [verifyToken, routeAccessChecker("ticketCategoryActiveList")],
  async (req, res) => {
    let result = await ticketCategoryModel.getActiveList();

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Ticket category List.",
      count: result.length,
      data: result,
    });
  }
);

router.post(
  "/add",
  [verifyToken, routeAccessChecker("ticketCategoryCreate")],
  async (req, res) => {
    let reqData = {
      title: req.body.title,
    };

    let current_date = new Date();
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format(
      "YYYY-MM-DD HH:mm:ss"
    );

    reqData.created_at = current_time;
    reqData.updated_at = current_time;

    let existingData = await ticketCategoryModel.getByTitle(reqData.title);

    if (!isEmpty(existingData)) {
      return res.status(409).send({
        success: false,
        status: 409,
        message:
          existingData[0].status == "active"
            ? "This Title Already Exists."
            : "This title Already Exists but Deactivate, You can activate it.",
      });
    }

    let result = await ticketCategoryModel.addNew(reqData);

    if (result.affectedRows == undefined || result.affectedRows < 1) {
      return res.status(500).send({
        success: false,
        status: 500,
        message: "Something Wrong in system database.",
      });
    }

    return res.status(201).send({
      success: true,
      status: 201,
      message: "Ticket category added Successfully.",
    });
  }
);

router.put(
  "/update/:id",
  [verifyToken, routeAccessChecker("ticketCategoryUpdate")],
  async (req, res) => {
    let id = req.params.id;
    let reqData = {
      title: req.body.title,
    };

    reqData.updated_by = req.decoded.userInfo.id;
    let current_date = new Date();
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format(
      "YYYY-MM-DD HH:mm:ss"
    );

    let existingDataById = await ticketCategoryModel.getById(id);
    if (isEmpty(existingDataById)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "No data found",
      });
    }

    let updateData = {};

    let errorMessage = "";
    let isError = 0; // 1 = yes, 0 = no
    let willWeUpdate = 0; // 1 = yes , 0 = no;

    // name
    if (existingDataById[0].title !== reqData.title) {
      let existingDataByname = await ticketCategoryModel.getByTitle(
        reqData.title
      );

      if (!isEmpty(existingDataByname) && existingDataByname[0].id != id) {
        isError = 1;
        errorMessage +=
          existingDataByname[0].status == "active"
            ? "This title Already Exist."
            : "This title Already Exist but Deactivate, You can activate it.";
      }

      willWeUpdate = 1;
      updateData.title = reqData.title;
    }

    if (isError == 1) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: errorMessage,
      });
    }

    if (willWeUpdate == 1) {
      updateData.updated_at = current_time;

      let result = await ticketCategoryModel.updateById(id, updateData);

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
        message: "Ticket category successfully updated.",
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

router.delete(
  "/delete/:id",
  [verifyToken, routeAccessChecker("ticketCategoryDelete")],
  async (req, res) => {
    let id = req.params.id;

    let current_date = new Date();
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format(
      "YYYY-MM-DD HH:mm:ss"
    );

    let existingDataById = await ticketCategoryModel.getById(id);
    if (isEmpty(existingDataById)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "No data found",
      });
    }

    let data = {
      status: "delete",
      updated_at: current_time,
    };

    let result = await ticketCategoryModel.updateById(id, data);

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
      message: "Ticket category successfully deleted.",
    });
  }
);

router.put(
  "/changeStatus/:id",
  [verifyToken, routeAccessChecker("ticketCategoryChangeStatus")],
  async (req, res) => {
    let id = req.params.id;

    let current_date = new Date();
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format(
      "YYYY-MM-DD HH:mm:ss"
    );

    let existingDataById = await ticketCategoryModel.getById(id);
    if (isEmpty(existingDataById)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "No data found",
      });
    }

    let data = {
      status: existingDataById[0].status == "active" ? "deactivate" : "active",
      updated_at: current_time,
    };

    let result = await ticketCategoryModel.updateById(id, data);

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
      message: "Ticket category status has successfully changed.",
    });
  }
);

module.exports = router;
