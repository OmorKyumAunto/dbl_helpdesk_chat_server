let table_name = "dbl_users";

let table_view = "users_view"

let asset_table_view = "asset_assign_user_view"

let user_unit_category_view = "user_unit_category";


let getUserByEmail = () => {
    return `SELECT * FROM ${table_name} where  email = ? `;
}

let addNew = () => {
    return `INSERT INTO ${table_name} SET ?`;
}


let getUserInfo = () => {
    return `SELECT * FROM ${table_name} where  email = ? and password = ? and status = 1 `;
}

let getUserById = () => {
    return `SELECT  id,role_id,profile_id,employee_id,name,email,status FROM ${table_name} where  id = ?  and status = 1 `;
}

let getById = () => {
    return `SELECT  * FROM ${table_view} where  id = ?  and status != 0 `;
}

let getUnitByUserId = () => {
    return `SELECT  asset_unit_titles FROM ${user_unit_category_view} where user_id = ?`;
}

let getDataByAssetId = () => {
    return `SELECT  * FROM ${asset_table_view} where  user_id = ?  and status != 0 `;
}

let getDataById = () => {
    return `SELECT  *FROM ${table_name} where  id = ?  and status = 1 `;
}


let getUserByEmployeeId = () => {
    return `SELECT  * FROM ${table_name} where  employee_id = ?  and status = 1 `;
}


const updateByEmployeeUser = () => {
    return `UPDATE ${table_name} SET ? WHERE  id = ?`;
}

const updateById = () => {
    return `UPDATE ${table_name} SET ? WHERE id = ?`;
}


let getByEmployeeId = () => {
    return `SELECT  id,role_id,profile_id,employee_id,name,email,status FROM ${table_name} where  employee_id = ? `;
}


//get employee list
let getEmployeeList = (offset, limit, key, unit_name,status,blood_group,employee_type) => {
   
    let searchCondition = '';
    if (unit_name) {
        searchCondition += `AND UPPER(unit_name) LIKE UPPER('%${unit_name}%') `;
    }
    if (status) {
        searchCondition += `AND (status) LIKE ('%${status}%') `;
    }
    if (blood_group) {
        searchCondition += `AND UPPER(blood_group) LIKE UPPER('%${blood_group}%') `;
    }
    if (employee_type) {
        if (employee_type === "management") {
            // Management employees (start with 1510)
            searchCondition += `AND (employee_id) LIKE '1510%' `;
        } else if (employee_type === "non-management") {
            // Non-management employees (any user_id_no)
            searchCondition += `AND (employee_id) NOT LIKE '1510%' `;
        }
    }
    
    if (key) {
        searchCondition += ` AND (
          LOWER(employee_id) LIKE LOWER('%${key}%') 
          OR LOWER(name) LIKE LOWER('%${key}%') 
          OR email LIKE '%${key}%' 
          OR LOWER(department) LIKE LOWER('%${key}%') 
        )`;
      }
      
    return `SELECT * FROM ${table_view} WHERE status != 0 ${searchCondition} ORDER BY id desc LIMIT ${limit} OFFSET ${offset}`;
}




let getTotalEmployeeList = (key, unit_name,status,blood_group,employee_type) => {
    let searchCondition = '';
    if (unit_name) {
        searchCondition += `AND UPPER(unit_name) LIKE UPPER('%${unit_name}%') `;
    }
    if (status) {
        searchCondition += `AND (status) LIKE ('%${status}%') `;
    }
    if (blood_group) {
        searchCondition += `AND UPPER(blood_group) LIKE UPPER('%${blood_group}%') `;
    }
    if (employee_type) {
        if (employee_type === "management") {
            // Management employees (start with 1510)
            searchCondition += `AND (employee_id) LIKE '1510%' `;
        } else if (employee_type === "non-management") {
            // Non-management employees (any user_id_no)
            searchCondition += `AND (employee_id) NOT LIKE '1510%' `;
        }
    }
   
    if (key) {
        searchCondition += ` AND (LOWER(employee_id) LIKE LOWER('%${key}%') OR LOWER(name) LIKE LOWER('%${key}%'))`;
    }


    return `SELECT * FROM ${table_view} WHERE  status = 1 ${searchCondition} ORDER BY id desc`;
}




// employee list only
let getOnlyEmployeeList = (offset, limit, key, unit_name,blood_group) => {
    let searchCondition = '';
    if (unit_name) {
        searchCondition += `AND UPPER(unit_name) LIKE UPPER('%${unit_name}%') `;
    }
    if (blood_group) {
        searchCondition += `AND (blood_group) LIKE ('%${blood_group}%') `;
    }
    if (key) {
        searchCondition += ` AND (LOWER(employee_id) LIKE LOWER('%${key}%') OR LOWER(name) LIKE LOWER('%${key}%'))`;
    }


    return `SELECT * FROM ${table_view} WHERE  role_id = 3 and status != 0 ${searchCondition} ORDER BY id desc LIMIT ${limit} OFFSET ${offset}`;
}

// employee list only
let getOnlyTotalEmployeeList = (key, unit_name,blood_group) => {
    let searchCondition = '';
    if (unit_name) {
        searchCondition += `AND UPPER(unit_name) LIKE UPPER('%${unit_name}%') `;
    }
    if (blood_group) {
        searchCondition += `AND (blood_group) LIKE ('%${blood_group}%') `;
    }

    if (key) {
        searchCondition += ` AND (LOWER(employee_id) LIKE LOWER('%${key}%') OR LOWER(name) LIKE LOWER('%${key}%'))`;
    }

   
    return `SELECT * FROM ${table_view} WHERE  role_id = 3  and status = 1 ${searchCondition} ORDER BY id desc`;
}





let getEmployeeAdminList = (offset, limit, key, unit) => {
    let searchCondition = '';
    if (unit) {
        searchCondition += `AND UPPER(unit_name) LIKE UPPER('%${unit}%') `;
    }
    if (key) {
        searchCondition += ` AND (LOWER(employee_id) LIKE LOWER('%${key}%') OR LOWER(name) LIKE LOWER('%${key}%'))`;
    }


    return `SELECT * FROM ${table_view} WHERE role_id = 2 and status != 0 ${searchCondition} ORDER BY id desc LIMIT ${limit} OFFSET ${offset}`;
}


let getTotalEmployeeAdminList = (key, unit) => {
    let searchCondition = '';
    if (unit) {
        searchCondition += `AND UPPER(unit_name) LIKE UPPER('%${unit}%') `;
    }

    if (key) {
        searchCondition += ` AND (LOWER(employee_id) LIKE LOWER('%${key}%') OR LOWER(name) LIKE LOWER('%${key}%'))`;
    }

   
    return `SELECT * FROM ${table_view} WHERE  role_id = 2 and  status = 1 ${searchCondition} ORDER BY id desc`;
}



const getList = () => {
    return `select * from ${table_view} where status = !0 order by id desc`;
}



const getActiveList = () => {
    return `select * from ${table_view} where status = 1 order by id desc`;
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
    getDataByAssetId,
    getDataByAssetId,
    getOnlyEmployeeList,
    getOnlyTotalEmployeeList,
    getUnitByUserId
}