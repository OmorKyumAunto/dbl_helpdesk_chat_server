const { connectionDblystem } = require('../connections/connection');
const queries = require('../queries/login');



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

let getList = async (offset, limit, key,unit,type) => {
    return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.getList(offset, limit, key,unit), (error, result, fields) => {
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
    getByEmployeeId
}