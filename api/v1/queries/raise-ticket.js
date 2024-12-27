const isEmpty = require("is-empty");
let table_name = "dbl_raise_ticket";
let admin_wise_ticket_view = "admin_wise_ticket";
let super_admin_ticket_view = "super_admin_ticket_view";

let getList = () => {
    return `SELECT id,location, unit_id FROM ${table_name} WHERE status = 1 ORDER BY id DESC `;
}
let getAllList = () => {
    return `SELECT id,location, unit_id,status FROM ${table_name} WHERE status != 0 ORDER BY id DESC `;
}

let getAllLocationDataByUnitId = () => {
    return `SELECT id,location,unit_id,status FROM ${table_name} WHERE unit_id = ? and status = 1 ORDER BY id DESC `;
}




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

let getAdminWiseTicketTotalCount = (key, priority, status) => {
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


    // Build query parts conditionally
    let query = `
        SELECT 
            * 
        FROM 
            ${admin_wise_ticket_view} 
        ${whereClause}
    `;

    return query;
};


let getSuperAdminTicket = (key, priority, status, offset, limit) => {
    let baseQuery = `
    SELECT * FROM ${super_admin_ticket_view}
`;


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


let getSuperAdminTicketTotalCount = (key, priority, status) => {
    let baseQuery = `SELECT * FROM ${super_admin_ticket_view}`;

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
    return baseQuery;
};




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
        ass.serial_number AS serial_number,
        u.name AS ticket_solved_employee_name,
        u.employee_id AS ticket_solved_employee_id
    FROM 
        dbl_raise_ticket AS rt
    JOIN 
        dbl_asset_unit AS au ON au.id = rt.unit_id 
    JOIN 
        dbl_ticket_category AS tc ON tc.id = rt.category_id 
    LEFT JOIN 
        dbl_asset AS ass ON ass.id = rt.asset_id
    LEFT JOIN 
        dbl_users AS u ON u.id = rt.solved_by
    ${whereClause}
    ORDER BY 
        rt.id DESC
    ${paginationClause};
`;

};


let getAllListTotalCountUserWise = (id, key = '', priority = '', status = '') => {
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
    return `SELECT * FROM ${table_name} where  id = ?  and status = 1 `;  // added status = 1
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


// ticket dashboard counting data

let ticketCountingData = () => {
    return `SELECT count(id) as total_ticket FROM ${table_name} where status = 1 `; 
}
let getTicketTotalSolved = () => {
    return `SELECT count(id) as total_solved FROM ${table_name} where ticket_status = 'solved' and status = 1 `; 
}

let getTicketTotalUnsolved = () => {
    return `SELECT count(id) as total_unsolved FROM ${table_name} where ticket_status = 'unsolved' and status = 1 `; 
}

let getTicketTotalForward = () => {
    return `SELECT count(id) as total_forward FROM ${table_name} where ticket_status = 'forward' and status = 1`; 
}
let getTicketTotalInprogress = () => {
    return `SELECT count(id) as total_inprogress FROM ${table_name} where ticket_status = 'inprogress' and status = 1`; 
}

let getTopSolvedTicketList = () => {
    return `
        SELECT 
            u.id AS id, 
            u.name AS solved_by_name, 
                u.employee_id AS employee_id, 
            COUNT(rt.id) AS solved_ticket_count
        FROM 
            dbl_database.dbl_raise_ticket AS rt
        LEFT JOIN 
            dbl_users AS u 
        ON 
            u.id = rt.solved_by 
        WHERE 
            rt.ticket_status = 'solved' 
        GROUP BY 
            rt.solved_by 
        ORDER BY 
            solved_ticket_count DESC 
        LIMIT 10;
        `;
}



let priorityBaseTicketList = () => {
    return `
        SELECT 
            tc.id AS category_id,
            tc.title AS category_title,
            COUNT(rt.id) AS ticket_count
        FROM 
            dbl_ticket_category AS tc
        LEFT JOIN 
            dbl_raise_ticket AS rt 
        ON 
            tc.id = rt.category_id
        WHERE 
            tc.status = 'active'
        GROUP BY 
            tc.id, tc.title
        ORDER BY 
            ticket_count DESC;
    `;
}



let categoryBaseTicketList = () => {
    return `
           SELECT 
            SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) AS priority_high,
            SUM(CASE WHEN priority = 'low' THEN 1 ELSE 0 END) AS priority_low,
            SUM(CASE WHEN priority = 'medium' THEN 1 ELSE 0 END) AS priority_medium,
            SUM(CASE WHEN priority = 'urgent' THEN 1 ELSE 0 END) AS priority_urgent
        FROM dbl_raise_ticket AS rt 
        WHERE status = 1;
    `
}


let monthWiseTicketCount = () => {
    return `
        SELECT 
            COUNT(CASE WHEN status = 1 THEN id END) AS total_ticket,
            COUNT(CASE WHEN status = 1 AND ticket_status = 'solved' THEN id END) AS total_solved
        FROM dbl_raise_ticket
        WHERE created_at >= NOW() - INTERVAL 30 DAY;
    `
}


let graphTicketTotalData = () => {
    return `
      SELECT 
        MONTH(created_at) as month,
        COUNT(id) as raiseTickets 
      FROM 
        dbl_raise_ticket 
      WHERE 
        status = 1 
        AND created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY 
        MONTH(created_at)
      ORDER BY 
        MONTH(created_at) DESC
    `;
  };

let graphTicketTotalSolveData = () => {
    return `
      SELECT 
        MONTH(created_at) as month,
        COUNT(id) as solvedTickets 
      FROM 
        dbl_raise_ticket 
      WHERE 
        status = 1  AND ticket_status = 'solved'
        AND created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY 
        MONTH(created_at)
      ORDER BY 
        MONTH(created_at) DESC
    `;
};



let existsUnitHasAssign = () => {
    return `SELECT * FROM admin_search_access  where  unit_id = ? `;
}

let existsCategoryHasAssign = () => {
    return `SELECT * FROM dbl_user_category_access  where  category_id = ? `;
}



let getSuperAdminTicketReport = (key, priority, category, unit, status,from_date, to_date, offset, limit) => {
    let baseQuery = `
    SELECT ticket_table_id, ticket_id, ticket_status ,subject, priority, ticket_category_title, asset_serial_number,
    ticket_created_employee_name, ticket_created_employee_id,
    ticket_solved_employee_name, ticket_solved_employee_id, asset_unit_title, ticket_updated_at, asset_unit_id,ticket_created_at
    FROM super_admin_ticket_view
    `;

    let conditions = [];

    if (unit) {
        conditions.push(`asset_unit_id = '${unit}'`);
    }
    if (status) {
        conditions.push(`ticket_status = '${status}'`);
    }
    if (priority) {
        conditions.push(`priority = '${priority}'`);
    }
    if (category) {
        conditions.push(`ticket_category_title = '${category}'`);
    }
    if (from_date && to_date) {
        conditions.push(`ticket_created_at BETWEEN '${from_date} 00:00:00' AND '${to_date} 23:59:59'`);
    }
    if (key) {
        conditions.push(`(
            subject LIKE '%${key}%' 
            OR ticket_id LIKE '%${key}%' 
            OR ticket_solved_employee_name LIKE '%${key}%' 
            OR ticket_created_employee_name LIKE '%${key}%' 
            OR ticket_solved_employee_id LIKE '%${key}%' 
            OR ticket_created_employee_id LIKE '%${key}%'
        )`);
    }
    if (from_date && to_date) {
        conditions.push(`ticket_updated_at BETWEEN '${from_date}' AND '${to_date}'`);
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


let getSuperAdminTicketReportTotalCount = (key, priority, category, unit,status ,from_date, to_date) => {
    
    let baseQuery = `
    SELECT ticket_table_id, ticket_id, ticket_status,subject, priority, ticket_category_title, asset_serial_number,
    ticket_created_employee_name, ticket_created_employee_id,
    ticket_solved_employee_name, ticket_solved_employee_id, asset_unit_title, ticket_updated_at, asset_unit_id,ticket_created_at
    FROM super_admin_ticket_view
    `;

    let conditions = [];

    if (unit) {
        conditions.push(`asset_unit_id = '${unit}'`);
    }
    if (status) {
        conditions.push(`ticket_status = '${status}'`);
    }
    if (priority) {
        conditions.push(`priority = '${priority}'`);
    }
    if (category) {
        conditions.push(`ticket_category_title = '${category}'`);
    }
    if (from_date && to_date) {
        conditions.push(`ticket_created_at BETWEEN '${from_date} 00:00:00' AND '${to_date} 23:59:59'`);
    }
    if (key) {
        conditions.push(`(
            subject LIKE '%${key}%' 
            OR ticket_id LIKE '%${key}%' 
            OR ticket_solved_employee_name LIKE '%${key}%' 
            OR ticket_created_employee_name LIKE '%${key}%' 
            OR ticket_solved_employee_id LIKE '%${key}%' 
            OR ticket_created_employee_id LIKE '%${key}%'
        )`);
    }
    if (from_date && to_date) {
        conditions.push(`ticket_updated_at BETWEEN '${from_date}' AND '${to_date}'`);
    }

    if (conditions.length > 0) {
        baseQuery += " WHERE " + conditions.join(" AND ");
    }

    return baseQuery;
};




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
    getAdminWiseTicketById,
    getSuperAdminTicketTotalCount,
    getAllListTotalCountUserWise,
    getAdminWiseTicketTotalCount,
    ticketCountingData,
    getTicketTotalSolved,
    getTicketTotalUnsolved,
    getTicketTotalForward,
    getTicketTotalInprogress,
    getTopSolvedTicketList,
    priorityBaseTicketList,
    categoryBaseTicketList,
    monthWiseTicketCount,
    graphTicketTotalData,
    graphTicketTotalSolveData,
    existsUnitHasAssign,
    existsCategoryHasAssign,
    getSuperAdminTicketReport,
    getSuperAdminTicketReportTotalCount

}