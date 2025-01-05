const { connectionDblystem } = require('../connections/connection');
const queries = require('../queries/raise-ticket');

// Promises Method
let getList = async (status) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getList(status), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getOnlyDataList = async () => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getOnlyDataList(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getAllList = async (status) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getAllList(status), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getAllListUserWise = async (id = 0,key,priority,status,offset,limit) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getAllListUserWise(id,key,priority,status,offset,limit), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getAllListTotalCountUserWise = async (id = 0,key,priority,status) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getAllListTotalCountUserWise(id,key,priority,status), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getAdminWiseTicket = async (user_id = 0,key,priority,status,offset,limit) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getAdminWiseTicket(key,priority,status,offset,limit),[user_id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getAdminWiseTicketTotalCount = async (user_id = 0,key,priority,status) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getAdminWiseTicketTotalCount(key,priority,status),[user_id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getAdminWiseTicketById = async (user_id = 0,ticket_id = 0) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getAdminWiseTicketById(),[user_id,ticket_id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getSuperAdminTicket = async (key,priority,status, offset , limit)=>{
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getSuperAdminTicket(key,priority,status, offset , limit), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getSuperAdminTicketTotalCount = async (key,priority,status)=>{
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getSuperAdminTicketTotalCount(key,priority,status), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getAllListAdminWise = async (id = 0,key,priority,status) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getAllListAdminWise(id,key,priority,status), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getAllLocationDataByUnitId = async (unit_id) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getAllLocationDataByUnitId(),[unit_id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getUnitAndCategoryWiseEmail = async (asset_unit_id,ticket_category_id) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getUnitAndCategoryWiseEmail(),[asset_unit_id,ticket_category_id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}





let getLocation = async (unit_id = 0,location = '') => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getLocation(), [unit_id,location], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getActiveList = async () => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getActiveList(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getByTitle = async (title = "") => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getByTitle(), [title], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let employeeWiseTicket = async (id = 0, user_id = 0) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.employeeWiseTicket(), [id,user_id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let adminWiseTicketDetails = async (user_id = 0,ticket_id = 0) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.adminWiseTicketDetails(), [user_id,ticket_id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getUnitWiseLocation = async (unit_id = 0,location = '') => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getUnitWiseLocation(), [unit_id,location], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getByNonDeleteData = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getByNonDeleteData(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let addNew = async (info) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.addNew(), [info], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}
let updateById = async (id = 0, data = {}) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.updateById(), [data, id], (error, result, fields) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}



// ticket dashboard data
let getTicketDataCounting = async () => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.ticketCountingData(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getTicketTotalSolved = async () => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getTicketTotalSolved(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getTicketTotalUnsolved = async () => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getTicketTotalUnsolved(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getTicketTotalForward = async () => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getTicketTotalForward(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getTicketTotalInprogress = async () => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getTicketTotalInprogress(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getAdminTicketDataCounting = async (user_id) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.ticketAdminCountingData(),[user_id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getAdminTicketTotalSolved = async (user_id) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getAdminTicketTotalSolved(),[user_id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getAdminTicketTotalUnsolved = async (user_id) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getAdminTicketTotalUnsolved(),[user_id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getAdminTicketTotalForward = async (user_id) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getAdminTicketTotalForward(), [user_id],(error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getAdminTicketTotalInprogress = async (user_id) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getAdminTicketTotalInprogress(),[user_id],(error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}




let getTopSolvedTicketList = async () => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getTopSolvedTicketList(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let priorityBaseTicketList = async () => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.priorityBaseTicketList(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let priorityBaseTicketListForAdmin = async (user_id) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.priorityBaseTicketListForAdmin(),[user_id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}



let categoryBaseTicketList = async () => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.categoryBaseTicketList(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let categoryBaseTicketListAdmin = async (user_id) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.categoryBaseTicketListAdmin(),[user_id],(error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let monthWiseTicketCount = async () => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.monthWiseTicketCount(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let monthWiseTicketCountAdmin = async (user_id) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.monthWiseTicketCountAdmin(),[user_id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}



let graphTicketTotalData = async () => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.graphTicketTotalData(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let graphTicketTotalDataAdmin = async (user_id) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.graphTicketTotalDataAdmin(),[user_id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let graphTicketTotalSolveDataAdmin = async (user_id) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.graphTicketTotalSolveDataAdmin(),[user_id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let graphTicketTotalUnSolveDataAdmin = async (user_id) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.graphTicketTotalUnSolveDataAdmin(),[user_id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}



let graphTicketTotalSolveData = async () => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.graphTicketTotalSolveData(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let graphTicketTotalUnSolveData = async () => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.graphTicketTotalUnSolveData(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}



let existsUnitHasAssign = async (unit_id = 0) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.existsUnitHasAssign(),[unit_id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let existsCategoryHasAssign = async (category_id = 0) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.existsCategoryHasAssign(),[category_id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getSuperAdminTicketReport = async (key,priority,category,unit,status, form_date,to_date,offset,limit)=>{
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getSuperAdminTicketReport(key,priority,category,unit,status, form_date,to_date,offset,limit), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getSuperAdminTicketReportTotalCount = async (key,priority,category,unit,status,form_date,to_date)=>{
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getSuperAdminTicketReportTotalCount(key,priority,category,unit,status,form_date,to_date), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


module.exports = {
    getList,
    getActiveList,
    getById,
    addNew,
    updateById,

    getLocation,
    getAllList,
    getByNonDeleteData,
    getAllLocationDataByUnitId,
    getUnitWiseLocation,
    getOnlyDataList,
    getAllListUserWise,
    getAllListAdminWise,
    getAdminWiseTicket,
    adminWiseTicketDetails,
    getSuperAdminTicket,
    getUnitAndCategoryWiseEmail,
    employeeWiseTicket,
    getAdminWiseTicketById,
    getSuperAdminTicketTotalCount,
    getAllListTotalCountUserWise,
    getAdminWiseTicketTotalCount,
    getTicketDataCounting,
    getTicketTotalSolved,
    getTicketTotalUnsolved,
    getTicketTotalForward,
    getTicketTotalInprogress,
    getTopSolvedTicketList,
    priorityBaseTicketList,
    categoryBaseTicketList,
    monthWiseTicketCount,
    graphTicketTotalData,
    graphTicketTotalSolveData,
    existsUnitHasAssign,
    existsCategoryHasAssign,
    getSuperAdminTicketReport,
    getSuperAdminTicketReportTotalCount,
    getAdminTicketDataCounting,
    getAdminTicketTotalSolved,
    getAdminTicketTotalUnsolved,
    getAdminTicketTotalForward,
    getAdminTicketTotalInprogress,
    categoryBaseTicketListAdmin,
    priorityBaseTicketListForAdmin,
    priorityBaseTicketListForAdmin,
    monthWiseTicketCountAdmin,
    graphTicketTotalDataAdmin,
    graphTicketTotalSolveDataAdmin,
    graphTicketTotalUnSolveData,
    graphTicketTotalUnSolveDataAdmin
}


