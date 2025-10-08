let table_name = "dbl_location_update_track";

let getUserByEmail = () => {
    return `SELECT * FROM ${table_name} where  email = ? and status = 1 `;
}

let addNew = () => {
    return `INSERT INTO ${table_name} SET ?`;
}


let getList = (offset, limit, unit_id, key) => {
    let searchCondition = '1 = 1';

    if (key) {
        searchCondition += ` AND LOWER(unit_name) LIKE LOWER('%${key}%')`;
    }

    if (unit_id) {
        searchCondition += ` AND unit_id = '${unit_id}'`;
    }

    return `SELECT * FROM ${table_name} WHERE ${searchCondition} ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`;
};


let getListCount = (unit_id, key) => {
    let searchCondition = '1 = 1';

    if (key) {
        searchCondition += ` AND LOWER(unit_name) LIKE LOWER('%${key}%')`;
    }

    if (unit_id) {
        searchCondition += ` AND unit_id = '${unit_id}'`;
    }

    return `SELECT COUNT(*) AS total FROM ${table_name} WHERE ${searchCondition}`;
};



let getUserInfo = () => {
    return `SELECT * FROM ${table_name} where  email = ? and password = ? and status != 0 `;
}

let getById = () => {
    return `SELECT * FROM ${table_name} where  id = ? and status = 1 `;
}

let getByUnitName = () => {
    return `SELECT * FROM ${table_name} where  unit_name = ?`;
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
    getByUnitName,
    getListCount
}