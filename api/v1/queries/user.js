let table_name = "dbl_users";

let table_view = "users_view"


let getUserByEmail = () => {
    return `SELECT * FROM ${table_name} where  email = ? and status = 1 `;
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
    return `SELECT  id,role_id,profile_id,employee_id,name,email,department,designation,contact_no,joining_date,unit_name,status FROM ${table_view} where  id = ?  and status != 0 `;
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
    return `SELECT  id,role_id,profile_id,employee_id,name,email,status FROM ${table_name} where  profile_id = ?  and status = 1 `;
}


//get employee list
let getEmployeeList = (offset, limit, key, unit) => {
    let searchCondition = '';

    if (key) {
        searchCondition += ` AND (LOWER(employee_id) LIKE LOWER('%${key}%') OR LOWER(name) LIKE LOWER('%${key}%'))`;
    }

    if (unit) {
        searchCondition += `AND UPPER(unit_name) LIKE UPPER('%${unit}%') `;
    }

    return `SELECT * FROM ${table_view} WHERE status = 1 ${searchCondition} ORDER BY id desc LIMIT ${limit} OFFSET ${offset}`;
}



let getTotalEmployeeList = (key, unit) => {
    let searchCondition = '';

    if (key) {
        searchCondition += ` AND (LOWER(employee_id) LIKE LOWER('%${key}%') OR LOWER(name) LIKE LOWER('%${key}%'))`;
    }

    if (unit) {
        searchCondition += `AND UPPER(unit_name) LIKE UPPER('%${unit}%') `;
    }

    return `SELECT * FROM ${table_name} WHERE status = 1 ${searchCondition} ORDER BY id desc`;
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
    getActiveList
}