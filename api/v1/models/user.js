const { connectionDblystem } = require('../connections/connection');
const queries = require('../queries/user');



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

let getUserById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getUserById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getUserByEmployeeId = async (employee_id = 0) => {

    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getUserByEmployeeId(), [employee_id], (error, result, fields) => {
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

let getDataById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getDataById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getDataByAssetId = async (id = 0) => {
  return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.getDataByAssetId(), [id], (error, result, fields) => {
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




let updateByEmployeeUser = async (id = 0, data = {}) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.updateByEmployeeUser(), [data, id], (error, result, fields) => {
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


let getEmployeeList = async (offset, limit, key,unit_name) => {
    return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.getEmployeeList(offset, limit, key,unit_name), (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  let getTotalEmployeeList = async (key, unit) => {
    return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.getTotalEmployeeList(key, unit), (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }



  let getEmployeeAdminList = async (offset, limit, key,unit) => {
    return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.getEmployeeAdminList(offset, limit, key,unit), (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }


  let getTotalEmployeeAdminList = async (key, unit) => {
    return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.getTotalEmployeeAdminList(key, unit), (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }




let getList = async () => {
    return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.getList(), (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }


  let getActiveList = async () => {
    return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.getActiveList(), (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }
  

module.exports = {
    getUserByEmail,
    addNew,
    getUserInfo,
    getUserById,
    getUserByEmployeeId,
    updateByEmployeeUser,
    updateById,
    getById,
    getByEmployeeId,
    getEmployeeList,
    getTotalEmployeeList,
    getList,
    getActiveList,
    getDataById,
    getEmployeeAdminList,
    getTotalEmployeeAdminList,
    getDataByAssetId
}