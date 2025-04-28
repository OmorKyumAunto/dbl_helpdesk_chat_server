const { connectionDblystem } = require('../connections/connection');
const queries = require('../queries/zingHr-operations');





let addNew = async (info) => {
    return new Promise((resolve, reject) => {
        connectionDblystem.query(queries.addNew(), [info], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


// get zing hr operation history
let zingHrOperationHistory = async (offset, limit, status, operation_method, from_date, to_date) => {
    return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.zingHrOperationHistory(offset, limit, status, operation_method, from_date, to_date), (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
}

let zingHrOperationHistoryCount = async (status, operation_method, from_date, to_date) => {
    return new Promise((resolve, reject) => {
      connectionDblystem.query(queries.zingHrOperationHistoryCount(status, operation_method, from_date, to_date), (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
}

module.exports = {
    addNew,
    zingHrOperationHistory,
    zingHrOperationHistoryCount  
}

