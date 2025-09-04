let table_name = "dbl_building";

let getUserByEmail = () => {
    return `SELECT * FROM ${table_name} where  email = ? and status = 1 `;
}

let addNew = () => {
    return `INSERT INTO ${table_name} SET ?`;
}


let getByTitle = () => {
    return `SELECT * FROM ${table_name} WHERE unit_id = ? AND name = ? AND status IN ('active', 'inactive')`;
}

let getByName = () => {
    return `SELECT * FROM ${table_name} WHERE  name = ? AND status IN ('active', 'inactive')`;
}

let getList = (limit, offset, unit_id, status, key) => {
    let searchCondition = "b.status != 'delete'";

    // Status filter
    if (status === 'active') {
        searchCondition += " AND b.status = 'active'";
    } else if (status === '') {
        searchCondition += " AND b.status = ''";
    }

    if (unit_id) {
        searchCondition += ` AND b.unit_id = ${unit_id}`;
    }

    if (key && key.trim() !== '') {
        searchCondition += ` AND (u.title LIKE '%${key}%' OR b.name LIKE '%${key}%')`;
    }

    return `
        SELECT 
            b.*, 
            u.title AS unit_name, 
            u.id AS unit_id
        FROM ${table_name} AS b
        JOIN dbl_asset_unit AS u ON u.id = b.unit_id
        WHERE ${searchCondition}
        ORDER BY b.id DESC
        LIMIT ${limit} OFFSET ${offset};
    `;
};


let getListCount = (unit_id, status, key) => {
    let searchCondition = "b.status != 'delete'";

    // Status filter
    if (status === 'active') {
        searchCondition += " AND b.status = 'active'";
    } else if (status === '') {
        searchCondition += " AND b.status = ''";
    }

    if (unit_id) {
        searchCondition += ` AND b.unit_id = ${unit_id}`;
    }

    if (key && key.trim() !== '') {
        searchCondition += ` AND (u.title LIKE '%${key}%' OR b.name LIKE '%${key}%')`;
    }

    return `
        SELECT 
            b.*, 
            u.title AS unit_name, 
            u.id AS unit_id
        FROM ${table_name} AS b
        JOIN dbl_asset_unit AS u ON u.id = b.unit_id
        WHERE ${searchCondition}
        ORDER BY b.id DESC;
    `;
};



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
    return `SELECT * FROM ${table_name} where  id = ? AND status IN ('active', 'inactive');`;
}


let getByUserId = () => {
    return `SELECT * FROM ${table_name} where  id = ? AND status IN ('active', 'inactive');`;
}

let getByUnitWiseId = () => {
    return `SELECT * FROM ${table_name} where  unit_id = ? AND status = 'active' `;
}



let getByEmployeeId = () => {
    return `SELECT * FROM ${table_name} where  employee_id = ? and status = 1 `;
}

let getActiveList = (limit,offset,unit_id,key) => {
     let searchCondition = "b.status = 'active'";  // Always active

    if (unit_id) {
        searchCondition += ` AND b.unit_id = ${unit_id}`;
    }

    if (key && key.trim() !== '') {
        searchCondition += ` AND (u.title LIKE '%${key}%' OR b.name LIKE '%${key}%')`;
    }

    return `
        SELECT 
            b.*, 
            u.title AS unit_name, 
            u.id AS unit_id
        FROM ${table_name} AS b
        JOIN dbl_asset_unit AS u ON u.id = b.unit_id
        WHERE ${searchCondition}
        ORDER BY b.id DESC
        LIMIT ${limit} OFFSET ${offset};
    `;
}

let getActiveListCount = (unit_id,key) => {
     let searchCondition = "b.status = 'active'";  // Always active

    if (unit_id) {
        searchCondition += ` AND b.unit_id = ${unit_id}`;
    }

    if (key && key.trim() !== '') {
        searchCondition += ` AND (u.title LIKE '%${key}%' OR b.name LIKE '%${key}%')`;
    }

    return `
        SELECT 
            b.*, 
            u.title AS unit_name, 
            u.id AS unit_id
        FROM ${table_name} AS b
        JOIN dbl_asset_unit AS u ON u.id = b.unit_id
        WHERE ${searchCondition}
        ORDER BY b.id DESC;
    `;
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

let getDataByUnitId = () => {
    return `select * FROM ${table_name} where unit_id IN (?) and status = 'active' `;
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
    getByEmployeeId,
    getByTitle,
    getActiveList,
    getListCount,
    getActiveListCount,
    getByName,
    getDataByUnitId,
    getByUnitWiseId,
    getByUserId
}