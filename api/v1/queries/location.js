const isEmpty = require("is-empty");
let table_name = "location";

let getList = (unit, key, offset, limit) => {
    let baseQuery = `SELECT * FROM ${table_name} WHERE status = 1`;

    if (unit) {
        baseQuery += ` AND unit_id = ${unit}`; 
    }

    if (key) {
        baseQuery += ` AND location LIKE '%${key}%'`;
    }

    // Add ordering, limit, and offset
    baseQuery += ` ORDER BY id DESC`;

    if (limit) {
        baseQuery += ` LIMIT ${limit}`;
    }
    if (offset) {
        baseQuery += ` OFFSET ${offset}`;
    }

    return baseQuery;
};



let getListTotalCount = (unit,key) => {
    let baseQuery = `SELECT * FROM ${table_name} WHERE status = 1`;
    if (unit) {
        baseQuery += ` AND unit_id = ${unit}`; 
    }

    if (key) {
        baseQuery += ` AND (location LIKE '%${key}%')`;
    }

    baseQuery += ` ORDER BY id DESC`;

    return baseQuery;
};



let getAllList = (unit, key, offset, limit) => {
    let baseQuery = `SELECT * FROM ${table_name} WHERE status != 0`;

    if (unit) {
        baseQuery += ` AND unit_id = ${unit}`; 
    }

    if (key) {
        baseQuery += ` AND location LIKE '%${key}%'`;
    }

    baseQuery += ` ORDER BY id DESC`;

    if (limit) {
        baseQuery += ` LIMIT ${limit}`;
    }
    if (offset) {
        baseQuery += ` OFFSET ${offset}`;
    }

    return baseQuery;
};


let getAllLocationDataByUnitId = (unit, key) => {
    let baseQuery = `SELECT * FROM ${table_name} WHERE status != 0`;

    if (unit) {
        baseQuery += ` AND unit_id = ${unit}`; 
    }

    if (key) {
        baseQuery += ` AND location LIKE '%${key}%'`;
    }

    baseQuery += ` ORDER BY id DESC`;

    return baseQuery;
};


let getLocation = () => {

    return `SELECT * FROM ${table_name}  where location = ? and unit_id = ? and status = 1`;
}

let getUnitWiseLocation = () => {
    return `SELECT * FROM ${table_name}  where location = ? and unit_id = ? and status = 1`;
}


let getOnlyDataList = () => {
    return `SELECT * FROM ${table_name}  where status != 0 `;
}

let getActiveList = () => {
    return `SELECT * FROM ${table_name}  where status = 'active'`;
}



let getByTitle = () => {
    return `SELECT * FROM ${table_name} where  title = ? and status = 'active'`;
}

let getById = () => {
    return `SELECT * FROM ${table_name} where  id = ? and status = 1 `;
}

let getByNonDeleteData = () => {
    return `SELECT * FROM ${table_name} where  id = ? and status != 0 `;
}
let addNew = () => {
    return `INSERT INTO ${table_name} SET ?`;
}

const updateById = () => {
    return `UPDATE ${table_name} SET ? WHERE id = ?`;
}




module.exports = {
    getList,
    getActiveList,
    getByTitle,
    getById,
    addNew,
    updateById,
    getOnlyDataList,


    getLocation,
    getAllList,
    getByNonDeleteData,
    getAllLocationDataByUnitId,
    getUnitWiseLocation,
    getListTotalCount

}