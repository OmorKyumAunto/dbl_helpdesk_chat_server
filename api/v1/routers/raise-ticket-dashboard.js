const express = require("express");
const router = express.Router();
const unitAccessModel = require("../models/unit-access");
const raiseTicketModel = require("../models/raise-ticket");
const verifyToken = require("../middlewares/verifyToken");
const { routeAccessChecker } = require("../middlewares/routeAccess");

require("dotenv").config();

// ticket dashboard count data
// router.get(
//   "/count-data",
//   [verifyToken, routeAccessChecker("TicketDashboardCountData")],
//   async (req, res) => {
//     const { id, role_id } = req.decoded.userInfo;

//     let total_ticket;
//     let total_solved;
//     let total_unsolved;
//     let total_forward;
//     let total_inprogress;
//     let total_avg_time;

//     if (role_id === 1) {
//       total_ticket = await raiseTicketModel.getTicketDataCounting();
//       total_solved = await raiseTicketModel.getTicketTotalSolved();
//       total_unsolved = await raiseTicketModel.getTicketTotalUnsolved();
//       total_forward = await raiseTicketModel.getTicketTotalForward();
//       total_inprogress = await raiseTicketModel.getTicketTotalInprogress();
//       total_avg_time = await raiseTicketModel.getTicketTotalAvgTime();
//     } else {
//       total_ticket = await raiseTicketModel.getAdminTicketDataCounting(id);
//       total_solved = await raiseTicketModel.getAdminTicketTotalSolved(id);
//       total_unsolved = await raiseTicketModel.getAdminTicketTotalUnsolved(id);
//       total_forward = await raiseTicketModel.getAdminTicketTotalForward(id);
//       total_inprogress = await raiseTicketModel.getAdminTicketTotalInprogress(
//         id
//       );
//       total_avg_time = await raiseTicketModel.getTicketAdminTotalAvgTime(id);
//       // total_avg_time = 0;
//     }
//     const data = {
//       total_ticket: total_ticket[0]?.total_ticket || 0,
//       total_solve: total_solved[0]?.total_solved || 0,
//       total_unsolved: total_unsolved[0]?.total_unsolved || 0,
//       total_forward: total_forward[0]?.total_forward || 0,
//       total_inprogress: total_inprogress[0]?.total_inprogress || 0,
//       total_avg_time: total_avg_time[0]?.avg_ticket_solve_time || 0,
//     };

//     return res.status(200).send({
//       success: true,
//       status: 200,
//       message: "Ticket data retrieved successfully.",
//       data: data,
//     });
//   }
// );

// ticket dashboard count data
router.get(
  "/count-data",
  [verifyToken, routeAccessChecker("TicketDashboardCountData")],
  async (req, res) => {
    const { id, role_id } = req.decoded.userInfo;

    let total_ticket;
    let total_solved;
    let total_unsolved;
    let total_forward;
    let total_inprogress;
    let total_avg_time;

    if (role_id === 1) {
      console.log(" super admin");
      total_ticket = await raiseTicketModel.getTicketDataCounting();
      total_solved = await raiseTicketModel.getTicketTotalSolved();
      total_unsolved = await raiseTicketModel.getTicketTotalUnsolved();
      total_forward = await raiseTicketModel.getTicketTotalForward();
      total_inprogress = await raiseTicketModel.getTicketTotalInprogress();
      total_avg_time = await raiseTicketModel.getTicketTotalAvgTime();
    }
    if (role_id === 4) {
console.log("Unit super admin");
      const getUnit = await unitAccessModel.getById(id)
      const unitIds = getUnit.map(u => u.unit_id); 
console.log("unitidss ==",unitIds);
      let data = await raiseTicketModel.getUnitWiseSuperAdminCount(unitIds);
      console.log("data ==>",data[0]);
      total_ticket =[{ total_ticket: data[0].total_ticket }]; 
      total_solved = [{ total_solved: data[0].total_solved }];
      total_unsolved = [{ total_unsolved: data[0].total_unsolved }];
      total_forward = [{ total_forward: data[0].total_forward }];
      total_inprogress = [{ total_inprogress: data[0].total_inprogress }];
      total_avg_time = [{ total_avg_time: data[0].total_avg_time }];
    }
    else {
      console.log("  admin");

      total_ticket = await raiseTicketModel.getAdminTicketDataCounting(id);
      total_solved = await raiseTicketModel.getAdminTicketTotalSolved(id);
      total_unsolved = await raiseTicketModel.getAdminTicketTotalUnsolved(id);
      total_forward = await raiseTicketModel.getAdminTicketTotalForward(id);
      total_inprogress = await raiseTicketModel.getAdminTicketTotalInprogress(
        id
      );
      total_avg_time = await raiseTicketModel.getTicketAdminTotalAvgTime(id);
    }
    const data = {
      total_ticket: total_ticket[0]?.total_ticket || 0,
      total_solve: total_solved[0]?.total_solved || 0,
      total_unsolved: total_unsolved[0]?.total_unsolved || 0,
      total_forward: total_forward[0]?.total_forward || 0,
      total_inprogress: total_inprogress[0]?.total_inprogress || 0,
      total_avg_time: total_avg_time[0]?.total_avg_time || 0,
    };

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Ticket data retrieved successfully.",
      data: data,
    });
  }
);


router.get(
  "/top-solve-ticket",
  [verifyToken, routeAccessChecker("topSolvedTicketData")],
  async (req, res) => {
    let data = await raiseTicketModel.getTopSolvedTicketList();
    return res.status(200).send({
      success: true,
      status: 200,
      message: "Top ticket solve list.",
      data: data,
    });
  }
);

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
  "/raise-solve-ticket",
  [verifyToken, routeAccessChecker("raiseSolveTicketMOnthlyCount")],
  async (req, res) => {
    const { id, role_id } = req.decoded.userInfo;
    let data;
    if (role_id === 1) {
      data = await raiseTicketModel.monthWiseTicketCount();
    } else {
      data = await raiseTicketModel.monthWiseTicketCountAdmin(id);
    }

    // Extract counts
    let totalTicket = data[0]?.total_ticket || 0;
    let totalSolved = data[0]?.total_solved || 0;
    let totalUnSolved = data[0]?.total_unsolved || 0;

    // Calculate percentages
    let totalAssetPercent = 100;
    let totalSolvedPercent = (totalSolved / totalTicket) * 100 || 0;
    totalSolvedPercent = Math.round(totalSolvedPercent);
    let totalUnSolvedPercent = totalAssetPercent - totalSolvedPercent;

    return res.status(200).send({
      success: true,
      status: 200,
      message: "Monthly wise raise and solve ticket.",
      data: {
        total_ticket: totalTicket,
        total_ticket_percent: totalAssetPercent,
        total_solved: totalSolved,
        total_solved_percent: totalSolvedPercent,
        total_unsolved: totalUnSolved,
        total_unsolved_percent: totalUnSolvedPercent,
      },
    });
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
