const isEmpty = require("is-empty");
let table_name = "dbl_zingHr_operations";

let addNew = () => {
    return `INSERT INTO ${table_name} SET ?`;
}

//    let zingHrOperationHistory = (offset, limit, status, operation_method, from_date, to_date) => {
//      let searchCondition 

//      if (status) {
//        searchCondition += `AND status = '${status}' `;
//      }
//      if (operation_method) {
//        searchCondition += `AND operation_method = '${operation_method}' `;
//      }
//      // from date and to date base columns name
//      operation_date
//      return `SELECT * FROM ${table_name} WHERE ${searchCondition} ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`;
//    };
   
let zingHrOperationHistory = (offset = 0, limit = 30, status, operation_method, from_date, to_date) => {
    let conditions = [];
  
    if (status) {
      conditions.push(`status = '${status}'`);
    }
    if (operation_method) {
      conditions.push(`operation_method = '${operation_method}'`);
    }
    if (from_date && to_date) {
      conditions.push(`operation_date BETWEEN '${from_date}' AND '${to_date}'`);
    }
  
    let whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  
    return `SELECT * FROM ${table_name} ${whereClause} ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`;
  };

  let zingHrOperationHistoryCount = (status, operation_method, from_date, to_date) => {
    let conditions = [];
  
    if (status) {
      conditions.push(`status = '${status}'`);
    }
    if (operation_method) {
      conditions.push(`operation_method = '${operation_method}'`);
    }
    if (from_date && to_date) {
      conditions.push(`operation_date BETWEEN '${from_date}' AND '${to_date}'`);
    }
  
    let whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  
    return `SELECT * FROM ${table_name} ${whereClause} ORDER BY id DESC `;
  };

module.exports = {
  addNew,
  zingHrOperationHistory,
  zingHrOperationHistoryCount
}