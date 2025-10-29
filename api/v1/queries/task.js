const isEmpty = require("is-empty");
let table_name = "dbl_tasks";
let task_view_table = "task_info_view";
let combine_report_view_table = "combine_report_view"

let getList = (offset, limit, key, category ,starred,start_date,end_date,task_status,id) => {
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
  if (task_status) {
    searchCondition += ` AND task_status = '${task_status}' `;
  }

  if (key) {
    searchCondition += ` AND (LOWER(description) LIKE LOWER('%${key}%') OR LOWER(category_title) LIKE LOWER('%${key}%') OR task_code LIKE '%${key}%')`;
  }

  return `SELECT id,task_categories_id,category_title,set_time,total_set_time,format,description,start_date,start_time,task_code,task_status,starred,quantity,task_start_date,task_end_date,task_start_time,task_end_time,sub_list_details,created_at,updated_at FROM ${task_view_table} WHERE ${searchCondition} 
         LIMIT ${limit} OFFSET ${offset};`;
};


let getListTotalCount = (key, category ,starred,start_date,end_date,task_status,id) => {
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
  if (task_status) {
    searchCondition += ` AND task_status = '${task_status}' `;
  }

  if (key) {
    searchCondition += ` AND (LOWER(description) LIKE LOWER('%${key}%') OR LOWER(category_title) LIKE LOWER('%${key}%') OR task_code LIKE '%${key}%')`;
  }


  return `SELECT id,category_title,description,start_date,start_time,task_code,task_status,starred FROM ${task_view_table} WHERE ${searchCondition}`;
};


let getSuperAdminList = (offset, limit, key, category,starred, start_date, end_date,task_status,unit_id,user_id ) => {
  let searchCondition = "1=1";
  if (category.length > 0) {
    searchCondition += ` AND task_categories_id IN (${category.map(id => `'${id}'`).join(",")}) `;
  }
  if (unit_id) {
    searchCondition += ` AND asset_unit_ids LIKE '%${unit_id}%'`;
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
  if (task_status) {
    searchCondition += ` AND task_status = '${task_status}' `;
  }
  if (key) {
    searchCondition += ` AND (LOWER(description) LIKE LOWER('%${key}%') OR LOWER(category_title) LIKE LOWER('%${key}%') OR task_code LIKE '%${key}%' OR LOWER(user_name) LIKE LOWER('%${key}%') OR user_employee_id LIKE '%${key}%')`;
  }

  return `SELECT id, task_categories_id, category_title,set_time,total_set_time,format, description, start_date, start_time, task_code, task_status, starred ,task_start_date,task_end_date,task_start_time,task_end_time, quantity,user_name,user_employee_id,created_at,updated_at
          FROM ${task_view_table} 
          WHERE ${searchCondition} 
          LIMIT ${limit} OFFSET ${offset};`;
};


let getTaskReport = (key, category, start_date, end_date,task_status,unit_id,user_id,overdue) => {
  let searchCondition = "1=1";
  if (category.length > 0) {
    searchCondition += ` AND task_categories_id IN (${category.map(id => `'${id}'`).join(",")}) `;
  }
  if (unit_id) {
    searchCondition += ` AND asset_unit_ids LIKE '%${unit_id}%'`;
  }
  if (user_id) {
    searchCondition += ` AND user_id = '${user_id}' `;
  }

  if (start_date && end_date) {
    searchCondition += ` AND created_at BETWEEN '${start_date} 00:00:00' AND '${end_date} 23:59:59' `;
  }
  if (task_status) {
    searchCondition += ` AND task_status = '${task_status}' `;
  }

  if (key) {
    searchCondition += ` AND (LOWER(description) LIKE LOWER('%${key}%') OR LOWER(category_title) LIKE LOWER('%${key}%') OR task_code LIKE '%${key}%' OR LOWER(user_name) LIKE LOWER('%${key}%') OR user_employee_id LIKE '%${key}%')`;
  }
  if(overdue || overdue === 0){
    if (overdue !== undefined && overdue !== null) {
      searchCondition += ` AND overdue = '${overdue}' `;
    }
  }


  return `SELECT id, task_categories_id, category_title,set_time,total_set_time,format, description, start_date, start_time, task_code, task_status, starred ,task_start_date,task_end_date,task_start_time,task_end_time, quantity,user_id,user_name,user_employee_id,created_at,overdue
          FROM ${task_view_table} 
          WHERE ${searchCondition} ;`;
};


let getSuperAdminTotalCount = (key, category,starred, start_date, end_date,task_status,unit_id,user_id ) => {
  let searchCondition = "1=1";

  if (category.length > 0) {
    searchCondition += ` AND task_categories_id IN (${category.map(id => `'${id}'`).join(",")}) `;
  }
  if (unit_id) {
    searchCondition += ` AND asset_unit_ids LIKE '%${unit_id}%'`;
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
  if (task_status) {
    searchCondition += ` AND task_status = '${task_status}' `;
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


  return `SELECT 
  id,
  category_title,
  description,
  start_date,
  start_time,
  task_code,
  task_status,
  quantity,
  starred,
  assign_from_name,
  assign_from_employee_id,
  assign_from_unit_name,
  sub_list_details

  FROM ${task_view_table}
   WHERE ${searchCondition} 
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
  return `
    SELECT 
      -- Total task count
      (SELECT COUNT(id) FROM ${table_name} WHERE status = 1) AS total_task_count,

      -- Incomplete tasks
      (SELECT COUNT(id) FROM ${table_name} WHERE task_status = 'incomplete' AND status = 1) AS total_task_incomplete,

      -- Completed tasks
      (SELECT COUNT(id) FROM ${table_name} WHERE task_status = 'complete' AND status = 1) AS total_task_complete,

      -- In-progress tasks
      (SELECT COUNT(id) FROM ${table_name} WHERE task_status = 'inprogress' AND status = 1) AS total_task_inprogress,

      -- Average duration in seconds
      (
        SELECT AVG(TIMESTAMPDIFF(SECOND, 
            STR_TO_DATE(CONCAT(task_start_date, ' ', task_start_time), '%Y-%m-%d %H:%i:%s'), 
            STR_TO_DATE(CONCAT(task_end_date, ' ', task_end_time), '%Y-%m-%d %H:%i:%s')
        ))
        FROM ${table_name}
        WHERE task_status = 'complete' AND status = 1
      ) AS avg_task_completion_time_seconds,

      -- Total completed tasks (again for frequency calculation)
      (
        SELECT COUNT(id)
        FROM ${table_name}
        WHERE task_status = 'complete' AND status = 1
      ) AS total_completed_tasks,

      -- Total overdue tasks based on dynamic format
      (
        SELECT COUNT(t2.id)
        FROM ${table_name} AS t2
        JOIN dbl_task_categories AS tc ON tc.id = t2.task_categories_id
        WHERE t2.task_status = 'complete' 
          AND t2.status = 1 
          AND tc.status = 1 
          AND (
              (tc.format = 'hours' AND TIMESTAMPDIFF(HOUR, 
                  STR_TO_DATE(CONCAT(t2.task_start_date, ' ', t2.task_start_time), '%Y-%m-%d %H:%i:%s'), 
                  STR_TO_DATE(CONCAT(t2.task_end_date, ' ', t2.task_end_time), '%Y-%m-%d %H:%i:%s')
              ) > tc.set_time)
              OR 
              (tc.format = 'day' AND TIMESTAMPDIFF(DAY, 
                  t2.task_start_date, t2.task_end_date
              ) > tc.set_time)
              OR 
              (tc.format = 'minutes' AND TIMESTAMPDIFF(MINUTE, 
                  STR_TO_DATE(CONCAT(t2.task_start_date, ' ', t2.task_start_time), '%Y-%m-%d %H:%i:%s'), 
                  STR_TO_DATE(CONCAT(t2.task_end_date, ' ', t2.task_end_time), '%Y-%m-%d %H:%i:%s')
              ) > tc.set_time)
          )
      ) AS total_overdue_tasks,

      -- Tasks per second
      (
        SELECT COUNT(id) / 
        AVG(TIMESTAMPDIFF(SECOND, 
            STR_TO_DATE(CONCAT(task_start_date, ' ', task_start_time), '%Y-%m-%d %H:%i:%s'), 
            STR_TO_DATE(CONCAT(task_end_date, ' ', task_end_time), '%Y-%m-%d %H:%i:%s')
        ))
        FROM ${table_name}
        WHERE task_status = 'complete' AND status = 1
      ) AS tasks_per_second;
  `;
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
            STR_TO_DATE(CONCAT(task_end_date, ' ', task_end_time), '%Y-%m-%d %H:%i:%s')
        )) AS avg_task_completion_time_seconds,

      (SELECT COUNT(t.id)
       FROM ${table_name} AS t
       JOIN dbl_task_categories AS tc ON tc.id = t.task_categories_id
       WHERE 
         t.task_status = 'complete' 
         AND t.status = 1 
         AND tc.status = 1 
         AND t.user_id = ${table_name}.user_id  
         AND (
              (tc.format = 'hours' 
                  AND TIMESTAMPDIFF(HOUR, 
                      STR_TO_DATE(CONCAT(t.task_start_date, ' ', t.task_start_time), '%Y-%m-%d %H:%i:%s'), 
                      STR_TO_DATE(CONCAT(t.task_end_date, ' ', t.task_end_time), '%Y-%m-%d %H:%i:%s')
                  ) > tc.set_time
              ) 
              OR 
              (tc.format = 'day' 
                  AND TIMESTAMPDIFF(DAY, t.task_start_date, t.task_end_date) > tc.set_time
              ) 
              OR 
              (tc.format = 'minutes' 
                  AND TIMESTAMPDIFF(MINUTE, 
                      STR_TO_DATE(CONCAT(t.task_start_date, ' ', t.task_start_time), '%Y-%m-%d %H:%i:%s'), 
                      STR_TO_DATE(CONCAT(t.task_end_date, ' ', t.task_end_time), '%Y-%m-%d %H:%i:%s')
                  ) > tc.set_time
              )
         )
      ) AS total_overdue_tasks
      
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
  return `SELECT id, category_title, description, start_time,task_status,user_name,user_employee_id,task_code,sub_list_details 
          FROM ${task_view_table} 
          WHERE DATE(start_date) = CURDATE() 
          LIMIT 10;`;
};


let getTodayList = () => {
  return `SELECT id, category_title, description, start_time,task_status,task_code,sub_list_details  
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


let superAdminCategoryWiseTaskCount = () => {
  return `
  SELECT 
    tc.id,tc.title AS category_title, 
    COUNT(t.id) AS task_count
  FROM dbl_task_categories AS tc
  JOIN dbl_tasks AS t ON t.task_categories_id = tc.id
  WHERE tc.status = 1 AND t.status = 1 
  GROUP BY tc.id, tc.title
`;
};

let adminCategoryWiseTaskCount = () => {
  return `
    SELECT 
      tc.id,tc.title AS category_title, 
      COUNT(t.id) AS task_count
    FROM dbl_task_categories AS tc
    JOIN dbl_tasks AS t ON t.task_categories_id = tc.id
    WHERE tc.status = 1 AND t.status = 1 AND t.user_id = ?
    GROUP BY tc.id, tc.title
  `;
};

let taskScheduleList = () => {
  return `SELECT id,category_title,start_time,start_date,description,task_code,task_status,quantity,user_name,user_employee_id,user_email FROM ${task_view_table}`;
};




let combineReport = (start_date, end_date, user_id) => {
  let searchCondition = "1 = 1";

  if (start_date && end_date) {
    searchCondition += ` AND cr.created_at BETWEEN '${start_date} 00:00:00' AND '${end_date} 23:59:59'`;
  }

  if (user_id) {
    searchCondition += ` AND cr.user_id = '${user_id}'`;
  }

  return `
  SELECT 
      -- SLA-adjusted avg
      TIME_FORMAT(
          SEC_TO_TIME(AVG(CASE 
              WHEN derived.source = 'ticket' AND derived.is_overdue = 1 AND derived.ticket_sla_time IS NOT NULL
                  THEN derived.ticket_sla_time
              WHEN derived.source = 'task' AND derived.is_overdue = 1 AND derived.task_sla_time IS NOT NULL
                  THEN derived.task_sla_time
              ELSE derived.actual_time
          END)),
          '%H:%i:%s'
      ) AS combine_avg_sla_time,

      -- Raw averages
      TIME_FORMAT(
          SEC_TO_TIME(AVG(CASE WHEN derived.source = 'ticket' THEN derived.actual_time END)),
          '%H:%i:%s'
      ) AS total_avg_ticket,

      TIME_FORMAT(
          SEC_TO_TIME(AVG(CASE WHEN derived.source = 'task' THEN derived.actual_time END)),
          '%H:%i:%s'
      ) AS total_avg_task,

      TIME_FORMAT(
          SEC_TO_TIME(AVG(derived.actual_time)),
          '%H:%i:%s'
      ) AS total_avg_ticket_task,

      -- Total counts
      COUNT(CASE WHEN derived.source = 'ticket' THEN 1 END) AS total_ticket,
      COUNT(CASE WHEN derived.source = 'task' THEN 1 END) AS total_task,
      COUNT(*) AS total_ticket_task,

      -- Total days worked and 8-hour normalized fields
      COUNT(DISTINCT DATE(derived.created_at)) AS total_days,
      SEC_TO_TIME(SUM(derived.actual_time)) AS total_actual_time,
      SEC_TO_TIME(COUNT(DISTINCT DATE(derived.created_at)) * 8 * 3600) AS expected_work_time_8h_per_day,
      SEC_TO_TIME(FLOOR(SUM(derived.actual_time) / NULLIF(COUNT(DISTINCT DATE(derived.created_at)) * 8,0))) AS avg_work_hours_per_day,

      -- SLA-based avg work hours per day (date-wise, no 8h normalization)
      SEC_TO_TIME(
          FLOOR(
              SUM(
                  CASE 
                      WHEN derived.resolve_time_unit = 'minutes' THEN derived.resolve_time_value * 60
                      WHEN derived.resolve_time_unit = 'hours'   THEN derived.resolve_time_value * 3600
                      WHEN derived.resolve_time_unit = 'day'     THEN derived.resolve_time_value * 8 * 3600
                      WHEN derived.resolve_time_unit = 'month'   THEN derived.resolve_time_value * 30 * 8 * 3600
                  END
              ) / NULLIF(COUNT(DISTINCT DATE(derived.created_at)), 0)
          )
      ) AS avg_work_hours_per_day_sla_wise

  FROM (
      SELECT 
          cr.id,
          cr.user_id,
          cr.source,
          cr.is_overdue,
          cr.created_at,
          TIMESTAMPDIFF(SECOND, cr.created_at, cr.updated_at) AS actual_time,
          cr.resolve_time_value,
          cr.resolve_time_unit,

          -- Ticket SLA
          CASE 
              WHEN rt.id IS NOT NULL AND slc.id IS NOT NULL THEN
                  CASE slc.resolve_time_unit
                      WHEN 'minutes' THEN (slc.resolve_time_value + slc.response_time_value) * 60
                      WHEN 'hours'   THEN (slc.resolve_time_value + slc.response_time_value) * 3600
                      WHEN 'day'     THEN (slc.resolve_time_value + slc.response_time_value) * 8 * 3600
                  END
          END AS ticket_sla_time,

          -- Task SLA
          CASE 
              WHEN t.id IS NOT NULL AND tc.id IS NOT NULL THEN
                  CASE LOWER(tc.format)
                      WHEN 'minutes' THEN tc.set_time * 60
                      WHEN 'hours'   THEN tc.set_time * 3600
                      WHEN 'day'     THEN tc.set_time * 8 * 3600
                  END
          END AS task_sla_time

      FROM ${combine_report_view_table} cr

      -- Ticket joins
      LEFT JOIN dbl_raise_ticket rt 
            ON cr.ticket_id = rt.ticket_id 
            AND cr.source = 'ticket'
            AND rt.status = 1
      LEFT JOIN dbl_sla_configuration slc
            ON rt.priority = slc.priority

      -- Task joins
      LEFT JOIN dbl_tasks t 
            ON cr.ticket_id = t.id 
            AND cr.source = 'task'
            AND t.status = 1
      LEFT JOIN dbl_task_categories tc 
            ON t.task_categories_id = tc.id
            AND tc.status = 1

      WHERE ${searchCondition}
  ) AS derived;
  `;
};


// let combineReportSlaMaintainCount = (start_date, end_date, user_id) => {
//   let searchCondition = "1=1";  
  
//   if (user_id) {
//     searchCondition += ` AND user_id = '${user_id}' `;
//   }

//   if (start_date && end_date) {
//     searchCondition += ` 
//       AND created_at >= '${start_date} 00:00:00' 
//       AND updated_at <= '${end_date} 23:59:59' 
//     `;
//   }

//   return `
//     SELECT 
//       SUM(CASE WHEN source = 'ticket' AND is_overdue = 0 THEN 1 ELSE 0 END) AS in_time_ticket,
//       SUM(CASE WHEN source = 'ticket' AND is_overdue = 1 THEN 1 ELSE 0 END) AS overdue_ticket,
//       SUM(CASE WHEN source = 'task' AND is_overdue = 0 THEN 1 ELSE 0 END) AS in_time_task,
//       SUM(CASE WHEN source = 'task' AND is_overdue = 1 THEN 1 ELSE 0 END) AS overdue_task
//     FROM combine_report_view
//     WHERE ${searchCondition};
//   `;
// };



let combineReportTicketTaskCount = (start_date, end_date, user_id) => {
  let searchCondition = "1=1";  
  
  if (user_id) {
    searchCondition += ` AND user_id = '${user_id}' `;
  }

  if (start_date && end_date) {
    searchCondition += ` 
      AND created_at >= '${start_date} 00:00:00' 
      AND updated_at <= '${end_date} 23:59:59' 
    `;
  }

  return `
    SELECT
      -- Total Counts
      SUM(CASE WHEN source = 'ticket' THEN 1 ELSE 0 END) AS total_ticket,
      SUM(CASE WHEN source = 'task' THEN 1 ELSE 0 END) AS total_task,
      COUNT(*) AS total_ticket_task,

      -- Overdue Counts
      SUM(CASE WHEN source = 'ticket' AND is_overdue = 1 THEN 1 ELSE 0 END) AS ticket_overdue_count,
      SUM(CASE WHEN source = 'task' AND is_overdue = 1 THEN 1 ELSE 0 END) AS task_overdue_count,
      SUM(CASE WHEN is_overdue = 1 THEN 1 ELSE 0 END) AS total_ticket_task_overdue_count,

      -- In-Time Counts
      SUM(CASE WHEN source = 'ticket' AND is_overdue = 0 THEN 1 ELSE 0 END) AS in_time_ticket,
      SUM(CASE WHEN source = 'task' AND is_overdue = 0 THEN 1 ELSE 0 END) AS in_time_task,

      -- Total Ticket Time Sum
      CONCAT(
        FLOOR(SUM(CASE WHEN source = 'ticket' THEN TIMESTAMPDIFF(SECOND, created_at, updated_at) END) / 3600), ':',
        LPAD(FLOOR((SUM(CASE WHEN source = 'ticket' THEN TIMESTAMPDIFF(SECOND, created_at, updated_at) END) % 3600) / 60), 2, '0'), ':',
        LPAD(SUM(CASE WHEN source = 'ticket' THEN TIMESTAMPDIFF(SECOND, created_at, updated_at) END) % 60, 2, '0')
      ) AS total_ticket_time_sum,

      -- Total Task Time Sum
      CONCAT(
        FLOOR(SUM(CASE WHEN source = 'task' THEN TIMESTAMPDIFF(SECOND, created_at, updated_at) END) / 3600), ':',
        LPAD(FLOOR((SUM(CASE WHEN source = 'task' THEN TIMESTAMPDIFF(SECOND, created_at, updated_at) END) % 3600) / 60), 2, '0'), ':',
        LPAD(SUM(CASE WHEN source = 'task' THEN TIMESTAMPDIFF(SECOND, created_at, updated_at) END) % 60, 2, '0')
      ) AS total_task_time_sum,

      -- Combined Total Time (Ticket + Task)
      CONCAT(
        FLOOR(SUM(TIMESTAMPDIFF(SECOND, created_at, updated_at)) / 3600), ':',
        LPAD(FLOOR((SUM(TIMESTAMPDIFF(SECOND, created_at, updated_at)) % 3600) / 60), 2, '0'), ':',
        LPAD(SUM(TIMESTAMPDIFF(SECOND, created_at, updated_at)) % 60, 2, '0')
      ) AS total_ticket_task_time_sum,

      -- Avg Ticket Time (HH:MM:SS)
      SEC_TO_TIME(AVG(CASE WHEN source = 'ticket' THEN TIMESTAMPDIFF(SECOND, created_at, updated_at) END)) AS avg_ticket_time,

      -- Avg Task Time (HH:MM:SS)
      SEC_TO_TIME(AVG(CASE WHEN source = 'task' THEN TIMESTAMPDIFF(SECOND, created_at, updated_at) END)) AS avg_task_time,

      -- Combined Avg (HH:MM:SS)
      SEC_TO_TIME(AVG(TIMESTAMPDIFF(SECOND, created_at, updated_at))) AS avg_ticket_task_time

    FROM dbl_database.combine_report_view
    WHERE ${searchCondition} AND source IN ('ticket', 'task');
  `;
};



let combineReportTicketTimeCalculate = (start_date, end_date, user_id) => {
  let searchCondition = "1=1";  
  
  if (user_id) {
    searchCondition += ` AND r.solved_by = '${user_id}' `;
  }

  if (start_date && end_date) {
    searchCondition += ` 
      AND r.created_at >= '${start_date} 00:00:00' 
      AND r.updated_at <= '${end_date} 23:59:59' 
    `;
  }

  return `
    SELECT
      COUNT(*) AS total_ticket,

      -- Total SLA time (HH:MM:SS)
      SEC_TO_TIME(SUM(
          CASE 
              WHEN s.resolve_time_unit = 'minutes' THEN s.resolve_time_value * 60
              WHEN s.resolve_time_unit = 'hours'   THEN s.resolve_time_value * 3600
              WHEN s.resolve_time_unit = 'days'    THEN s.resolve_time_value * 86400
              ELSE 0
          END
      )) AS total_ticket_sla_time_sum,

      -- Average SLA time per ticket (HH:MM:SS)
      SEC_TO_TIME(
          SUM(
              CASE 
                  WHEN s.resolve_time_unit = 'minutes' THEN s.resolve_time_value * 60
                  WHEN s.resolve_time_unit = 'hours'   THEN s.resolve_time_value * 3600
                  WHEN s.resolve_time_unit = 'days'    THEN s.resolve_time_value * 86400
                  ELSE 0
              END
          ) / COUNT(*)
      ) AS total_ticket_sla_time_avg

    FROM dbl_database.dbl_raise_ticket AS r
    JOIN dbl_database.dbl_sla_configuration AS s
        ON r.priority = s.priority
    WHERE ${searchCondition}
      AND r.status = 1
      AND r.ticket_status = 'solved';
  `;
};


let combineReportTaskTimeCalculate = (start_date, end_date, user_id) => {
  let searchCondition = "1=1";  
  
  if (user_id) {
    searchCondition += ` AND t.user_id = '${user_id}' `;
  }

if (start_date && end_date) {
  searchCondition += `
    AND t.task_start_date BETWEEN '${start_date}' AND '${end_date}'
  `;
}

  return `
    SELECT
      COUNT(*) AS total_task,

      -- Total SLA time (HH:MM:SS)
      SEC_TO_TIME(SUM(
          CASE 
              WHEN tc.format = 'minutes' THEN tc.set_time * 60
              WHEN tc.format = 'hours'   THEN tc.set_time * 3600
              WHEN tc.format = 'days'    THEN tc.set_time * 86400
              ELSE 0
          END
      )) AS total_task_sla_time_sum,

      -- Average SLA time per task (HH:MM:SS)
      SEC_TO_TIME(
          SUM(
              CASE 
                  WHEN tc.format = 'minutes' THEN tc.set_time * 60
                  WHEN tc.format = 'hours'   THEN tc.set_time * 3600
                  WHEN tc.format = 'days'    THEN tc.set_time * 86400
                  ELSE 0
              END
          ) / COUNT(*)
      ) AS total_task_sla_time_avg

    FROM dbl_database.dbl_tasks AS t
    JOIN dbl_database.dbl_task_categories AS tc
        ON t.task_categories_id = tc.id
    WHERE ${searchCondition}
      AND t.status = 1
      AND t.task_status = 'complete';
  `;
};




let combineReportTaskTimeDayWise = (start_date, end_date, user_id) => {
  let searchCondition = "1=1";  

  if (user_id) {
    searchCondition += ` AND user_id = '${user_id}' `;
  }

  if (start_date && end_date) {
    searchCondition += ` 
      AND created_at >= '${start_date} 00:00:00' 
      AND updated_at <= '${end_date} 23:59:59' 
    `;
  }

  return `
    SELECT 
      c.*,
      d.record_count,
      t.total_records
    FROM combine_report_view AS c
    JOIN (
      SELECT 
        DATE(created_at) AS created_date, 
        MIN(created_at) AS min_created_at,
        COUNT(*) AS record_count
      FROM combine_report_view
      WHERE ${searchCondition}
      GROUP BY DATE(created_at)
    ) AS d 
      ON DATE(c.created_at) = d.created_date
      AND c.created_at = d.min_created_at
    CROSS JOIN (
      SELECT COUNT(*) AS total_records
      FROM combine_report_view
      WHERE ${searchCondition}
    ) AS t
    ORDER BY c.created_at ASC;
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
  taskDashboardCountGraphById,
  superAdminCategoryWiseTaskCount,
  adminCategoryWiseTaskCount,
  taskScheduleList,
  getTaskReport,
  combineReport,
  // combineReportSlaMaintainCount,
  combineReportTicketTaskCount,
  combineReportTicketTimeCalculate,
  combineReportTaskTimeCalculate,
  combineReportTaskTimeDayWise
};
