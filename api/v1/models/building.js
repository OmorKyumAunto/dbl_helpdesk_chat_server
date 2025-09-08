const { connectionDblystem } = require('../connections/connection');
const queries = require('../queries/building');



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

let getByTitle = async (unit_id = 0,name = "") => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getByTitle(), [unit_id,name], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getByName = async (name = "") => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getByName(), [name], (error, result, fields) => {
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

let getByUserId = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getByUnitWiseId = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getByUnitWiseId(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getByUnitWiseMultiId = async (id = []) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getByUnitWiseMultiId(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}



let getActiveList = async (limit,offset,unit_id,key) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getActiveList(limit,offset,unit_id,key),(error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getActiveListCount = async (unit_id,key) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getActiveListCount(unit_id,key),(error, result, fields) => {
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

let getList = async (limit,offset,unit_id,status,key) => {
    return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.getList(limit,offset,unit_id,status,key), (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }


  let getListCount = async (unit_id,status,key) => {
    return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.getListCount(unit_id,status,key), (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }
  

  let getTotalList = async (key, unit) => {
    return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.getTotalList(key, unit), (error, result, fields) => {
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

let getDataByUnitId = async (unit_ids = []) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getDataByUnitId(), [unit_ids], (error, result, fields) => {
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
    getList,
    getByIdForDeleted,
    getById,
    getByProfileId,
    getByEmployeeId,
    getByTitle,
    getActiveList,
    getListCount,
    getActiveListCount,
    getByName,
    getDataByUnitId,
    getByUnitWiseId,
    getByUserId,
    getByUnitWiseMultiId
}