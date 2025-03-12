const { connectionDblystem } = require("../connections/connection");
const queries = require("../queries/task");

// Promises Method
let getList = async (offset, limit, key, category ,id) => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(
      queries.getList(offset, limit, key, category,id),
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

let getOnlyDataList = async () => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(
      queries.getOnlyDataList(),
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

let getActiveList = async () => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(
      queries.getActiveList(),
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

let getByTitle = async (title = "",user_id = 0, category_id = 0) => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(
      queries.getByTitle(),
      [title,user_id,category_id],
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

let getById = async (id = 0,user_id = 0) => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(
      queries.getById(),
      [id,user_id],
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

let getByCategoryId = async (id = 0) => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(
      queries.getByCategoryId(),
      [id,user_id],
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};



let addNew = async (info) => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(
      queries.addNew(),
      [info],
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

let updateById = async (id = 0, updateData = {}, conn = undefined) => {
  let connection = connectionDblystem;
  if (conn !== undefined) connection = conn;
  // get object, generate an array and push data value here

  // for update data
  let keysOfUpdateData = Object.keys(updateData);
  let dataParameterUpdateData = [];

  for (let index = 0; index < keysOfUpdateData.length; index++) {
    dataParameterUpdateData.push(updateData[keysOfUpdateData[index]]);
  }

  return new Promise((resolve, reject) => {
    connection.query(
      queries.updateById(updateData),
      [...dataParameterUpdateData, id],
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

let getDataByWhereCondition = async (
  where = {},
  orderBy = {},
  limit = 2000,
  offset = 0,
  columnList = []
) => {
  let connection = connectionDblystem;
  // get object, generate an array and push data value here
  let keys = Object.keys(where);

  let dataParameter = [];

  for (let index = 0; index < keys.length; index++) {
    if (Array.isArray(where[keys[index]]) && where[keys[index]].length > 1) {
      dataParameter.push(where[keys[index]][0], where[keys[index]][1]); // where date between  ? and ?  [ so we pass multiple data]
    } else if (
      typeof where[keys[index]] === "object" &&
      !Array.isArray(where[keys[index]]) &&
      where[keys[index]] !== null
    ) {
      let key2 = Object.keys(where[keys[index]]);

      for (let indexKey = 0; indexKey < key2.length; indexKey++) {
        let tempSubKeyValue = where[keys[index]][key2[indexKey]];
        if (
          key2[indexKey].toUpperCase() === "OR" &&
          Array.isArray(tempSubKeyValue)
        ) {
          for (
            let indexValue = 0;
            indexValue < tempSubKeyValue.length;
            indexValue++
          ) {
            dataParameter.push(tempSubKeyValue[indexValue]);
          }
        } else if (key2[indexKey].toUpperCase() === "OR") {
          dataParameter.push(tempSubKeyValue);
        } else if (key2[indexKey].toUpperCase() === "LIKE") {
          dataParameter.push("%" + tempSubKeyValue + "%");
        } else if (["IN", "NOT IN"].includes(key2[indexKey].toUpperCase())) {
          dataParameter.push(tempSubKeyValue);
        } else if (
          ["IN QUERY", "NOT IN QUERY"].includes(key2[indexKey].toUpperCase())
        ) {
          // General Code manage my  query file
        } else if (
          ["GTE", "GT", "LTE", "LT", "NOT EQ"].includes(
            key2[indexKey].toUpperCase()
          )
        ) {
          dataParameter.push(tempSubKeyValue);
        }
      }
    } else {
      dataParameter.push(where[keys[index]]);
    }
  }

  return new Promise((resolve, reject) => {
    connection.query(
      queries.getDataByWhereCondition(
        where,
        orderBy,
        limit,
        offset,
        columnList
      ),
      [...dataParameter],
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

let getDetailsByIdAndWhereIn = async (expertTypeId = []) => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(
      queries.getDetailsByIdAndWhereIn(),
      [expertTypeId],
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

module.exports = {
  getList,
  getActiveList,
  getById,
  addNew,
  getDataByWhereCondition,
  updateById,
  getDetailsByIdAndWhereIn,
  getByTitle,
  getOnlyDataList,
  getByCategoryId
};
