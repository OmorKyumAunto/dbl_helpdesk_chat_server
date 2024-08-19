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



module.exports = {
    getUserByEmail,
    addNew,
    getUserInfo
}