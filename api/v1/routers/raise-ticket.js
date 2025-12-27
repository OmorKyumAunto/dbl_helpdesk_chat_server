const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const assetUnitModel = require("../models/asset-unit");
const raiseTicketModel = require("../models/raise-ticket");
const assetAssignModel = require("../models/asset-assign");
const unitAccessModel = require("../models/unit-access");
const ticketCategoryModel = require("../models/ticket-category");
const userModel = require("../models/user");
const ticketCommentModel = require("../models/ticket-comment");
const ticketForwardModel = require("../models/ticket-forword");
const seatingLocationModel = require("../models/seating-location");
const assignSeatingLocationModel = require("../models/assign-seating-location");
const employeeModel = require("../models/employee");
const adminModel = require("../models/admins ");
const unitSUperAdminModel = require("../models/unit-super-admin");
const verifyToken = require("../middlewares/verifyToken");
const { routeAccessChecker } = require("../middlewares/routeAccess");
const moment = require("moment");
const path = require("path");
const commonObject = require("../common/common");
const common = require("../common/common");
const { upload, multerErrorHandler } = require("../common/upload-image");
const validateRequest = require("../validator/middleware");
const { reRaiseTicketCommentSchema ,onBehalfTicketSchema,raiseTicketSchema,forwardTicketSchema} = require("../validator/validate-request/raise-ticket");
const { superAdminData } = require("../queries/raise-ticket");
require("dotenv").config();


router.get(
  "/active-list",
  [verifyToken, routeAccessChecker("locationActiveList")],
  async (req, res) => {
    try {
      let result = await locationModel.getList();

      for (let index = 0; index < result.length; index++) {
        const element = result[index].unit_id;

        let units = await assetUnitModel.getById(element);

        if (units.length > 0) {
          result[index].unit_name = units[0]?.title || "";
        }
      }

      return res.status(200).send({
        success: true,
        status: 200,
        message: "Location active List.",
        count: result.length,
        data: result,
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        status: 500,
        message: "An error occurred while fetching the location list.",
      });
    }
  }
);

// employee wise ticket list get
router.get(
  "/user-wise-ticket",
  [verifyToken, routeAccessChecker("userWiseTicket")],
  async (req, res) => {
    let id = req.decoded.userInfo.id;
    let {
      key = "",
      priority = "",
      status = "",
      offset = 0,
      limit = 10,
    } = req.query;
    let result = await raiseTicketModel.getAllListUserWise(
      id,
      key,
      priority,
      status,
      offset,
      limit
    );
    let totalResult = await raiseTicketModel.getAllListTotalCountUserWise(
      id,
      key,
      priority,
      status
    );
    return res.status(200).send({
      success: true,
      status: 200,
      message: "User wise ticket List.",
      total: totalResult.length,
      data: result,
    });
  }
);

router.post(
  "/",
  [verifyToken, routeAccessChecker("raiseTicket"), upload.single("attachment"),validateRequest(raiseTicketSchema,"body")],
  async (req, res, next) => {
    try {
      if (req.file) {
        req.body.attachment = path.basename(req.file.path);
      } else {
        req.body.attachment = null;
      }

      let reqData = {
        category_id: parseInt(req.body.category_id),
        priority: req.body.priority,
        subject: req.body.subject,
        cc: parseInt(req.body.cc),
        description: req.body.description,
        attachment: req.body.attachment,
      };

      if (req.body.asset_id) {
        reqData.asset_id = parseInt(req.body.asset_id);
      }

      const my_id = req.decoded.userInfo.id;
      reqData.created_by = my_id;


      let checkEmployee = await userModel.getDataById(my_id);
      if (checkEmployee[0].role_id !== 3) {
       await commonObject.deleteUploadedFile(req.file?.path);
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Your are not employee.",
        });
      }
      // checked this user has seating location or not
      const employeeData = await employeeModel.getById(checkEmployee[0].profile_id)

      if(isEmpty(employeeData[0].seating_location)){
        await commonObject.deleteUploadedFile(req.file?.path);
       return res.status(400).send({
          success: false,
          status: 400,
          message: "Your seating location has not been updated. Please update your current seating location.",
        });
      }
   

    // get unit building location data 
    const getLocationInfo = await seatingLocationModel.getByIdViewData(employeeData[0].seating_location)


      if (reqData.asset_id) {
        let asset = await assetAssignModel.getByIdUserWise(
          reqData.asset_id,
          my_id
        );
        if (!asset) {
          await commonObject.deleteUploadedFile(req.file?.path);
          return res.status(404).send({
            success: false,
            status: 404,
            message: "You are not assign this asset.",
          });
        }
      }

      let category = await ticketCategoryModel.getById(reqData.category_id);
      if (!category.length) {
        await commonObject.deleteUploadedFile(req.file?.path);
        return res.status(404).send({
          success: false,
          status: 404,
          message: "This category not found",
        });
      }

      reqData.ticket_id = common.randomGenerator();
      let user = await userModel.getById(req.decoded.userInfo.id);
      let data = {
        ticket_id: reqData.ticket_id,
        subject: reqData.subject,
        priority:
          reqData.priority.charAt(0).toUpperCase() +
          reqData.priority.slice(1).toLowerCase(),
        unit_name: getLocationInfo[0]?.unit_name || '',
        building_name: getLocationInfo[0]?.building_name || '',
        seating_location_name: getLocationInfo[0]?.seating_location_name || '',
        created_by: user[0].name,
        created_employee_id: user[0].employee_id,
        ticket_message: reqData.description,
      };

      let getUnitAndCategoryMatchEmail =
        await raiseTicketModel.getUnitAndCategoryWiseEmail(
          getLocationInfo[0].seating_location_id,
          reqData.category_id
        );

      let ccData = null;

      if (reqData.cc) {
        const ccId = parseInt(reqData.cc);
        if (!isNaN(ccId)) {
          const ccEmail = await userModel.getById(ccId);
          if (ccEmail.length) {
            ccData = {
              supervisor_name: ccEmail[0]?.name || "",
              supervisor_email: ccEmail[0]?.email || "",
              ticket_id: reqData.ticket_id,
              subject: reqData.subject,
              priority:
                reqData.priority.charAt(0).toUpperCase() +
                reqData.priority.slice(1).toLowerCase(),
              unit_name: getLocationInfo[0]?.unit_name || '',
              building_name: getLocationInfo[0]?.building_name || '',
              seating_location_name: getLocationInfo[0]?.seating_location_name || '',
              created_by: user[0].name,
              created_employee_id: user[0].employee_id,
              ticket_message: reqData.description,
            };
            reqData.cc = ccEmail[0].email;
          } else {
            reqData.cc = null;
          }
        } else {
          reqData.cc = null;
        }
      } else {
        reqData.cc = null;
      }
      reqData.seating_location = employeeData[0].seating_location
      reqData.unit_id = getLocationInfo[0]?.unit_id

      let result = await raiseTicketModel.addNew(reqData);

      //await common.sentTicketEmail('omorkyumaunto16@gmail.com','Raise Create',data)
      if (getUnitAndCategoryMatchEmail.length) {
        // Create a Set to store unique emails
        const uniqueEmails = new Set(
          getUnitAndCategoryMatchEmail.map((item) => item.email)
        );

        // Iterate over unique emails
        for (const admin_email of uniqueEmails) {
          await common.sentTicketEmail(
            admin_email,
            "Ticket Notification",
            data
          );
        }
      }

      if (reqData.cc) {
        await common.sentTicketCcEmail(
          ccData.supervisor_email,
          "Ticket Notification",
          ccData
        );
      }

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
        message: "Raise ticket added Successfully.",
      });
    } catch (error) {
      await commonObject.deleteUploadedFile(req.file?.path);
      next(error);
    }
  },
  multerErrorHandler
);

// admin wise get ticket list
router.get(
  "/admin-ticket-list",
  [verifyToken, routeAccessChecker("adminWiseTicketList")],
  async (req, res) => {
    let id = req.decoded.userInfo.id;
    let {
      key = "",
      priority = "",
      status = "",
      search,
      location_id,
      offset = 0,
      limit = 10,
    } = req.query;
  let totalCountResult
  let result

  if(search === 'solved'){
      result = await raiseTicketModel.getAdminWiseTicket(
        id,
        user_id = id,
        key,
        priority,
        status,
        location_id,
        offset,
        limit
      );

      totalCountResult = await raiseTicketModel.getAdminWiseTicketTotalCount(
        id,
        user_id = id,
        key,
        priority,
        status,
        location_id
      );
  }
  if(search === undefined || search === "undefined" || search === null){
    result = await raiseTicketModel.getAdminWiseTicket(
        id,
        user_id = id,
        key,
        priority,
        status,
        location_id,
        offset,
        limit
    );

      totalCountResult = await raiseTicketModel.getAdminWiseTicketTotalCount(
        id,
        user_id = id,
        key,
        priority,
        status,
        location_id
      );


    if(result.length === 0){
      result = await raiseTicketModel.getAdminWiseUpComingTicket(
        id,
        key,
        priority,
        status,
        location_id,
        offset,
        limit
      );

      totalCountResult = await raiseTicketModel.getAdminWiseTicketUpComingTotalCount(
        id,
        key,
        priority,
        status,
        location_id
      );
    }
  }
  if(search === 'pending'){
        result = await raiseTicketModel.getAdminWiseUpComingTicket(
        id,
        key,
        priority,
        status,
        location_id,
        offset,
        limit
      );

      totalCountResult = await raiseTicketModel.getAdminWiseTicketUpComingTotalCount(
        id,
        key,
        priority,
        status,
        location_id
      );
  }

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Admin wise ticket List.",
      total: totalCountResult.length,
      data: result,
    });
  }
);


// unit super admin ticket 
router.get(
  "/unit-super-admin-ticket",
  [verifyToken, routeAccessChecker("unitSuperAdminWiseTicketList")],
  async (req, res) => {
    let id = req.decoded.userInfo.id;
    let {
      key = "",
      priority = "",
      status = "",
      search,
      location_id,
      offset = 0,
      limit = 10,
    } = req.query;

    const unitAccessId = await unitAccessModel.getById(id)
    const unitIds = []
    for (let index = 0; index < unitAccessId.length; index++) {
        unitIds.push(unitAccessId[index].unit_id);  
    }

let result
let totalCountResult
if(search === 'solved'){
     result = await raiseTicketModel.getUnitSuperAdminTicket(
      key,
      priority,
      status,
      unitIds,
      location_id,
      offset,
      limit
    );
     totalCountResult = await raiseTicketModel.getUnitSuperAdminTicketCount(
      key,
      priority,
      status,
      unitIds,
      location_id,
    );

}else{

     result = await raiseTicketModel.getUnitSuperAdminPendingTicket(
      key,
      priority,
      status,
      unitIds,
      location_id,
      offset,
      limit
    );
     totalCountResult = await raiseTicketModel.getUnitSuperAdminPendingTicketCount(
      key,
      priority,
      status,
      unitIds,
      location_id,
    );


}

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Unit super admin ticket List.",
      total: totalCountResult.length,
      data: result,
    });
  }
);


router.put(
  "/admin-update-status/:id",
  [verifyToken, routeAccessChecker("adminUpdateStatus")],
  async (req, res) => {
    let id = req.params.id;
    let admin_id = req.decoded.userInfo.id;
    let updateData = {};

    let user_id = req.decoded.userInfo.id;
    let reqData = {
      ticket_status: req.body.ticket_status,
    };

    let current_date = new Date();
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format(
      "YYYY-MM-DD HH:mm:ss"
    );

    let existingDataById = await raiseTicketModel.getById(
      id
    );
  
    if (!existingDataById.length) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "No data found",
      });
    }

    let checkIsAlreadySolved = await raiseTicketModel.getById(id);
    if (checkIsAlreadySolved[0].ticket_status === "solved") {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "This ticked already solved.",
      });
    }

    const solvedBy = Number(checkIsAlreadySolved[0].solved_by);
    const updatedBy = Number(checkIsAlreadySolved[0].updated_by);
    const adminId = Number(admin_id);

    if (reqData.ticket_status === "solved") {
      updateData.solved_by = admin_id;
    }

    if (checkIsAlreadySolved[0].ticket_status === "inprogress")
      if (updatedBy && updatedBy !== adminId) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "This ticket is already booked by another admin.",
        });
      }

    // check re raise validation

    if(checkIsAlreadySolved[0].is_re_raise === 1 && checkIsAlreadySolved[0].solved_by !== admin_id){
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Action not allowed. This ticket has already been handled by another admin..",
        });
    }
    
    if (checkIsAlreadySolved[0].ticket_status === "inprogress")
      if (updatedBy && updatedBy !== adminId) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "This ticket is already booked by another admin.",
        });
      }
    let errorMessage = "";
    let isError = 0; // 1 = yes, 0 = no
    let willWeUpdate = 0; // 1 = yes , 0 = no;

    // name
    if (existingDataById[0].ticket_status !== reqData.ticket_status) {
      willWeUpdate = 1;
      updateData.ticket_status = reqData.ticket_status;
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
      updateData.updated_by = admin_id;

      let result = await raiseTicketModel.updateById(id, updateData);

      if (reqData.ticket_status === "solved") {
        const getTicketWiseEmployeeGetById =
          await ticketCommentModel.getAllTicketWiseAdminSingleData(id);

        const adminData = await userModel.getById(
          getTicketWiseEmployeeGetById[0].ticket_solved_employee_user_id
        );

        const options = {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Dhaka",
        };

        const formattedDate = new Intl.DateTimeFormat("en-US", options)
          .format(current_date)
          .replace(",", "")
          .replace(" at ", ", at ");
        const employeeData = {
          employee_name:
            getTicketWiseEmployeeGetById[0].ticket_created_employee_name,
          ticket_id: getTicketWiseEmployeeGetById[0].ticket_id,
          subject: getTicketWiseEmployeeGetById[0].subject,
          resolved_by: adminData[0].name,
          solving_date: formattedDate,
        };

        await common.ticketSolvedEmail(
          getTicketWiseEmployeeGetById[0].ticket_created_employee_email,
          "Your issue is solved.",
          employeeData
        );
      }

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
        message: "Status successfully updated.",
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

// super admin get raise ticket list
router.get(
  "/raise-ticket",
  [verifyToken, routeAccessChecker("allRaiseTicketList")],
  async (req, res) => {
    let {
      key = "",
      priority = "",
      status = "",
      location_id,
      offset = 0,
      limit = 10,
    } = req.query;

    let result = await raiseTicketModel.getSuperAdminTicket(
      key,
      priority,
      status,
      location_id,
      offset,
      limit
    );
    let totalResult = await raiseTicketModel.getSuperAdminTicketTotalCount(
      key,
      priority,
      status,
      location_id
    );
    return res.status(200).send({
      success: true,
      status: 200,
      message: "Super admin raise ticket List.",
      total: totalResult.length,
      data: result,
    });
  }
);

// create ticket employee
router.post(
  "/comment",
  [verifyToken, routeAccessChecker("ticketComment")],
  async (req, res) => {
    let { id, role_id } = req.decoded.userInfo;
    let reqData = {
      ticket_id: parseInt(req.body.ticket_id),
      comment_text: req.body.comment_text,
    };

    let user = await userModel.getById(id);

    let existsRaiseTicket = await raiseTicketModel.getById(reqData.ticket_id);

    if (!existsRaiseTicket) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "This ticket not found.",
      });
    }

    if (user[0].role_id === 3) {
      if (existsRaiseTicket[0].created_by !== id) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "This ticket is created by another employee.",
        });
      }
    }

    if (!reqData.comment_text) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Comment should not be empty.",
      });
    }

    if (user[0].role_id === 3) reqData.employee_id = id;
    if (user[0].role_id === 2 || user[0].role_id === 4) reqData.admin_id = id;

    let result = await ticketCommentModel.addNew(reqData);

    // send email at first all admin
    if (role_id === 3) {
      if (existsRaiseTicket[0].ticket_status === "unsolved") {
        const getTicketWiseAdmin =
          await ticketCommentModel.getAllTicketWiseAdmin(reqData.ticket_id);
        for (let index = 0; index < getTicketWiseAdmin.length; index++) {
          const data = getTicketWiseAdmin[index];

          const employeeToAdminEmailData = {
            employee_name: data.ticket_created_employee_name,
            ticket_id: data.ticket_id,
            subject: data.subject,
            comment: reqData.comment_text,
          };
          await common.ticketCommentEmployeeToAdmin(
            data.email,
            "Notification for new comment",
            employeeToAdminEmailData
          );
        }
      } else if (existsRaiseTicket[0].ticket_status === "inprogress") {
        const getTicketWiseAdminGetById =
          await ticketCommentModel.getAllTicketWiseAdminSingleData(
            reqData.ticket_id
          );
        let admin_email = await userModel.getById(
          existsRaiseTicket[0].updated_by
        );
        const employeeToAdminEmailDataSingle = {
          employee_name:
            getTicketWiseAdminGetById[0].ticket_created_employee_name,
          ticket_id: getTicketWiseAdminGetById[0].ticket_id,
          subject: getTicketWiseAdminGetById[0].subject,
          comment: reqData.comment_text,
        };
        await common.ticketCommentEmployeeToAdmin(
          admin_email[0].email,
          "Notification for new comment",
          employeeToAdminEmailDataSingle
        );
      }
    } else if (role_id === 2 || role_id === 4) {
      const getTicketWiseEmployeeGetById =
        await ticketCommentModel.getAllTicketWiseAdminSingleData(
          reqData.ticket_id
        );
      const employeeData = {
        employee_name:
          getTicketWiseEmployeeGetById[0].ticket_created_employee_name,
        ticket_id: getTicketWiseEmployeeGetById[0].ticket_id,
        subject: getTicketWiseEmployeeGetById[0].subject,
        comment: reqData.comment_text,
      };
      await common.ticketCommentAdminToEmployee(
        getTicketWiseEmployeeGetById[0].ticket_created_employee_email,
        "Notification for new comment",
        employeeData
      );
    }

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
      message: "Ticket comment added Successfully.",
    });
  }
);

// comment details
router.get(
  "/comment-details/:id",
  [verifyToken, routeAccessChecker("ticketDetails")],
  async (req, res) => {
    const id = parseInt(req.params.id);

    let existsRaiseTicket = await raiseTicketModel.getById(id);
    if (!existsRaiseTicket) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "This ticket not found.",
      });
    }
    let result = await ticketCommentModel.getById(id);

    for (let index = 0; index < result.length; index++) {
      const { employee_id, admin_id } = result[index];
      let user;
      if (employee_id) {
        user = await userModel.getById(employee_id);
      } else if (admin_id) {
        user = await userModel.getById(admin_id);
      }
      if (user && user.length > 0) {
        result[index].user_name = user[0].name;
        result[index].employee_id = user[0].employee_id || null;
      }
    }

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Get comment list.",
      count: result.length,
      data: result,
    });
  }
);

router.put(
  "/comment/:id",
  [verifyToken, routeAccessChecker("ticketCommentEdit")],
  async (req, res) => {
    let table_id = parseInt(req.params.id);

    let reqData = {
      comment_text: req.body.comment_text,
    };

    const id = req.decoded.userInfo.id;

    let user = await userModel.getById(id);

    let comment = await ticketCommentModel.getByTableId(table_id);

    if (!comment) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "This ticket comment not found.",
      });
    }

    if (user[0].role_id === 2 || user[0].role_id === 4 ) {
      if (comment[0].admin_id !== id) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Your have not any edit permission.",
        });
      }
    }
    if (user[0].role_id === 3) {
      if (comment[0].employee_id !== id) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Your have not any edit permission.",
        });
      }
    }

    let update_data = {
      is_edit: 1,
      comment_text: reqData.comment_text,
    };

    let result = await ticketCommentModel.updateById(table_id, update_data);

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
      message: "Ticket comment update Successfully.",
    });
  }
);



router.post(
  "/ticket-forward/:id",
  [verifyToken, routeAccessChecker("ticketForwarded"),validateRequest(forwardTicketSchema,'body')],
  async (req, res) => {
    let table_id = parseInt(req.params.id);
    let user_id = req.decoded.userInfo.id;
    const id = req.decoded.userInfo.id;


    let reqData = {
      admin_id : req.body.admin_id,
      category_id: req.body.category_id,
      remarks: req.body.remarks,
    };

    if (!table_id) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Ticket id should not be empty.",
      });
    }

    let ticket = await raiseTicketModel.getById(table_id);
    if (!ticket.length) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "This ticket not found.",
      });
    }

    // let adminTicket = await raiseTicketModel.getAdminWiseTicketById(
    //   id,
    //   table_id
    // );
    // if (!adminTicket.length) {
    //   return res.status(404).send({
    //     success: false,
    //     status: 404,
    //     message: "This ticket not under you.",
    //   });
    // }

    let userInfo = await userModel.getById(reqData.admin_id);
    if (!userInfo.length) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "This admin not found.",
      });
    }

    const getUserLocation = await seatingLocationModel.getByIdView(reqData.admin_id)
    if (!getUserLocation.length) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "This admin under not assign any location.",
      });
    }
    const seating_location = getUserLocation[0].seating_location_id ? getUserLocation[0].seating_location_id : getUserLocation[1].seating_location_id 


    let category = await ticketCategoryModel.getById(reqData.category_id);
    if (!category.length) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "This category not found",
      });
    }


    let user = await userModel.getById(id);

    let forward_data = {
      ticket_id: table_id,
      unit_id: getUserLocation[0].unit_id,
      category_id: reqData.category_id,
      remarks: reqData.remarks,
      details: `The ticket has been forwarded from ${user[0].name} to the Unit: ${getUserLocation[0].unit_name} Building : ${getUserLocation[0].building_name} Seating location and Category: ${category[0].title} and the assigned Admin is:  ${userInfo[0].name}.`,
      created_by: id,
    };

    if (!reqData.subject) {
      reqData.subject = ticket[0]?.subject;
    }

    let ticket_data = {
      unit_id: getUserLocation[0].unit_id,
      seating_location: getUserLocation[0].seating_location_id,
      category_id: reqData.category_id,
      ticket_status: "forward",
      updated_by: user_id,
    };

    const getForwardData = await ticketForwardModel.getById(ticket[0].id)
    if(getForwardData.length){
       await ticketForwardModel.deleteByTicketId(ticket[0].id)
    }
    await Promise.all([
      await ticketForwardModel.addNew(forward_data),
      await raiseTicketModel.updateById(
      table_id,
      ticket_data
    )
    ])


    return res.status(200).send({
      success: true,
      status: 200,
      message: "Ticket Successfully Forwarded.",
    });
  }
);



router.get(
  "/ticket-forword-list",
  [verifyToken, routeAccessChecker("ticketForwardedList")],
  async (req, res) => {
    let { offset = 0, limit = 10 } = req.query;

    let result = await ticketForwardModel.getList(offset, limit);
    return res.status(200).send({
      success: true,
      status: 200,
      message: "Forward ticket list.",
      count: result.length,
      data: result,
    });
  }
);

router.delete(
  "/delete/:id",
  [verifyToken, routeAccessChecker("ticketDelete")],
  async (req, res) => {
    let id = req.params.id;

    let current_date = new Date();
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format(
      "YYYY-MM-DD HH:mm:ss"
    );

    let existingDataById = await raiseTicketModel.getById(id);
    if (!existingDataById.length) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "No data found",
      });
    }

    let data = {
      status: 0,
      updated_at: current_time,
      updated_by: req.decoded.userInfo.id,
    };
    let result = await raiseTicketModel.updateById(id, data);

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
      message: "Ticket successfully deleted.",
    });
  }
);

router.get(
  "/super-admin-ticket-report",
  [verifyToken, routeAccessChecker("superAdminTicketReport")],
  async (req, res) => {
    let {
      key = "",
      priority = "",
      category = "",
      unit = "",
      status = "",
      offset = 0,
      from_date,
      to_date,
      limit = 10,
    } = req.query;

    let result = await raiseTicketModel.getSuperAdminTicketReport(
      key,
      priority,
      category,
      unit,
      status,
      from_date,
      to_date,
      offset,
      limit
    );
    let totalResult =
      await raiseTicketModel.getSuperAdminTicketReportTotalCount(
        key,
        priority,
        category,
        unit,
        status,
        from_date,
        to_date
      );
    return res.status(200).send({
      success: true,
      status: 200,
      message: "Super admin report list.",
      total: totalResult.length,
      data: result,
    });
  }
);

//super admin and admin can  change priority status
router.put(
  "/changePriority/:id",
  [verifyToken, routeAccessChecker("changePriority")],
  async (req, res) => {
    let id = req.params.id;
    let priority = req.body.priority;
    let current_date = new Date();
    let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format(
      "YYYY-MM-DD HH:mm:ss"
    );

    let existingDataById = await raiseTicketModel.getById(id);
    if (isEmpty(existingDataById)) {
      return res.status(404).send({
        success: false,
        status: 404,
        message: "No data found",
      });
    }
    if (existingDataById[0].ticket_status === "solved") {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "This ticket is already solved.",
      });
    }
    if (
      priority !== "high" &&
      priority !== "low" &&
      priority !== "medium" &&
      priority !== "urgent"
    ) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Please select a valid priority type.",
      });
    }
    let result = await raiseTicketModel.updateById(id, {
      priority: priority,
      updated_at: current_time,
      updated_by: req.decoded.userInfo.id,
    });

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
      message: "Priority change successfully..",
    });
  }
);


router.post(
  "/on-behalf-ticket",
  [verifyToken, routeAccessChecker("onBehalfTicket"),upload.single("attachment"),validateRequest(onBehalfTicketSchema,"body")],
  async (req, res, next) => {
    try {
      if (req.file) {
        req.body.attachment = path.basename(req.file.path);
      } else {
        req.body.attachment = null;
      }

      let reqData = {
        category_id: parseInt(req.body.category_id),
        priority: req.body.priority,
        subject: req.body.subject,
        cc: parseInt(req.body.cc),
        description: req.body.description,
        attachment: req.body.attachment,
        user_id : req.body.user_id
      };
       
      if (req.body.asset_id) {
        reqData.asset_id = parseInt(req.body.asset_id);
      }

      const my_id = req.decoded.userInfo.id;

      let checkEmployee = await userModel.getDataById(my_id);
      if (checkEmployee[0].role_id !== 2) {
        await commonObject.deleteUploadedFile(req.file?.path);
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Your are not admin.",
        });
      }

      if (reqData.asset_id) {
        let asset = await assetAssignModel.getByIdUserWise(
          reqData.asset_id,
          my_id
        );
        if (!asset) {
          await commonObject.deleteUploadedFile(req.file?.path);
          return res.status(404).send({
            success: false,
            status: 404,
            message: "You are not assign this asset.",
          });
        }
      }

      let category = await ticketCategoryModel.getById(reqData.category_id);
      if (!category.length) {
        await commonObject.deleteUploadedFile(req.file?.path);
        return res.status(404).send({
          success: false,
          status: 404,
          message: "This category not found",
        });
      }

      reqData.ticket_id = common.randomGenerator();


      let user = await userModel.getById(reqData.user_id);
      let employeeData
      if(user[0].role_id === 3){
     // checked seating location
       employeeData = await employeeModel.getById(user[0].profile_id);
      if(isEmpty(employeeData[0].seating_location)){
        await commonObject.deleteUploadedFile(req.file?.path);
       return res.status(400).send({
          success: false,
          status: 400,
          message: `${user[0].name} seating location has not been updated. Please update ${user[0].name} current seating location.`,
        });
      }
      }
      if(user[0].role_id === 2){
     // checked seating location
       employeeData = await adminModel.getById(user[0].profile_id);
      if(isEmpty(employeeData[0].seating_location)){
        await commonObject.deleteUploadedFile(req.file?.path);
       return res.status(400).send({
          success: false,
          status: 400,
          message: `${user[0].name} seating location has not been updated. Please update ${user[0].name} current seating location.`,
        });
      }
      }
    if(user[0].role_id === 4){
     // checked seating location
       employeeData = await unitSUperAdminModel.getById(user[0].profile_id);
      if(isEmpty(employeeData[0].seating_location)){
        await commonObject.deleteUploadedFile(req.file?.path);
       return res.status(400).send({
          success: false,
          status: 400,
          message: `${user[0].name} seating location has not been updated. Please update ${user[0].name} current seating location.`,
        });
      }
      }
 


   // check this admin had location access wise ticket
    const getAssignLocation = await assignSeatingLocationModel.getById(my_id,employeeData[0].seating_location)
    if(isEmpty(getAssignLocation)){
      return res.status(404).send({
            success: false,
            status: 404,
            message: 'You don’t have permission to raise a ticket for this user due to a location mismatch',
      });
    }

    // get unit building location data 
    const getLocationInfo = await seatingLocationModel.getByIdViewData(employeeData[0].seating_location)

      let data = {
        ticket_id: reqData.ticket_id,
        subject: reqData.subject,
        priority:
          reqData.priority.charAt(0).toUpperCase() +
          reqData.priority.slice(1).toLowerCase(),
        unit_name: getLocationInfo[0]?.unit_name || '',
        building_name: getLocationInfo[0]?.building_name || '',
        seating_location_name: getLocationInfo[0]?.seating_location_name || '',
        created_by: user[0].name,
        created_employee_id: user[0].employee_id,
        ticket_message: reqData.description,
      };

      let getAdminEmail = await userModel.getById(my_id);

      let ccData = null;

      if (reqData.cc) {
        const ccId = parseInt(reqData.cc);
        if (!isNaN(ccId)) {
          const ccEmail = await userModel.getById(ccId);
          if (ccEmail.length) {
            ccData = {
              supervisor_name: ccEmail[0]?.name || "",
              supervisor_email: ccEmail[0]?.email || "",
              ticket_id: reqData.ticket_id,
              subject: reqData.subject,
              priority:
                reqData.priority.charAt(0).toUpperCase() +
                reqData.priority.slice(1).toLowerCase(),
              unit_name: getLocationInfo[0]?.unit_name || '',
              building_name: getLocationInfo[0]?.building_name || '',
              seating_location_name: getLocationInfo[0]?.seating_location_name || '',
              created_by: user[0].name,
              created_employee_id: user[0].employee_id,
              ticket_message: reqData.description,
            };
            reqData.cc = ccEmail[0].email;
          } else {
            reqData.cc = null;
          }
        } else {
          reqData.cc = null;
        }
      } else {
        reqData.cc = null;
      }
      delete reqData.user_id
      reqData.is_on_behalf = 1,
      reqData.on_behalf_created_by = my_id
      reqData.created_by = user[0].id
      reqData.unit_id = getLocationInfo[0]?.unit_id || ''
      reqData.seating_location = getLocationInfo[0]?.seating_location_id || ''

      let result = await raiseTicketModel.addNew(reqData);

      // send ticket raise email
      await common.sentTicketEmail(
        getAdminEmail[0].email,
        "Ticket Notification",
        data
      );

      const ticketEmployeeData = {
        employee_name : user[0].name,
        ticket_id : reqData.ticket_id,
        subject : reqData.subject,
        priority : reqData.priority,
        created_by : getAdminEmail[0].name,
        employee_id : user[0].employee_id,
        unit_name: getLocationInfo[0]?.unit_name || '',
        building_name: getLocationInfo[0]?.building_name || '',
        seating_location_name: getLocationInfo[0]?.seating_location_name || '',
      }
      // send email employee
      await common.sentTicketOnBehalfEmail(
        user[0].email,
        "On Behalf Ticket Notification",
        ticketEmployeeData
      );

      if (reqData.cc) {
        await common.sentTicketCcEmail(
          ccData.supervisor_email,
          "Ticket Notification",
          ccData
        );
      }

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
        message: "On-behalf ticket raise Successfully.",
      });
    } catch (error) {
      await commonObject.deleteUploadedFile(req.file?.path);
      next(error);
    }
  }
);


router.put(
  "/ticket-re-raise/:id",
  [verifyToken, routeAccessChecker("ticketReraise"),validateRequest(reRaiseTicketCommentSchema, 'body')],
  async (req, res, next) => {
    try {

      let id = parseInt(req.params.id);
      let self_id = req.decoded.userInfo.id
      let comment = req.body.comment
  
      let existingDataById = await raiseTicketModel.getById(id);
      if (!existingDataById.length) {
        return res.status(404).send({
          success: false,
          status: 404,
          message: "No data found",
        });
      }

      if (existingDataById[0].created_by !== self_id) {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "This ticket is not created you",
        });
      }
     if (existingDataById[0].ticket_status !== 'solved') {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "This ticket are not solved.",
        });
      }
  
      let user = await userModel.getById(self_id);

      let employeeData = await employeeModel.getById(user[0].profile_id);
      if(isEmpty(employeeData[0].seating_location)){
       return res.status(400).send({
          success: false,
          status: 400,
          message: `Your seating location has not been updated. Please update your current seating location.`,
        });
      }
     // get unit building location data 
     const getLocationInfo = await seatingLocationModel.getByIdViewData(employeeData[0].seating_location)
     
      let data = {
        ticket_id: existingDataById[0].ticket_id,
        subject: existingDataById[0].subject,
        priority: 
        existingDataById[0].priority.charAt(0).toUpperCase() +
        existingDataById[0].priority.slice(1).toLowerCase(),
        unit_name: getLocationInfo[0]?.unit_name || '',
        building_name: getLocationInfo[0]?.building_name || '',
        seating_location_name: getLocationInfo[0]?.seating_location_name || '',
        created_by: user[0]?.name ||'',
        created_employee_id: user[0]?.employee_id || '',
        ticket_message: existingDataById[0]?.description || '',
      };

      let updateData = {
        status : 2,
      }

      let re_create_data = {
        unit_id : existingDataById[0]?.unit_id || '', 
        category_id : existingDataById[0]?.category_id || '', 
        asset_id : existingDataById[0]?.asset_id || null,
        ticket_id : existingDataById[0]?.ticket_id || '',
        priority : existingDataById[0]?.priority || '',
        subject : existingDataById[0]?.subject || '',
        cc : existingDataById[0]?.cc || '',
        description : existingDataById[0]?.description || '',
        attachment : existingDataById[0]?.attachment || '',
        ticket_status : 'unsolved',
        solved_by : existingDataById[0]?.solved_by || '',
        is_on_behalf : existingDataById[0]?.is_on_behalf || null,
        on_behalf_created_by : existingDataById[0]?.on_behalf_created_by || null,
        is_re_raise : 1,
        re_raise_count :  existingDataById[0]?.re_raise_count + 1 || 0,
        seating_location : existingDataById[0]?.seating_location || '',
        created_by :  existingDataById[0]?.created_by,
        updated_by :  existingDataById[0]?.updated_by,
        solved_by :  existingDataById[0]?.solved_by,
      } 
     
        let [_, result] = await Promise.all([
          raiseTicketModel.updateById(id, updateData),
          raiseTicketModel.addNew(re_create_data)
        ]);

        const getCommentData = await ticketCommentModel.getById(id)

        if(getCommentData.length){
           await ticketCommentModel.updateByTicketId(id,{ticket_id:result.insertId})
        }

       
        await ticketCommentModel.addNew({
          ticket_id: result.insertId,
          employee_id: self_id,
          comment_text: comment
        });


     const solvedTicketEmail = await userModel.getById(re_create_data.solved_by);
      await common.sentTicketEmail(
          solvedTicketEmail[0]?.email || '',
          "Ticket Notification",
          data
      );
        
            let ccData = null;

      if (re_create_data.cc) {
          const ccEmail = await userModel.getById(re_create_data.cc);
          if (ccEmail.length) {
            ccData = {
              supervisor_name: ccEmail[0]?.name || "",
              supervisor_email: ccEmail[0]?.email || "",
              ticket_id: re_create_data.ticket_id,
              subject: re_create_data.subject,
              priority:
                re_create_data.priority.charAt(0).toUpperCase() +
                re_create_data.priority.slice(1).toLowerCase(),
              unit_name: getLocationInfo[0]?.unit_name || '',
              building_name: getLocationInfo[0]?.building_name || '',
              seating_location_name: getLocationInfo[0]?.seating_location_name || '',
              created_by: user[0].name,
              created_employee_id: user[0].employee_id,
              ticket_message: re_create_data.description,
            };
            re_create_data.cc = ccEmail[0].email;
          } else {
            re_create_data.cc = null;
          }

      } else {
        re_create_data.cc = null;
      }

      if (re_create_data.cc) {
        await common.sentTicketCcEmail(
          re_create_data.ccData,
          "Ticket Notification",
          ccData
        );
      }

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
        message: "Ticket Re-Raise successfully completed.",
      });
    } catch (error) {
      next(error);
    }
  }
);



// admin wise get archive ticket list
router.get(
  "/admin-archive-ticket",
  [verifyToken, routeAccessChecker("adminWiseArchiveTicketList")],
  async (req, res) => {
    let id = req.decoded.userInfo.id;
    let {
      key = "",
      priority = "",
      status = "",
      search,
      location_id,
      offset = 0,
      limit = 10,
    } = req.query;
  let totalCountResult
  let result

  if(search === undefined || search === "undefined" || search === null){
    result = await raiseTicketModel.getAdminWiseArchiveTicket(
        id,
        user_id = id,
        key,
        priority,
        status,
        location_id,
        offset,
        limit
    );

      totalCountResult = await raiseTicketModel.getAdminWiseArchiveTicketTotalCount(
        id,
        user_id = id,
        key,
        priority,
        status,
        location_id
      );


    if(result.length === 0){
      result = await raiseTicketModel.getAdminWiseUpComingTicket(
        id,
        key,
        priority,
        status,
        location_id,
        offset,
        limit
      );

      totalCountResult = await raiseTicketModel.getAdminWiseTicketUpComingTotalCount(
        id,
        key,
        priority,
        status,
        location_id
      );
    }
  }

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Admin wise archive ticket List.",
      total: totalCountResult.length,
      data: result,
    });
  }
);

// employee archive list
router.get(
  "/user-wise-archive-ticket",
  [verifyToken, routeAccessChecker("userWiseArchiveTicket")],
  async (req, res) => {
    let id = req.decoded.userInfo.id;
    let {
      key = "",
      priority = "",
      status = "",
      offset = 0,
      limit = 10,
    } = req.query;
    let result = await raiseTicketModel.getAllListUserWiseArchive(
      id,
      key,
      priority,
      status,
      offset,
      limit
    );
    let totalResult = await raiseTicketModel.getAllListTotalCountUserWiseArchive(
      id,
      key,
      priority,
      status
    );
    return res.status(200).send({
      success: true,
      status: 200,
      message: "User wise ticket List.",
      total: totalResult.length,
      data: result,
    });
  }
);

// unit super admin archive ticket 
router.get(
  "/unit-super-admin-archive-ticket",
  [verifyToken, routeAccessChecker("unitSuperAdminWiseArchiveTicketList")],
  async (req, res) => {
    let id = req.decoded.userInfo.id;
    let {
      key = "",
      priority = "",
      status = "",
      location_id,
      offset = 0,
      limit = 10,
    } = req.query;

    const unitAccessId = await unitAccessModel.getById(id)
    const unitIds = []
    for (let index = 0; index < unitAccessId.length; index++) {
        unitIds.push(unitAccessId[index].unit_id);  
    }

let result
let totalCountResult
     result = await raiseTicketModel.getUnitSuperAdminArchiveTicket(
      key,
      priority,
      status,
      unitIds,
      location_id,
      offset,
      limit
    );
     totalCountResult = await raiseTicketModel.getUnitSuperAdminArchiveTicketCount(
      key,
      priority,
      status,
      unitIds,
      location_id,
    );


    return res.status(200).send({
      success: true,
      status: 200,
      message: "Unit super admin ticket List.",
      total: totalCountResult.length,
      data: result,
    });
  }
);

module.exports = router;
