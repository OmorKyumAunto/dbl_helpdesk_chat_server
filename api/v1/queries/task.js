const isEmpty = require("is-empty");
let table_name = "dbl_tasks";
let task_view_table = "task_info_view";

let getList = (offset, limit, key, category ,starred,start_date,end_date,id) => {
  let searchCondition = "1=1 AND is_assign = 0";
  
  if (id) {
    searchCondition += ` AND user_id = '${id}' `;
  }
  if (category.length > 0) {
    searchCondition += ` AND task_categories_id IN (${category.map(id => `'${id}'`).join(",")}) `;
  }
  if (start_date && end_date) {
    searchCondition += ` AND created_at BETWEEN '${start_date} 00:00:00' AND '${end_date} 23:59:59' `;
  }
  if (starred) {
    searchCondition += ` AND starred = '${starred}' `;
  }

  if (key) {
    searchCondition += ` AND (LOWER(description) LIKE LOWER('%${key}%') OR LOWER(category_title) LIKE LOWER('%${key}%') OR task_code LIKE '%${key}%')`;
  }


  return `SELECT id,task_categories_id,category_title,set_time,format,description,start_date,start_time,task_code,task_status,starred,task_start_date,task_end_date,task_start_time,task_end_time,created_at,updated_at FROM ${task_view_table} WHERE ${searchCondition} 
         LIMIT ${limit} OFFSET ${offset};`;
};


let getListTotalCount = (key, category ,starred,start_date,end_date,id) => {
  let searchCondition = "1=1 AND is_assign = 0";
  
  if (id) {
    searchCondition += ` AND user_id = '${id}' `;
  }
    if (category.length > 0) {
    searchCondition += ` AND task_categories_id IN (${category.map(id => `'${id}'`).join(",")}) `;
  }
  if (start_date && end_date) {
    searchCondition += ` AND created_at BETWEEN '${start_date} 00:00:00' AND '${end_date} 23:59:59' `;
  }
  if (starred) {
    searchCondition += ` AND starred = '${starred}' `;
  }

  if (key) {
    searchCondition += ` AND (LOWER(description) LIKE LOWER('%${key}%') OR LOWER(category_title) LIKE LOWER('%${key}%') OR task_code LIKE '%${key}%')`;
  }


  return `SELECT id,category_title,description,start_date,start_time,task_code,task_status,starred FROM ${task_view_table} WHERE ${searchCondition}`;
};


let getSuperAdminList = (offset, limit, key, category,starred, start_date, end_date,user_id ) => {
  let searchCondition = "1=1";
  if (category.length > 0) {
    searchCondition += ` AND task_categories_id IN (${category.map(id => `'${id}'`).join(",")}) `;
  }
  if (user_id) {
    searchCondition += ` AND user_id = '${user_id}' `;
  }

  if (start_date && end_date) {
    searchCondition += ` AND created_at BETWEEN '${start_date} 00:00:00' AND '${end_date} 23:59:59' `;
  }
  if (starred) {
    searchCondition += ` AND starred = '${starred}' `;
  }
  if (key) {
    searchCondition += ` AND (LOWER(description) LIKE LOWER('%${key}%') OR LOWER(category_title) LIKE LOWER('%${key}%') OR task_code LIKE '%${key}%' OR LOWER(user_name) LIKE LOWER('%${key}%') OR user_employee_id LIKE '%${key}%')`;
  }

  return `SELECT id, task_categories_id, category_title,set_time,format, description, start_date, start_time, task_code, task_status, starred ,task_start_date,task_end_date,task_start_time,task_end_time,created_at,updated_at
          FROM ${task_view_table} 
          WHERE ${searchCondition} 
          LIMIT ${limit} OFFSET ${offset};`;
};


let getSuperAdminTotalCount = (key, category,starred, start_date, end_date,user_id ) => {
  let searchCondition = "1=1";

  if (category.length > 0) {
    searchCondition += ` AND task_categories_id IN (${category.map(id => `'${id}'`).join(",")}) `;
  }
  if (user_id) {
    searchCondition += ` AND user_id = '${user_id}' `;
  }

  if (start_date && end_date) {
    searchCondition += ` AND created_at BETWEEN '${start_date} 00:00:00' AND '${end_date} 23:59:59' `;
  }
  if (starred) {
    searchCondition += ` AND starred = '${starred}' `;
  }
  if (key) {
    searchCondition += ` AND (LOWER(description) LIKE LOWER('%${key}%') OR LOWER(category_title) LIKE LOWER('%${key}%') OR task_code LIKE '%${key}%' OR LOWER(user_name) LIKE LOWER('%${key}%') OR user_employee_id LIKE '%${key}%')`;
  }

  return `SELECT id, category_title, description, start_date, start_time, task_code, task_status, starred 
          FROM ${task_view_table} 
          WHERE ${searchCondition}`;
};


let assignToMeList = (offset, limit, key, category ,starred,start_date,end_date,assign_to, assign_from_others,id) => {
  let searchCondition = "1=1";  
  
  if (assign_to) {
    searchCondition += ` AND is_assign =  1 AND assign_from_id = '${id}' `;
  }
  if (assign_from_others) {
    searchCondition += ` AND is_assign =  1 AND user_id = '${id}' `;
  }
  if (category.length > 0) {
    searchCondition += ` AND task_categories_id IN (${category.map(id => `'${id}'`).join(",")}) `;
  }
  if (starred) {
    searchCondition += ` AND starred = '${starred}' `;
  }
  if (start_date && end_date) {
    searchCondition += ` AND created_at BETWEEN '${start_date} 00:00:00' AND '${end_date} 23:59:59' `;
  }
  if (key) {
    searchCondition += ` AND (LOWER(description) LIKE LOWER('%${key}%') OR LOWER(category_title) LIKE LOWER('%${key}%') OR task_code LIKE '%${key}%') `;
}



  return `SELECT id,category_title,description,start_date,start_time,task_code,task_status,starred FROM ${task_view_table} WHERE ${searchCondition} 
         LIMIT ${limit} OFFSET ${offset};`;
};


let assignToMeListTotalCount = (key, category ,starred,start_date,end_date,assign_to, assign_from_others,id) => {
  let searchCondition = "1=1";  
  
  if (assign_to) {
    searchCondition += ` AND is_assign =  1 AND assign_from_id = '${id}' `;
  }
  if (assign_from_others) {
    searchCondition += ` AND is_assign =  1 AND user_id = '${id}' `;
  }
  if (category.length > 0) {
    searchCondition += ` AND task_categories_id IN (${category.map(id => `'${id}'`).join(",")}) `;
  }
  if (starred) {
    searchCondition += ` AND starred = '${starred}' `;
  }
  if (start_date && end_date) {
    searchCondition += ` AND created_at BETWEEN '${start_date} 00:00:00' AND '${end_date} 23:59:59' `;
  }
  if (key) {
    searchCondition += ` AND (LOWER(description) LIKE LOWER('%${key}%') OR LOWER(category_title) LIKE LOWER('%${key}%') OR task_code LIKE '%${key}%') `;
}

  return `SELECT id,category_title,description,start_date,start_time,task_code,task_status,starred FROM ${task_view_table} WHERE ${searchCondition}`;
};



let getOnlyDataList = () => {
  return `SELECT id,title FROM ${table_name}  where status IN ('active', 'inactive')`;
};

let getActiveList = () => {
  return `SELECT * FROM ${table_name}  where status = 'active'`;
};

let getByTitle = () => {
  return `SELECT * FROM ${table_name} where  title = ? and user_id = ? and task_categories_id = ? and status = 1`;
};

let getById = () => {
  return `SELECT * FROM ${task_view_table} where  id = ? and user_id = ? `;
};

let getByIdAllData = () => {
  return `SELECT * FROM ${task_view_table} where  id = ?`;
};

let getByCategoryId = () => {
  return `SELECT * FROM ${task_view_table} where  task_categories_id = ? `;
};


let addNew = () => {
  return `INSERT INTO ${table_name} SET ?`;
};

let updateById = (data) => {
  let keys = Object.keys(data);

  let query = `update ${table_name} set ` + keys[0] + ` = ? `;

  for (let i = 1; i < keys.length; i++) {
    query += `, ` + keys[i] + ` = ? `;
  }

  query += ` where id = ? `;

  return query;
};

let getDataByWhereCondition = (
  data = {},
  orderBy = {},
  limit,
  offset,
  columnList = []
) => {
  let keys = Object.keys(data);
  let columns = " * ";

  try {
    if (Array.isArray(columnList) && !isEmpty(columnList)) {
      columns = columnList.join(",");
    }
  } catch (error) {
    columns = " * ";
  }

  let query = `Select ${columns} from ${table_name} `;

  if (keys.length > 0) {
    if (Array.isArray(data[keys[0]])) {
      query += ` where ${keys[0]} BETWEEN ? and ? `;
    } else if (
      typeof data[keys[0]] === "object" &&
      !Array.isArray(data[keys[0]]) &&
      data[keys[0]] !== null
    ) {
      let key2 = Object.keys(data[keys[0]]);

      for (let indexKey = 0; indexKey < key2.length; indexKey++) {
        let tempSubKeyValue = data[keys[0]][key2[indexKey]];
        if (
          key2[indexKey].toUpperCase() === "OR" &&
          Array.isArray(tempSubKeyValue)
        ) {
          query += ` where ( ${keys[0]} = ? `;
          for (
            let indexValue = 1;
            indexValue < tempSubKeyValue.length;
            indexValue++
          ) {
            query += ` or ` + keys[0] + ` = ? `;
          }
          query += ` ) `;
        } else if (key2[indexKey].toUpperCase() === "OR") {
          query +=
            ` where ${key2[indexKey].toLowerCase()} ` + keys[0] + ` = ? `;
        } else if (key2[indexKey].toUpperCase() === "LIKE") {
          query += ` where ${keys[0]} like ? `;
        } else if (["IN", "NOT IN"].includes(key2[indexKey].toUpperCase())) {
          query += ` where ${keys[0]}  ${key2[indexKey].toUpperCase()} ( ? ) `;
        } else if (["IN QUERY"].includes(key2[indexKey].toUpperCase())) {
          query += ` where  ${keys[0]}  IN ( ${
            data[keys[0]][key2[indexKey]]
          } ) `;
        } else if (["NOT IN QUERY"].includes(key2[indexKey].toUpperCase())) {
          query += ` where  ${keys[0]}  NOT IN ( ${
            data[keys[0]][key2[indexKey]]
          } ) `;
        } else if ("GTE" == key2[indexKey].toUpperCase()) {
          query += ` where  ` + keys[0] + ` >= ? `;
        } else if ("GT" == key2[indexKey].toUpperCase()) {
          query += ` where ` + keys[0] + ` > ? `;
        } else if ("LTE" == key2[indexKey].toUpperCase()) {
          query += ` where ` + keys[0] + ` <= ? `;
        } else if ("LT" == key2[indexKey].toUpperCase()) {
          query += ` where ` + keys[0] + ` < ? `;
        } else if ("NOT EQ" == key2[indexKey].toUpperCase()) {
          query += ` where ` + keys[0] + ` != ? `;
        }
      }
    } else {
      query += ` where ${keys[0]} = ? `;
    }

    for (let i = 1; i < keys.length; i++) {
      if (Array.isArray(data[keys[i]])) {
        query += `and ` + keys[i] + `  BETWEEN  ? and ? `;
      } else if (
        typeof data[keys[i]] === "object" &&
        !Array.isArray(data[keys[i]]) &&
        data[keys[i]] !== null
      ) {
        let key2 = Object.keys(data[keys[i]]);

        for (let indexKey = 0; indexKey < key2.length; indexKey++) {
          let tempSubKeyValue = data[keys[i]][key2[indexKey]];
          if (
            key2[indexKey].toUpperCase() === "OR" &&
            Array.isArray(tempSubKeyValue)
          ) {
            query += ` or ( ${keys[i]} = ? `;
            for (
              let indexValue = 1;
              indexValue < tempSubKeyValue.length;
              indexValue++
            ) {
              query += ` or ` + keys[i] + ` = ? `;
            }
            query += ` ) `;
          } else if (key2[indexKey].toUpperCase() === "OR") {
            query += ` or ${key2[indexKey].toLowerCase()} ` + keys[i] + ` = ? `;
          } else if (key2[indexKey].toUpperCase() === "LIKE") {
            query += ` and  ${keys[i]} like ? `;
          } else if (["IN", "NOT IN"].includes(key2[indexKey].toUpperCase())) {
            query += ` and  ${keys[i]}  ${key2[indexKey].toUpperCase()} ( ? ) `;
          } else if (["IN QUERY"].includes(key2[indexKey].toUpperCase())) {
            query += ` and  ${keys[i]}  IN ( ${
              data[keys[i]][key2[indexKey]]
            } ) `;
          } else if (["NOT IN QUERY"].includes(key2[indexKey].toUpperCase())) {
            query += ` and  ${keys[i]}  NOT IN ( ${
              data[keys[i]][key2[indexKey]]
            } ) `;
          } else if ("GTE" == key2[indexKey].toUpperCase()) {
            query += ` and ` + keys[i] + ` >= ? `;
          } else if ("GT" == key2[indexKey].toUpperCase()) {
            query += ` and ` + keys[i] + ` > ? `;
          } else if ("LTE" == key2[indexKey].toUpperCase()) {
            query += ` and ` + keys[i] + ` <= ? `;
          } else if ("LT" == key2[indexKey].toUpperCase()) {
            query += ` and ` + keys[i] + ` < ? `;
          } else if ("NOT EQ" == key2[indexKey].toUpperCase()) {
            query += ` and ` + keys[i] + ` != ? `;
          }
        }
      } else {
        query += `and ` + keys[i] + ` = ? `;
      }
    }
  }

  if (!isEmpty(orderBy)) {
    keys = Object.keys(orderBy);
    query += ` order by ${keys[0]} ${orderBy[keys[0]]} `;

    for (let i = 1; i < keys.length; i++) {
      query += `, ${keys[i]} ${orderBy[keys[i]]} `;
    }
  }

  query += `LIMIT ${offset}, ${limit}`;
  return query;
};

let getDetailsByIdAndWhereIn = () => {
  return `SELECT id,name,status FROM ${table_name} where  id IN (?) and status = 1`;
};

let taskDashboardCountData = () => {
  return `SELECT 
    (SELECT COUNT(id) FROM ${table_name} WHERE status = 1) AS total_task_count,
    (SELECT COUNT(id) FROM ${table_name} WHERE task_status = 'incomplete' AND status = 1) AS total_task_incomplete,
    (SELECT COUNT(id) FROM ${table_name} WHERE task_status = 'complete' AND status = 1) AS total_task_complete,
    (SELECT COUNT(id) FROM ${table_name} WHERE task_status = 'inprogress' AND status = 1) AS total_task_inprogress,
    (SELECT 
        AVG(TIMESTAMPDIFF(SECOND, 
            STR_TO_DATE(CONCAT(task_start_date, ' ', task_start_time), '%Y-%m-%d %H:%i:%s'), 
            task_end_time
        )) 
     FROM ${table_name} 
     WHERE task_status = 'complete' AND status = 1
    ) AS avg_task_completion_time_seconds;`;
};


let taskDashboardCountDataById = () => {
  return `
    SELECT 
      COUNT(id) AS total_task_count,
      SUM(CASE WHEN task_status = 'incomplete' THEN 1 ELSE 0 END) AS total_task_incomplete,
      SUM(CASE WHEN task_status = 'complete' THEN 1 ELSE 0 END) AS total_task_complete,
      SUM(CASE WHEN task_status = 'inprogress' THEN 1 ELSE 0 END) AS total_task_inprogress,
      AVG(TIMESTAMPDIFF(SECOND, 
            STR_TO_DATE(CONCAT(task_start_date, ' ', task_start_time), '%Y-%m-%d %H:%i:%s'), 
            task_end_time
        )) AS avg_task_completion_time_seconds
    FROM ${table_name} 
    WHERE user_id = ? AND status = 1;
  `;
};

let taskSuperAdminDashboardPercentageData = () => {
  return `
    SELECT 
      COUNT(id) AS total_task_count,
      SUM(task_status = 'complete') AS total_task_complete,
      SUM(task_status != 'complete') AS total_task_incomplete
    FROM ${table_name} 
    WHERE  status = 1
  `;
};

let taskAdminDashboardPercentageData = () => {
  return `
    SELECT 
      COUNT(id) AS total_task_count,
      SUM(task_status = 'complete') AS total_task_complete,
      SUM(task_status != 'complete') AS total_task_incomplete
    FROM ${table_name} 
    WHERE user_id = ? AND status = 1
  `;
};


let getTodaySuperAdminList = () => {
  return `SELECT id, category_title, description, start_time 
          FROM ${task_view_table} 
          WHERE DATE(start_date) = CURDATE() 
          LIMIT 10;`;
};


let getTodayList = () => {
  return `SELECT id, category_title, description, start_time 
          FROM ${task_view_table} 
          WHERE user_id = ? AND DATE(start_date) = CURDATE() 
          LIMIT 10;`;
};


let taskDashboardGraphData = () => {
  return `
 SELECT 
    MONTH(task_start_date) AS month,
    COUNT(id) AS total_task_count,
    SUM(CASE WHEN task_status = 'incomplete' THEN 1 ELSE 0 END) AS total_task_incomplete,
    SUM(CASE WHEN task_status = 'complete' THEN 1 ELSE 0 END) AS total_task_complete,
    SUM(CASE WHEN task_status = 'inprogress' THEN 1 ELSE 0 END) AS total_task_inprogress
  FROM ${table_name}
  WHERE status = 1
  AND task_start_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
  GROUP BY month
  ORDER BY month;

  `;
};


let taskDashboardCountGraphById = () => {
  return `
SELECT 
    MONTH(task_start_date) AS month,
    COUNT(id) AS total_task_count,
    SUM(CASE WHEN task_status = 'incomplete' THEN 1 ELSE 0 END) AS total_task_incomplete,
    SUM(CASE WHEN task_status = 'complete' THEN 1 ELSE 0 END) AS total_task_complete,
    SUM(CASE WHEN task_status = 'inprogress' THEN 1 ELSE 0 END) AS total_task_inprogress
FROM ${table_name}
WHERE user_id = ? AND status = 1
AND task_start_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
GROUP BY month
ORDER BY month;

  `;
};



module.exports = {
  getList,
  getActiveList,
  getByTitle,
  getById,
  addNew,
  updateById,
  getDataByWhereCondition,
  getDetailsByIdAndWhereIn,
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
  taskDashboardCountGraphById
};
