let table_name = "dbl_unit_super_admin";


let getUserByEmail = () => {
    return `SELECT * FROM ${table_name} where  email = ? and status = 1 `;
}

let addNew = () => {
    return `INSERT INTO ${table_name} SET ?`;
}


let getList = (offset, limit, key, unit_name) => {
    let searchCondition = '';

    if (key) {
        searchCondition += ` AND (LOWER(employee_id) LIKE LOWER('%${key}%') OR LOWER(name) LIKE LOWER('%${key}%'))`;
    }

    if (unit_name) {
        searchCondition += `AND UPPER(unit_name) LIKE UPPER('%${unit_name}%') `;
    }

    return `SELECT * FROM ${table_name2} WHERE status = 1 ${searchCondition} ORDER BY id desc LIMIT ${limit} OFFSET ${offset}`;
}




let getTotalList = (key, unit_name) => {
    let searchCondition = '';

    if (key) {
        searchCondition += ` AND (LOWER(employee_id) LIKE LOWER('%${key}%') OR LOWER(name) LIKE LOWER('%${key}%'))`;
    }

    if (unit_name) {
        searchCondition += `AND UPPER(unit_name) LIKE UPPER('%${unit_name}%') `;
    }

    return `SELECT * FROM ${table_name2} WHERE status = 1 ${searchCondition} ORDER BY id desc`;
}

let getUserInfo = () => {
    return `SELECT * FROM ${table_name} where  email = ? and password = ? and status != 0 `;
}

let getById = () => {
    return `SELECT * FROM ${table_name} where  id = ? and status = 1 `;
}

let getByEmployeeId = () => {
    return `SELECT * FROM ${table_name} where  employee_id = ? and status = 1 `;
}

let getByProfileId = () => {
    return `SELECT * FROM ${table_name} where  id = ? and status = 1 `;
}

const updateById = () => {
    return `UPDATE ${table_name} SET ? WHERE id = ?`;
}

let getByIdForDeleted = () => {
    return `delete FROM ${table_name} where  id = ? and status = 1 `;
}
module.exports = {
    getUserByEmail,
    addNew,
    getUserInfo,
    getById,
    updateById,
    getList,
    getByIdForDeleted,
    getByProfileId,
    getByEmployeeId
}