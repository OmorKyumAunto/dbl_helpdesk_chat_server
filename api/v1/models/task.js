const { connectionDblystem } = require("../connections/connection");
const queries = require("../queries/task");

// Promises Method
let getList = async (offset, limit, key = '', category ,starred,start_date,end_date,task_status,id) => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(
      queries.getList(offset, limit, key, category,starred,start_date,end_date,task_status,id),
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

let getListTotalCount = async (key = '', category ,starred,start_date,end_date,task_status,id) => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(
      queries.getListTotalCount(key, category,starred,start_date,end_date,task_status,id),
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};


let getSuperAdminList = async (offset, limit, key = '', category,starred,start_date,end_date,task_status,unit_id,user_id) => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(
      queries.getSuperAdminList(offset, limit, key, category,starred,start_date,end_date,task_status,unit_id,user_id),
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};


let getTaskReport = async (key = '', category,start_date,end_date,task_status,unit_id,user_id,overdue) => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(
      queries.getTaskReport(key, category,start_date,end_date,task_status,unit_id,user_id,overdue),
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};




let getSuperAdminTotalCount = async (key = '', category,starred,start_date,end_date,task_status,unit_id,user_id) => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(
      queries.getSuperAdminTotalCount(key, category,starred,start_date,end_date,task_status,unit_id,user_id),
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};


let assignToMeList = async (offset, limit, key = '', category ,starred,start_date,end_date,assign_to, assign_from_others,id) => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(
      queries.assignToMeList(offset, limit, key, category ,starred,start_date,end_date,assign_to, assign_from_others,id),
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

let assignToMeListTotalCount = async (key = '', category ,starred,start_date,end_date,assign_to, assign_from_others,id) => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(
      queries.assignToMeListTotalCount(key, category ,starred,start_date,end_date,assign_to, assign_from_others,id),
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};


let taskScheduleList = async () => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(
      queries.taskScheduleList(),
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


let getByIdAllData = async (id = 0) => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(
      queries.getByIdAllData(),
      [id],
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


// super admin dashboard count data
let taskDashboardCountData = async () => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(
      queries.taskDashboardCountData(),
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};


//admin dashboard count data
let taskDashboardCountDataById = async (user_id = 0) => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(
      queries.taskDashboardCountDataById(),[user_id],
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};


// task percentage data super admin
let taskSuperAdminDashboardPercentageData = async () => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(
      queries.taskSuperAdminDashboardPercentageData(),
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

// task percentage data  admin
let taskAdminDashboardPercentageData = async (user_id = 0) => {
  console.log("first",user_id)
  return new Promise((resolve, reject) => {
    connectionDblystem.query(
      queries.taskAdminDashboardPercentageData(),[user_id],
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};


// get today list
let getTodaySuperAdminList = async () => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(
      queries.getTodaySuperAdminList(),
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};


// get today list admin
let getTodayList = async (user_id = 0) => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(
      queries.getTodayList(),[user_id],
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};



// super admin dashboard graph data
let taskDashboardGraphData = async () => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(
      queries.taskDashboardGraphData(),
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};


//admin dashboard graph data
let taskDashboardCountGraphById = async (user_id = 0) => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(
      queries.taskDashboardCountGraphById(),[user_id],
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

// super admin category wise task count
let superAdminCategoryWiseTaskCount = async () => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(
      queries.superAdminCategoryWiseTaskCount(),
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};


// admin category wise task count
let adminCategoryWiseTaskCount = async (user_id = 0) => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(
      queries.adminCategoryWiseTaskCount(),[user_id],
      (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

// combine report
let combineReport = async (start_date,end_date,unit,user_id) => {
  return new Promise((resolve, reject) => {
    connectionDblystem.query(
      queries.combineReport(start_date,end_date,unit,user_id),
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
  getByCategoryId,
  assignToMeList,
  getSuperAdminList,
  getSuperAdminTotalCount,
  getListTotalCount,
  assignToMeListTotalCount,
  taskDashboardCountData,
  taskDashboardCountDataById,
  taskSuperAdminDashboardPercentageData,
  taskAdminDashboardPercentageData,
  getByIdAllData,
  getTodaySuperAdminList,
  getTodayList,
  taskDashboardGraphData,
  taskDashboardCountGraphById,
  superAdminCategoryWiseTaskCount,
  adminCategoryWiseTaskCount,
  taskScheduleList,
  getTaskReport,
  combineReport
};
