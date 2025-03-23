const express = require("express");
const router = express.Router();
const taskModel = require("../models/task");

const verifyToken = require("../middlewares/verifyToken");
const { routeAccessChecker } = require("../middlewares/routeAccess");

const common = require("../common/common");
require("dotenv").config();

// task dashboard count data
router.get(
  "/count-data",
  [verifyToken, routeAccessChecker("taskDashboardCountData")],
  async (req, res) => {
    const { id, role_id } = req.decoded.userInfo;

    let data

    if (role_id === 1) {
      data = await taskModel.taskDashboardCountData();
    } else {
      data = await taskModel.taskDashboardCountDataById(id);
    }

    const countingData = {
      total_task: data[0]?.total_task_count || 0,
      total_task_incomplete: data[0]?.total_task_incomplete || 0,
      total_task_complete: data[0]?.total_task_complete || 0,
      total_task_inprogress: data[0]?.total_task_inprogress || 0,
      avg_task_completion_time_seconds : data[0]?.avg_task_completion_time_seconds || 0,
      
    };

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Task dashboard count data retrieved successfully.",
      data: countingData,
    });
  }
);


// list wise data
router.get(
  "/category-base-ticket",
  [verifyToken, routeAccessChecker("priorityBaseTicket")],
  async (req, res) => {
    const { id, role_id } = req.decoded.userInfo;
    let data;
    if (role_id === 1) {
      data = await raiseTicketModel.priorityBaseTicketList();
    } else {
      data = await raiseTicketModel.priorityBaseTicketListForAdmin(id);
    }
    // Calculate total ticket count
    let totalTickets = data.reduce((sum, item) => sum + item.ticket_count, 0);

    // Calculate percentage for each category
    let result = data.map((item) => ({
      category_id: item.category_id,
      category_title: item.category_title,
      ticket_count: item.ticket_count,
      percentage:
        totalTickets > 0
          ? ((item.ticket_count / totalTickets) * 100).toFixed(0)
          : "0",
    }));

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Category base ticket data count.",
      data: result,
    });
  }
);

router.get(
  "/priority-base-ticket",
  [verifyToken, routeAccessChecker("categoryWisePriorityCount")],
  async (req, res) => {
    const { id, role_id } = req.decoded.userInfo;
    let data;

    if (role_id === 1) {
      data = await raiseTicketModel.categoryBaseTicketList();
    } else {
      data = await raiseTicketModel.categoryBaseTicketListAdmin(id);
    }

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Priority base ticket data count.",
      data: data[0],
    });
  }
);

router.get(
  "/task-percentage",
  [verifyToken, routeAccessChecker("taskPercentageData")],
  async (req, res) => {
    try {
      const { id, role_id } = req.decoded.userInfo;
      let data;

      if (role_id === 1) {
        data = await taskModel.taskSuperAdminDashboardPercentageData();
      } else {
        data = await taskModel.taskAdminDashboardPercentageData(id);
      }

      // Extract counts
      let totalTask = data[0]?.total_task_count || 0;
      let totalTaskComplete = data[0]?.total_task_complete || 0;
      let totalTaskIncomplete = data[0]?.total_task_incomplete || 0;

      // Calculate percentages
      let totalAssetPercent = 100;
      let totalSolvedPercent = totalTask > 0 ? Math.round((totalTaskComplete / totalTask) * 100) : 0;
      let totalUnSolvedPercent = totalAssetPercent - totalSolvedPercent;

      return res.status(200).json({
        success: true,
        status: 200,
        message: "Task create and complete percentage data retrieved successfully.",
        data: {
          total_task: totalTask,
          total_task_percent: totalAssetPercent,
          total_complete: totalTaskComplete,
          total_complete_percent: totalSolvedPercent,
          total_incomplete: totalTaskIncomplete, 
          total_incomplete_percent: totalUnSolvedPercent,
        },
      });
    } catch (error) {
      console.error("Error in /task-percentage:", error);
      return res.status(500).json({
        success: false,
        status: 500,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
);


router.get(
  "/ticket-dashboard-data",
  [verifyToken, routeAccessChecker("ticketDashboardGraphData")],
  async (req, res) => {
    try {
      const { id, role_id } = req.decoded.userInfo;

      let resultAssign;
      let resultTotal;
      let resultTotalUnsolved;
      if (role_id === 1) {
        resultAssign = await raiseTicketModel.graphTicketTotalData();
        resultTotal = await raiseTicketModel.graphTicketTotalSolveData();
        resultTotalUnsolved =
          await raiseTicketModel.graphTicketTotalUnSolveData();
      } else {
        resultAssign = await raiseTicketModel.graphTicketTotalDataAdmin(id);

        resultTotal = await raiseTicketModel.graphTicketTotalSolveDataAdmin(id);
        resultTotalUnsolved =
          await raiseTicketModel.graphTicketTotalUnSolveDataAdmin(id);
      }

      // Month names mapping
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      // Initialize an array with all months set to 0
      let data = [];
      const currentMonth = new Date().getMonth() + 1;
      for (let i = 0; i < 12; i++) {
        const month = (currentMonth - i + 12) % 12 || 12;
        data.push({
          month: month.toString(),
          name: monthNames[month - 1], // Add month name
          raiseTickets: 0,
          solvedTickets: 0,
          unsolvedTickets: 0,
        });
      }

      // Populate the array with total_assign_asset data
      resultAssign.forEach((item) => {
        const monthIndex = data.findIndex(
          (d) => d.month === item.month.toString()
        );
        if (monthIndex !== -1) {
          data[monthIndex].raiseTickets = item.raiseTickets;
        }
      });

      // Populate the array with total_asset data
      resultTotal.forEach((item) => {
        const monthIndex = data.findIndex(
          (d) => d.month === item.month.toString()
        );
        if (monthIndex !== -1) {
          data[monthIndex].solvedTickets = item.solvedTickets;
        }
      });

      resultTotalUnsolved.forEach((item) => {
        const monthIndex = data.findIndex(
          (d) => d.month === item.month.toString()
        );
        if (monthIndex !== -1) {
          data[monthIndex].unsolvedTickets = item.unsolvedTickets;
        }
      });

      return res.status(200).send({
        success: true,
        status: 200,
        message: "Ticket dashboard data.",
        data: data.reverse(),
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        status: 500,
        message: "An error occurred while fetching dashboard graph data.",
        error: error.message,
      });
    }
  }
);

module.exports = router;
