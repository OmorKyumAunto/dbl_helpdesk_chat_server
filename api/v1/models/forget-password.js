const { connectionDblystem } = require('../connections/connection');
const queries = require('../queries/forget-password');

// Promises Method
let getList = async (unit ,key,offset,limit) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getList(unit,key,offset,limit), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getListTotalCount = async (unit,key) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getListTotalCount(unit,key), (error, result, fields) => {
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

let getAllList = async (unit, key,offset,limit) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getAllList(unit, key,offset,limit), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getAllLocationDataByUnitId = async (unit, key,) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getAllLocationDataByUnitId(unit, key),(error, result, fields) => {
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

let getRecentOtp = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.getRecentOtp(), [id], (error, result, fields) => {
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
    getListTotalCount,
    getRecentOtp
}

