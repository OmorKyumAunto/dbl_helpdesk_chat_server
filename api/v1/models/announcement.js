const { connectionDblystem } = require('../connections/connection');
const queries = require('../queries/announcement');



let getUserByEmail = async (email = "") => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getUserByEmail(), [email], (error, result, fields) => {
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


let getUserInfo = async (email = "",password="") => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getUserInfo(), [email,password], (error, result, fields) => {
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

let getByEmployeeId = async (employee_id = 0) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getByEmployeeId(), [employee_id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getByProfileId = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getByProfileId(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getListMobileForSuperAdmin = async (offset, limit) => {
    return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.getListMobileForSuperAdmin(offset, limit), (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }
  
let getListMobileForSuperAdminCount = async () => {
    return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.getListMobileForSuperAdminCount(), (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }
  

let getListMobileForAdmin = async (offset, limit,unitIds=[]) => {
    return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.getListMobileForAdmin(offset, limit),[unitIds], (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

let getListMobileForAdminCount = async (unitIds=[]) => {
    return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.getListMobileForAdminCount(),[unitIds], (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }
  
let getListMobileForEmployee = async (offset, limit,unitId=0) => {
    return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.getListMobileForEmployee(offset, limit),[unitId], (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

let getListMobileForEmployeeCount = async (unitId=0) => {
    return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.getListMobileForEmployeeCount(),[unitId], (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
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

let getByIdForDeleted = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getByIdForDeleted(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}



module.exports = {
    getUserByEmail,
    addNew,
    getUserInfo,
    getById,
    updateById,
    getListMobileForSuperAdmin,
    getByIdForDeleted,
    getById,
    getByProfileId,
    getByEmployeeId,
    getListMobileForSuperAdminCount,
    getListMobileForAdmin,
    getListMobileForAdminCount,
    getListMobileForEmployee,
    getListMobileForEmployeeCount
}