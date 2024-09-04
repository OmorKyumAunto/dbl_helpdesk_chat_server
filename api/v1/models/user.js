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
    console.log("firstgggggg",id)
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



module.exports = {
    getUserByEmail,
    addNew,
    getUserInfo,
    getUserById,
    getUserByEmployeeId,
    updateByEmployeeUser,
    updateById
}