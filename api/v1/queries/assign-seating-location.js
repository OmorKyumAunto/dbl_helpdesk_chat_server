let table_name = "dbl_assign_seating_location";
let user_assign_location = "user_assign_location_view";

let getUserByEmail = () => {
    return `SELECT * FROM ${table_name} where  email = ? and status = 1 `;
}

let addNew = () => {
    return `INSERT INTO ${table_name} SET ?`;
}


let getByTitle = () => {
    return `SELECT * FROM ${table_name} WHERE building_id = ? AND name = ? AND status IN ('active', 'inactive')`;
}

let getByName = () => {
    return `SELECT * FROM ${table_name} WHERE  name = ? AND status IN ('active', 'inactive')`;
}

let getList = (limit, offset,unit_id, building_id, status, key) => {
    let searchCondition = "sl.status != 'delete'";

    // Status filter
    if (status === 'active') {
        searchCondition += " AND sl.status = 'active'";
    } else if (status === '') {
        searchCondition += " AND sl.status = ''";
    }
    if (unit_id) {
      searchCondition += ` AND u.id = ${unit_id}`;
    }
    if (building_id) {
        searchCondition += ` AND sl.building_id = ${building_id}`;
    }

    if (key && key.trim() !== '') {
        searchCondition += ` AND (sl.name LIKE '%${key}%' OR b.name LIKE '%${key}%')`;
    }

    return `
    SELECT 
        sl.id,
        sl.name,
        sl.status,
        sl.created_at,
        sl.updated_at,
        b.name AS building_name,
        b.id AS building_id,
        u.id AS unit_id,
        u.title AS unit_name
    FROM ${table_name} AS sl
    JOIN dbl_building AS b ON b.id = sl.building_id
    LEFT JOIN dbl_asset_unit AS u ON u.id = b.unit_id
    WHERE ${searchCondition}
    ORDER BY sl.id DESC
    LIMIT ${limit} OFFSET ${offset};
    `;
};


let getListCount = (unit_id,building_id, status, key) => {
   let searchCondition = "sl.status != 'delete'";

    // Status filter
    if (status === 'active') {
        searchCondition += " AND sl.status = 'active'";
    } else if (status === '') {
        searchCondition += " AND sl.status = ''";
    }
    if (unit_id) {
      searchCondition += ` AND u.id = ${unit_id}`;
    }
    if (building_id) {
        searchCondition += ` AND sl.building_id = ${building_id}`;
    }

    if (key && key.trim() !== '') {
        searchCondition += ` AND (sl.name LIKE '%${key}%' OR b.name LIKE '%${key}%')`;
    }

    return `
    SELECT 
        sl.id,
        sl.name,
        sl.status,
        sl.created_at,
        sl.updated_at,
        b.name AS building_name,
        b.id AS building_id,
        u.id AS unit_id,
        u.title AS unit_name
    FROM ${table_name} AS sl
    JOIN dbl_building AS b ON b.id = sl.building_id
    LEFT JOIN dbl_asset_unit AS u ON u.id = b.unit_id
    WHERE ${searchCondition}
    ORDER BY sl.id DESC;
    `;
};



let getUserInfo = () => {
    return `SELECT * FROM ${table_name} where  email = ? and password = ? and status != 0 `;
}

let getById = () => {
    return `SELECT * FROM ${table_name} where  user_id = ? AND seating_location_id = ? AND status = 1;`;
}

let getLocationByUserId = () => {
    return `SELECT * FROM ${table_name} WHERE user_id = ?  AND status = 1`;
}

let getIdByUserAndLocationId = () => {
    return `SELECT * FROM ${table_name} WHERE user_id = ?  AND  seating_location_id = ? AND status = 1`;
}

let userWiseLocation = () => {
    return `SELECT * FROM ${user_assign_location} where  user_id = ? ;`;
}


let getByEmployeeId = () => {
    return `SELECT * FROM ${table_name} where  employee_id = ? and status = 1 `;
}

let getActiveList = (limit,offset,unit_id,building_id,key) => {
     let searchCondition = "sl.status = 'active'";

    if (unit_id) {
      searchCondition += ` AND u.id = ${unit_id}`;
    }
    if (building_id) {
        searchCondition += ` AND sl.building_id = ${building_id}`;
    }

    if (key && key.trim() !== '') {
        searchCondition += ` AND (sl.name LIKE '%${key}%' OR b.name LIKE '%${key}%')`;
    }

    return `
    SELECT 
        sl.id,
        sl.name,
        sl.status,
        sl.created_at,
        sl.updated_at,
        b.name AS building_name,
        b.id AS building_id,
        u.id AS unit_id,
        u.title AS unit_name
    FROM ${table_name} AS sl
    JOIN dbl_building AS b ON b.id = sl.building_id
    LEFT JOIN dbl_asset_unit AS u ON u.id = b.unit_id
    WHERE ${searchCondition}
    ORDER BY sl.id DESC
    LIMIT ${limit} OFFSET ${offset};
    `;
}

let getActiveListCount = (unit_id,building_id,key) => {
    let searchCondition = "sl.status = 'active'";

    if (unit_id) {
      searchCondition += ` AND u.id = ${unit_id}`;
    }
    if (building_id) {
        searchCondition += ` AND sl.building_id = ${building_id}`;
    }

    if (key && key.trim() !== '') {
        searchCondition += ` AND (sl.name LIKE '%${key}%' OR b.name LIKE '%${key}%')`;
    }

    return `
    SELECT 
        sl.id,
        sl.name,
        sl.status,
        sl.created_at,
        sl.updated_at,
        b.name AS building_name,
        b.id AS building_id,
        u.id AS unit_id,
        u.title AS unit_name
    FROM ${table_name} AS sl
    JOIN dbl_building AS b ON b.id = sl.building_id
    LEFT JOIN dbl_asset_unit AS u ON u.id = b.unit_id
    WHERE ${searchCondition}
    ORDER BY sl.id DESC ;
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
    getLocationByUserId,
    getIdByUserAndLocationId,
    userWiseLocation
}