const isEmpty = require("is-empty");
let table_name = "dbl_sla_configuration";

let getList = () => {
    return `SELECT sla.id,sla.priority,sla.response_time_value,sla.response_time_unit,sla.resolve_time_unit,sla.resolve_time_value,sla.updated_by,sla.updated_at ,u.name as updated_by_name ,u.employee_id as updated_by_employee_id
    
    FROM dbl_sla_configuration as sla 
    left join users_view as u 
    on u.id = sla.updated_by`;
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
    return `SELECT * FROM ${table_name} where  id = ? `;
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