const isEmpty = require("is-empty");
let table_name = "dbl_raise_ticket";
let admin_wise_ticket_view = "admin_wise_ticket";

let getList = () => {
    return `SELECT id,location, unit_id FROM ${table_name} WHERE status = 1 ORDER BY id DESC `;
}
let getAllList = () => {
    return `SELECT id,location, unit_id,status FROM ${table_name} WHERE status != 0 ORDER BY id DESC `;
}

let getAllLocationDataByUnitId = () => {
    return `SELECT id,location,unit_id,status FROM ${table_name} WHERE unit_id = ? and status = 1 ORDER BY id DESC `;
}



// let getAdminWiseTicket = (key, priority, status,offset,limit) => {
//     let conditions = [];

//     // Add conditions dynamically based on parameters
//     if (priority) {
//         conditions.push(`priority = '${priority}'`);
//     }
//     if (status) {
//         conditions.push(`ticket_status = '${status}'`);
//     }
//     if (key) {
//         conditions.push(`(subject LIKE '%${key}%' OR ticket_id LIKE '%${key}%')`);
//     }

//     // Base condition for user_id
//     conditions.push(`user_id = ?`);
//     const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

//     // Final query
//     return `
//         SELECT 
//             * 
//         FROM 
//             ${admin_wise_ticket_view} 
//         ${whereClause} 
      
//     `;
// };

let getAdminWiseTicket = (key, priority, status, offset, limit) => {
    let conditions = [];

    // Add conditions dynamically based on parameters
    if (priority) {
        conditions.push(`priority = '${priority}'`);
    }
    if (status) {
        conditions.push(`ticket_status = '${status}'`);
    }
    if (key) {
        conditions.push(`(subject LIKE '%${key}%' OR ticket_id LIKE '%${key}%')`);
    }

    // Base condition for user_id
    conditions.push(`user_id = ?`);
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Pagination clause
    const paginationClause = `LIMIT ${limit} OFFSET ${offset}`;

    // Build query parts conditionally
    let query = `
        SELECT 
            * 
        FROM 
            ${admin_wise_ticket_view} 
        ${whereClause}
    `;
    

    query += ` ${paginationClause}`;

    return query;
};




// let getSuperAdminTicket = (key,priority,status, Offset ,limit) => {
//     return `SELECT * FROM ${admin_wise_ticket_view} `;
// }
let getSuperAdminTicket = (key, priority, status, offset, limit) => {
    let baseQuery = `SELECT * FROM ${admin_wise_ticket_view}`;

    let conditions = [];
    if (status) {
        conditions.push(`ticket_status = '${status}'`);
    }
    if (priority) {
        conditions.push(`priority = '${priority}'`);
    }
    if (key) {
        conditions.push(`(subject LIKE '%${key}%' OR ticket_id LIKE '%${key}%')`);
    }
    if (conditions.length > 0) {
        baseQuery += " WHERE " + conditions.join(" AND ");
    }

    if (limit) {
        baseQuery += ` LIMIT ${limit}`;
    }
    if (offset) {
        baseQuery += ` OFFSET ${offset}`;
    }

    return baseQuery;
};




// let getAllListUserWise = (id, key = '', priority = '', status = '',offset,limit) => {
//     let conditions = [`rt.created_by = ${id}`, `rt.status = 1`]; 

//     if (priority) {
//         conditions.push(`rt.priority = '${priority}'`);
//     }
//     if (status) {
//         conditions.push(`rt.ticket_status = '${status}'`);
//     }
//     if (key) {
//         conditions.push(`(rt.subject LIKE '%${key}%' OR rt.ticket_id LIKE '%${key}%')`);
//     }
//     const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

//     return `
//         SELECT 
//             rt.*,  
//             au.title AS unit_name, 
//             tc.title AS category_name,
//             ass.name AS asset_name,
//             ass.category AS asset_category,
//             ass.serial_number AS serial_number
//         FROM 
//             dbl_raise_ticket AS rt
//         JOIN 
//             dbl_asset_unit AS au ON au.id = rt.unit_id 
//         JOIN 
//             dbl_ticket_category AS tc ON tc.id = rt.category_id 
//         LEFT JOIN 
//             dbl_asset AS ass ON ass.id = rt.asset_id
//         ${whereClause}
//         ORDER BY 
//             rt.created_at DESC;
//     `;
// };

let getAllListUserWise = (id, key = '', priority = '', status = '', offset, limit) => {
    let conditions = [`rt.created_by = ${id}`, `rt.status = 1`]; 

    if (priority) {
        conditions.push(`rt.priority = '${priority}'`);
    }
    if (status) {
        conditions.push(`rt.ticket_status = '${status}'`);
    }
    if (key) {
        conditions.push(`(rt.subject LIKE '%${key}%' OR rt.ticket_id LIKE '%${key}%')`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Append LIMIT and OFFSET for pagination
    const paginationClause = `LIMIT ${limit} OFFSET ${offset}`;

    return `
        SELECT 
            rt.*,  
            au.title AS unit_name, 
            tc.title AS category_name,
            ass.name AS asset_name,
            ass.category AS asset_category,
            ass.serial_number AS serial_number
        FROM 
            dbl_raise_ticket AS rt
        JOIN 
            dbl_asset_unit AS au ON au.id = rt.unit_id 
        JOIN 
            dbl_ticket_category AS tc ON tc.id = rt.category_id 
        LEFT JOIN 
            dbl_asset AS ass ON ass.id = rt.asset_id
        ${whereClause}
        ORDER BY 
            rt.created_at DESC
        ${paginationClause};
    `;
};


let getAllListAdminWise = (id, key = '', priority = '', status = '') => {
    let conditions = [`rt.created_by = ${id}`, `rt.status = 1`]; 

    if (priority) {
        conditions.push(`rt.priority = '${priority}'`);
    }
    if (status) {
        conditions.push(`rt.ticket_status = '${status}'`);
    }
    if (key) {
        conditions.push(`(rt.subject LIKE '%${key}%' OR rt.ticket_id LIKE '%${key}%')`);
    }
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    return `
        SELECT 
            rt.*,  
            au.title AS unit_name, 
            tc.title AS category_name,
            ass.name AS asset_name,
            ass.category AS asset_category
        FROM 
            dbl_raise_ticket AS rt
        JOIN 
            dbl_asset_unit AS au ON au.id = rt.unit_id 
        JOIN 
            dbl_ticket_category AS tc ON tc.id = rt.category_id 
        LEFT JOIN 
            dbl_asset AS ass ON ass.id = rt.asset_id
        ${whereClause}
        ORDER BY 
            rt.created_at DESC;
    `;
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

let employeeWiseTicket = () => {
    return `SELECT * FROM ${table_name} where  id = ? and created_by = ?`;
}

let adminWiseTicketDetails = () => {
    return `SELECT * FROM ${admin_wise_ticket_view} where  user_id = ? and ticket_table_id = ? `;
}

let addNew = () => {
    return `INSERT INTO ${table_name} SET ?`;
}

const updateById = () => {
    return `UPDATE ${table_name} SET ? WHERE id = ?`;
}


let getUnitAndCategoryWiseEmail = () => {
    return `SELECT * FROM ${admin_wise_ticket_view} where  asset_unit_id = ? and ticket_category_id = ? `;
}


let getAdminWiseTicketById = () => {
    return `SELECT * FROM ${admin_wise_ticket_view}  where  user_id = ? and ticket_table_id = ?`;
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
    getAllLocationDataByUnitId,
    getUnitWiseLocation,
    getAllListUserWise,
    getAllListAdminWise,
    getAdminWiseTicket,
    adminWiseTicketDetails,
    getSuperAdminTicket,
    getUnitAndCategoryWiseEmail,
    employeeWiseTicket,
    getAdminWiseTicketById

}