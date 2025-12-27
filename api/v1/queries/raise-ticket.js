const isEmpty = require("is-empty");
let table_name = "dbl_raise_ticket";
let ticket_archive_table = "dbl_raise_ticket_archive";
let admin_wise_ticket_view = "admin_wise_ticket";
let up_coming_ticket = "up_coming_ticket_view";
let super_admin_ticket_view = "super_admin_ticket_view";
let re_raise_table_name = "dbl_ticket_re_raise_tracking"
let archive_table = "dbl_raise_ticket_archive"
let admin_wise_ticket_archive = "admin_wise_ticket_archive"
let super_admin_archive_ticket_view = "super_admin_archive_ticket_view"


let getList = () => {
  return `SELECT id,location, unit_id FROM ${table_name} WHERE status = 1 ORDER BY id DESC `;
};
let getAllList = () => {
  return `SELECT id,location, unit_id,status FROM ${table_name} WHERE status != 0 ORDER BY id DESC `;
};

let getTicketAllListForArchive = () => {
  return `SELECT * FROM ${table_name}`;
};

let getTicketAllListForArchiveData = () => {
  return `SELECT count(id) FROM ${archive_table}`;
};
let getTicketAllListCount = () => {
  return `SELECT count(id) FROM ${table_name}`;
};

let ticketTableFormat = () => {
  return `DELETE FROM dbl_raise_ticket`;
};

let getAllLocationDataByUnitId = () => {
  return `SELECT id,location,unit_id,status FROM ${table_name} WHERE unit_id = ? and status = 1 ORDER BY id DESC `;
};

let getUnitSuperAdminTicket = (key, priority, status, unitIds,location_id, offset, limit) => {
  let conditions = [];

  // Filter by unitIds
  if (unitIds && unitIds.length > 0) {
    const unitIdList = unitIds.join(","); // e.g. "4,21,20,19,22"
    conditions.push(`asset_unit_id IN (${unitIdList})`);
  }

  if (priority) {
    conditions.push(`priority = '${priority}'`);
  }
  if (status) {
    conditions.push(`ticket_status = '${status}'`);
  }
  if (key) {
    conditions.push(`(subject LIKE '%${key}%' OR ticket_id LIKE '%${key}%')`);
  }
  if (location_id) {
    conditions.push(`seating_location = '${location_id}'`);
  }
  // ✅ Add your new condition
   conditions.push(`ticket_status = 'solved'`);

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Pagination clause
  const paginationClause = `LIMIT ${limit} OFFSET ${offset}`;

  let query = `
        SELECT 
            *
        FROM 
            ${super_admin_ticket_view} 
        ${whereClause}
        ${paginationClause}
    `;

  return query;
};


let getUnitSuperAdminTicketCount = (key, priority, status,unitIds,location_id) => {
  let conditions = [];

  // Filter by unitIds
  if (unitIds && unitIds.length > 0) {
    const unitIdList = unitIds.join(","); // e.g. "4,21,20,19,22"
    conditions.push(`asset_unit_id IN (${unitIdList})`);
  }

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
  
  if (location_id) {
    conditions.push(`seating_location = '${location_id}'`);
  }

  // ✅ Add your new condition
    conditions.push(`ticket_status = 'solved'`);
  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Build query parts conditionally
  let query = `
        SELECT 
            * 
        FROM 
            ${super_admin_ticket_view} 
        ${whereClause}
    `;

  return query;
};



let getUnitSuperAdminPendingTicket = (key, priority, status, unitIds, location_id,offset, limit) => {
  let conditions = [];

  // Filter by unitIds
  if (unitIds && unitIds.length > 0) {
    const unitIdList = unitIds.join(","); // e.g. "4,21,20,19,22"
    conditions.push(`asset_unit_id IN (${unitIdList})`);
  }

  if (priority) {
    conditions.push(`priority = '${priority}'`);
  }
  if (status) {
    conditions.push(`ticket_status = '${status}'`);
  }
  if (key) {
    conditions.push(`(subject LIKE '%${key}%' OR ticket_id LIKE '%${key}%')`);
  }
  if (location_id) {
    conditions.push(`seating_location = '${location_id}'`);
  }
  // ✅ Add your new condition
  conditions.push(`ticket_status != 'solved'`);

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Pagination clause
  const paginationClause = `LIMIT ${limit} OFFSET ${offset}`;

  let query = `
        SELECT 
            *
        FROM 
            ${super_admin_ticket_view} 
        ${whereClause}
        ${paginationClause}
    `;

  return query;
};


let getUnitSuperAdminPendingTicketCount = (key, priority, status,unitIds,location_id) => {
  let conditions = [];

  // Filter by unitIds
  if (unitIds && unitIds.length > 0) {
    const unitIdList = unitIds.join(","); // e.g. "4,21,20,19,22"
    conditions.push(`asset_unit_id IN (${unitIdList})`);
  }

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
  if (location_id) {
    conditions.push(`seating_location = '${location_id}'`);
  }
  // ✅ Add your new condition
   conditions.push(`ticket_status != 'solved'`);
  // conditions.push(`user_id = ?`);
  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Build query parts conditionally
  let query = `
        SELECT 
            * 
        FROM 
            ${super_admin_ticket_view} 
        ${whereClause}
    `;

  return query;
};





let getAdminWiseTicket = (key, priority, status,location_id,offset, limit) => {
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
  if (location_id) {
    conditions.push(`seating_location_id = '${location_id}'`);
  }
  // Base condition for user_id
  conditions.push(`user_id = ? AND ticket_solved_employee_user_id = ? AND ticket_status='solved'`);
  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

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


let getAdminWiseTicketTotalCount = (key, priority, status,location_id) => {
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
  if (location_id) {
    conditions.push(`seating_location_id = '${location_id}'`);
  }

  // Base condition for user_id
  conditions.push(`user_id = ? AND ticket_solved_employee_user_id = ? AND ticket_status='solved'`);
  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

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

let getAdminWiseArchiveTicket = (key, priority, status,location_id,offset, limit) => {
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
  if (location_id) {
    conditions.push(`seating_location_id = '${location_id}'`);
  }
  // Base condition for user_id
  conditions.push(`user_id = ? AND ticket_solved_employee_user_id = ? AND ticket_status='solved'`);
  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Pagination clause
  const paginationClause = `LIMIT ${limit} OFFSET ${offset}`;

  // Build query parts conditionally
  let query = `
        SELECT 
            * 
        FROM 
            ${admin_wise_ticket_archive} 
        ${whereClause}
    `;

  query += ` ${paginationClause}`;

  return query;
};


let getAdminWiseArchiveTicketTotalCount = (key, priority, status,location_id) => {
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
  if (location_id) {
    conditions.push(`seating_location_id = '${location_id}'`);
  }

  // Base condition for user_id
  conditions.push(`user_id = ? AND ticket_solved_employee_user_id = ? AND ticket_status='solved'`);
  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Build query parts conditionally
  let query = `
        SELECT 
            * 
        FROM 
            ${admin_wise_ticket_archive} 
        ${whereClause}
    `;

  return query;
};
let getAdminWiseUpComingTicket = (key, priority, status, location_id,offset, limit) => {
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
  if (location_id) {
    conditions.push(`seating_location_id = '${location_id}'`);
  }

  // Base condition for user_id
  conditions.push(`user_id = ? AND ticket_status != 'solved' `);
  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Pagination clause
  const paginationClause = `LIMIT ${limit} OFFSET ${offset}`;

  // Build query parts conditionally
  let query = `
        SELECT 
            * 
        FROM 
            ${up_coming_ticket} 
        ${whereClause}
    `;

  query += ` ${paginationClause}`;

  return query;
};


let getAdminWiseTicketUpComingTotalCount = (key, priority, status,location_id) => {
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
  if (location_id) {
    conditions.push(`seating_location_id = '${location_id}'`);
  }

  // Base condition for user_id
  conditions.push(`user_id = ? AND  ticket_status != 'solved' `);
  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Build query parts conditionally
  let query = `
        SELECT 
            * 
        FROM 
            ${up_coming_ticket} 
        ${whereClause}
    `;

  return query;
};



let getSuperAdminTicket = (key, priority, status,location_id,offset, limit) => {
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

  if (location_id) {
    conditions.push(`seating_location = '${location_id}'`);
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

let getSuperAdminTicketTotalCount = (key, priority, status,location_id) => {
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

  if (location_id) {
    conditions.push(`seating_location = '${location_id}'`);
  }

  if (conditions.length > 0) {
    baseQuery += " WHERE " + conditions.join(" AND ");
  }
  return baseQuery;
};

let getAllListUserWise = (
  id,
  key = "",
  priority = "",
  status = "",
  offset,
  limit
) => {
  let conditions = [`rt.created_by = ${id}`, `rt.status = 1`];

  if (priority) {
    conditions.push(`rt.priority = '${priority}'`);
  }
  if (status) {
    conditions.push(`rt.ticket_status = '${status}'`);
  }
  if (key) {
    conditions.push(
      `(rt.subject LIKE '%${key}%' OR rt.ticket_id LIKE '%${key}%')`
    );
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

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
        u.employee_id AS ticket_solved_employee_id,
        u.unit_name AS ticket_solved_unit_name,
        u.contact_no AS ticket_solved_contact_no,
        u.email AS ticket_solved_email,
        u.department AS ticket_solved_department,
        u.designation AS ticket_solved_designation,
        auv.name AS action_by_name,
        auv.designation AS action_by_designation,
        auv.department AS action_by_department,
        auv.email AS action_by_email,
        auv.contact_no AS action_by_contact_no,
        auv.unit_name AS action_by_unit_name,
        auv.employee_id AS action_by_employee_id,
        tf.details AS forward_details,
        tf.remarks AS forward_remarks,
        tf.created_at AS forward_date,
        slac.priority AS sla_priority,
        slac.response_time_value AS response_time_value,
        slac.response_time_unit AS response_time_unit,
        slac.resolve_time_value AS resolve_time_value,
        slac.resolve_time_unit AS resolve_time_unit,
        onBu.name AS on_behalf_created_name,
        onBu.employee_id AS on_behalf_created_employee_id,
        lv.seating_location_name AS seating_location_name,
        lv.building_name AS complex_name,
        lv.unit_name AS seating_unit_name
    FROM 
        dbl_raise_ticket AS rt
    JOIN 
        dbl_asset_unit AS au ON au.id = rt.unit_id 
    JOIN 
        dbl_ticket_category AS tc ON tc.id = rt.category_id 
    LEFT JOIN 
        dbl_asset AS ass ON ass.id = rt.asset_id
    LEFT JOIN 
        users_view AS u ON u.id = rt.solved_by
    LEFT JOIN 
        users_view AS auv ON auv.id = rt.updated_by
    LEFT JOIN 
        dbl_ticket_forward AS tf ON tf.ticket_id = rt.id
    LEFT JOIN 
        dbl_sla_configuration AS slac ON slac.priority = rt.priority
    LEFT JOIN 
        users_view AS onBu ON onBu.id = rt.on_behalf_created_by
    LEFT JOIN 
        location_building_unit_view AS lv ON lv.seating_location_id = rt.seating_location
    ${whereClause}
    ORDER BY 
        rt.id DESC
    ${paginationClause};
  `;
};

let getAllListTotalCountUserWise = (
  id,
  key = "",
  priority = "",
  status = ""
) => {
  let conditions = [`rt.created_by = ${id}`, `rt.status = 1`];

  if (priority) {
    conditions.push(`rt.priority = '${priority}'`);
  }
  if (status) {
    conditions.push(`rt.ticket_status = '${status}'`);
  }
  if (key) {
    conditions.push(
      `(rt.subject LIKE '%${key}%' OR rt.ticket_id LIKE '%${key}%')`
    );
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

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

let getAllListAdminWise = (id, key = "", priority = "", status = "") => {
  let conditions = [`rt.created_by = ${id}`, `rt.status = 1`];

  if (priority) {
    conditions.push(`rt.priority = '${priority}'`);
  }
  if (status) {
    conditions.push(`rt.ticket_status = '${status}'`);
  }
  if (key) {
    conditions.push(
      `(rt.subject LIKE '%${key}%' OR rt.ticket_id LIKE '%${key}%')`
    );
  }
  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

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
};

let getUnitWiseLocation = () => {
  return `SELECT * FROM ${table_name}  where location = ? and unit_id = ? and status = 1`;
};

let getOnlyDataList = () => {
  return `SELECT * FROM ${table_name}  where status != 0 `;
};

let getActiveList = () => {
  return `SELECT * FROM ${table_name}  where status = 'active'`;
};

let getByTitle = () => {
  return `SELECT * FROM ${table_name} where  title = ? and status = 'active'`;
};

let getById = () => {
  return `SELECT * FROM ${table_name} where  id = ?  and status = 1 `; // added status = 1
};

let superAdminData = () => {
  return `SELECT * FROM ${super_admin_ticket_view} where  ticket_table_id = ? `; 
};


let adminWiseUnitAndCategory = () => {
  return `SELECT * FROM admin_wise_ticket where  asset_unit_id = ?  and ticket_category_id = ? `;
};

let employeeWiseTicket = () => {
  return `SELECT * FROM ${table_name} where  id = ? and created_by = ?`;
};

let adminWiseTicketDetails = () => {
  return `SELECT * FROM ${admin_wise_ticket_view} where  user_id = ? and ticket_table_id = ? `;
};

let addNew = () => {
  return `INSERT INTO ${table_name} SET ?`;
};

let addNewArchiveData = () => {
  return `INSERT INTO ${ticket_archive_table} SET ?`;
};


let addNewTrackingData = () => {
  return `INSERT INTO ${re_raise_table_name} SET ?`;
};


const updateById = () => {
  return `UPDATE ${table_name} SET ? WHERE id = ?`;
};

let getUnitAndCategoryWiseEmail = () => {
  return `SELECT * FROM ${admin_wise_ticket_view} where  seating_location_id = ? and ticket_category_id = ? `;
};

let getAdminWiseTicketById = () => {
  return `SELECT * FROM ${admin_wise_ticket_view}  where  user_id = ? and ticket_table_id = ?`;
};

// ticket dashboard counting data
let ticketCountingData = () => {
  return `SELECT count(id) as total_ticket FROM ${table_name} where status = 1 `;
};


let getTicketTotalSolved = () => {
  return `SELECT count(id) as total_solved FROM ${table_name} where ticket_status = 'solved' and status = 1 `;
};

let getTicketTotalUnsolved = () => {
  return `SELECT count(id) as total_unsolved FROM ${table_name} where ticket_status = 'unsolved' and status = 1 `;
};

let getTicketTotalForward = () => {
  return `SELECT count(id) as total_forward FROM ${table_name} where ticket_status = 'forward' and status = 1`;
};
let getTicketTotalInprogress = () => {
  return `SELECT count(id) as total_inprogress FROM ${table_name} where ticket_status = 'inprogress' and status = 1`;
};

let getTicketTotalAvgTime = () => {
  return `SELECT 
    COUNT(id) AS ticket_count,
    CASE 
        WHEN COUNT(id) > 0 
        THEN TIME_FORMAT(SEC_TO_TIME(SUM(TIMESTAMPDIFF(SECOND, created_at, updated_at)) / COUNT(id)), '%H:%i:%s')
        ELSE '00:00:00'
    END AS total_avg_time
FROM ${table_name}
WHERE ticket_status = 'solved' AND status = 1;
`;
};

let getTicketAdminTotalAvgTime = () => {
  return `
  
SELECT 
    COUNT(id) AS ticket_count,
    CASE 
        WHEN COUNT(id) > 0 
        THEN TIME_FORMAT(
                SEC_TO_TIME(
                    SUM(TIMESTAMPDIFF(SECOND, created_at, updated_at)) / COUNT(id)
                ),
                '%H:%i:%s'
             )
        ELSE '00:00:00'
    END AS total_avg_time
FROM ${table_name}
WHERE solved_by = ? 
  AND ticket_status = 'solved' 
  AND status = 1;


`;
};

let ticketAdminCountingData = () => {
  return `SELECT count(id) as total_ticket FROM ${table_name} where solved_by = ?  AND status = 1`;
};
let getAdminTicketTotalSolved = () => {
  return `SELECT count(id) as total_solved FROM ${table_name} where solved_by = ? AND ticket_status = 'solved'  AND status = 1`;
};

let getAdminTicketTotalUnsolved = () => {
  return `SELECT count(ticket_table_id) as total_unsolved FROM ${up_coming_ticket} where user_id = ? AND ticket_status = 'unsolved'  AND status = 1`;
};

let getAdminTicketTotalForward = () => {
  return `SELECT count(id) as total_forward FROM ${table_name} where solved_by = ? AND ticket_status = 'forward'  AND status = 1`;
};
let getAdminTicketTotalInprogress = () => {
  return `SELECT count(id) as total_inprogress FROM ${table_name} where updated_by = ? AND ticket_status = 'inprogress'  AND status = 1`;
};

let getTopSolvedTicketList = () => {
  return `
        SELECT 
        u.id AS id, 
        u.name AS solved_by_name, 
        u.employee_id AS employee_id, 
        uv.email, 
        uv.contact_no, 
        uv.unit_name,
        COUNT(rt.id) AS solved_ticket_count
    FROM 
        dbl_database.dbl_raise_ticket AS rt
    LEFT JOIN 
        dbl_users AS u 
        ON u.id = rt.solved_by 
    LEFT JOIN 
        users_view AS uv 
        ON rt.solved_by = uv.id 
    WHERE 
        rt.status = 1 
        AND rt.ticket_status = 'solved'
        AND u.status = 1 
        AND uv.status = 1
    GROUP BY 
        rt.solved_by, 
        u.id, u.name, u.employee_id, uv.email, uv.contact_no, uv.unit_name
    ORDER BY 
        solved_ticket_count DESC 
    LIMIT 15;

        `;
};

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
        ON tc.id = rt.category_id 
      AND rt.status = 1   
    WHERE 
        tc.status = 'active'
    GROUP BY 
        tc.id, tc.title
    ORDER BY 
        ticket_count DESC;
    `;
};

let UnitSuperAdminPriorityBaseTicketList = () => {
  return `
    SELECT 
        tc.id AS category_id,
        tc.title AS category_title,
        COUNT(rt.id) AS ticket_count
    FROM 
        dbl_ticket_category AS tc
    LEFT JOIN 
        dbl_raise_ticket AS rt 
        ON tc.id = rt.category_id 
      AND rt.status = 1 AND unit_id in (?)  
    WHERE 
        tc.status = 'active'
    GROUP BY 
        tc.id, tc.title
    ORDER BY 
        ticket_count DESC;
    `;
};



let priorityBaseTicketListForAdmin = () => {
  return `

    SELECT 
        tc.id AS category_id,
        tc.title AS category_title,
        COUNT(rt.id) AS ticket_count
    FROM 
        dbl_ticket_category AS tc
    LEFT JOIN 
        dbl_raise_ticket AS rt 
        ON tc.id = rt.category_id 
      AND rt.status = 1 AND rt.solved_by = ?
    WHERE 
        tc.status = 'active'
    GROUP BY 
        tc.id, tc.title
    ORDER BY 
        ticket_count DESC;
      
    `;
};

let categoryBaseTicketList = () => {
  return `
           SELECT 
            SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) AS priority_high,
            SUM(CASE WHEN priority = 'low' THEN 1 ELSE 0 END) AS priority_low,
            SUM(CASE WHEN priority = 'medium' THEN 1 ELSE 0 END) AS priority_medium,
            SUM(CASE WHEN priority = 'urgent' THEN 1 ELSE 0 END) AS priority_urgent
        FROM dbl_raise_ticket AS rt 
        WHERE status = 1;
    `;
};

let categoryBaseTicketListAdmin = () => {
  return `
        SELECT 
            SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) AS priority_high,
            SUM(CASE WHEN priority = 'low' THEN 1 ELSE 0 END) AS priority_low,
            SUM(CASE WHEN priority = 'medium' THEN 1 ELSE 0 END) AS priority_medium,
            SUM(CASE WHEN priority = 'urgent' THEN 1 ELSE 0 END) AS priority_urgent
        FROM ${table_name} 
        WHERE solved_by = ? AND status = 1;
    `;
};

let categoryBaseTicketListUnitSuperAdmin = () => {
  return `
        SELECT 
            SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) AS priority_high,
            SUM(CASE WHEN priority = 'low' THEN 1 ELSE 0 END) AS priority_low,
            SUM(CASE WHEN priority = 'medium' THEN 1 ELSE 0 END) AS priority_medium,
            SUM(CASE WHEN priority = 'urgent' THEN 1 ELSE 0 END) AS priority_urgent
        FROM ${table_name} 
        WHERE unit_id in (?) AND status = 1;
    `;
};


let monthWiseTicketCount = () => {
  return `
        SELECT 
            COUNT(CASE WHEN status = 1 THEN id END) AS total_ticket,
            COUNT(CASE WHEN status = 1 AND ticket_status = 'solved' THEN id END) AS total_solved,
            COUNT(CASE WHEN status = 1 AND ticket_status = 'unsolved' THEN id END) AS total_unsolved
        FROM dbl_raise_ticket
        WHERE created_at >= NOW() - INTERVAL 30 DAY;
    `;
};

let monthWiseTicketCountAdmin = () => {
  return `
        SELECT 
    COUNT(CASE WHEN status = 1 THEN ticket_table_id END) AS total_ticket,
    COUNT(CASE WHEN status = 1 AND ticket_status = 'solved' THEN ticket_table_id END) AS total_solved,
    COUNT(CASE WHEN status = 1 AND ticket_status = 'unsolved' THEN ticket_table_id END) AS total_unsolved
    FROM 
         ${admin_wise_ticket_view}
    WHERE 
        ticket_created_at >= NOW() - INTERVAL 30 DAY
        AND user_id = ? AND status = 1;

    `;
};

let monthWiseTicketCountUnitSuperAdmin = () => {
  return `
        SELECT 
    COUNT(CASE WHEN status = 1 THEN id END) AS total_ticket,
    COUNT(CASE WHEN status = 1 AND ticket_status = 'solved' THEN id END) AS total_solved,
    COUNT(CASE WHEN status = 1 AND ticket_status = 'unsolved' THEN id END) AS total_unsolved
    FROM 
        ${table_name}
    WHERE 
        created_at >= NOW() - INTERVAL 30 DAY
        AND unit_id in (?) AND status = 1;

    `;
};


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

let graphTicketTotalDataAdmin = () => {
  return `
      SELECT 
        MONTH(ticket_created_at) as month,
        COUNT(ticket_table_id) as raiseTickets 
      FROM 
        up_coming_ticket_view 
      WHERE 
        status = 1 AND user_id = ? 
        AND ticket_created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY 
        MONTH(ticket_created_at)
      ORDER BY 
        MONTH(ticket_created_at) DESC
    `;
};


let graphTicketTotalDataUnitSuperAdmin = () => {
  return `
      SELECT 
        MONTH(created_at) as month,
        COUNT(id) as raiseTickets 
      FROM 
        ${table_name} 
      WHERE 
        status = 1 AND unit_id in (?) 
        AND created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY 
        MONTH(created_at)
      ORDER BY 
        MONTH(created_at) DESC
    `;
};


let graphTicketTotalSolveDataAdmin = () => {
  return `
      SELECT 
        MONTH(created_at) as month,
        COUNT(id) as solvedTickets 
      FROM 
         ${table_name}  
      WHERE 
        status = 1 AND solved_by = ?  AND ticket_status = 'solved'
        AND created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY 
        MONTH(created_at)
      ORDER BY 
        MONTH(created_at) DESC
    `;
};

let graphTicketTotalSolveDataUnitSuperAdmin = () => {
  return `
      SELECT 
        MONTH(created_at) as month,
        COUNT(id) as solvedTickets 
      FROM 
         ${table_name}  
      WHERE 
        status = 1 AND unit_id in (?)  AND ticket_status = 'solved'
        AND created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY 
        MONTH(created_at)
      ORDER BY 
        MONTH(created_at) DESC
    `;
};

let graphTicketTotalUnSolveDataAdmin = () => {
  return `
      SELECT 
        MONTH(ticket_created_at) as month,
        COUNT(ticket_table_id) as unsolvedTickets 
      FROM 
         up_coming_ticket_view   
      WHERE 
        status = 1 AND user_id = ?  AND ticket_status = 'unsolved'
        AND ticket_created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY 
        MONTH(ticket_created_at)
      ORDER BY 
        MONTH(ticket_created_at) DESC
    `;
};


let graphTicketTotalUnSolveDataUnitSuperAdmin = () => {
  return `
      SELECT 
        MONTH(created_at) as month,
        COUNT(id) as unsolvedTickets 
      FROM 
        dbl_raise_ticket 
      WHERE 
        status = 1 AND unit_id in (?)  AND ticket_status = 'unsolved'
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
let graphTicketTotalUnSolveData = () => {
  return `
      SELECT 
        MONTH(created_at) as month,
        COUNT(id) as unsolvedTickets 
      FROM 
        dbl_raise_ticket 
      WHERE 
        status = 1  AND ticket_status = 'unsolved'
        AND created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY 
        MONTH(created_at)
      ORDER BY 
        MONTH(created_at) DESC
    `;
};

let existsUnitHasAssign = () => {
  return `SELECT * FROM admin_search_access  where  unit_id = ? `;
};

let existsCategoryHasAssign = () => {
  return `SELECT * FROM dbl_user_category_access  where  category_id = ? `;
};

let getSuperAdminTicketReport = (
  key,
  priority,
  category,
  unit,
  status,
  from_date,
  to_date,
  offset,
  limit
) => {
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
    conditions.push(`ticket_category_id = '${category}'`);
  }
  if (from_date && to_date) {
    conditions.push(
      `ticket_created_at BETWEEN '${from_date}' AND '${to_date}'`
    );
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
    conditions.push(
      `ticket_updated_at BETWEEN '${from_date}' AND '${to_date}'`
    );
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



let ticketReportList = (
  limit = 50, offset = 0, key, start_date, end_date, category, priority, unit, status, user_id,
) => {
  let baseQuery = `
    SELECT ticket_table_id, ticket_id, ticket_status, subject, priority, ticket_category_title, 
           ticket_created_employee_name, ticket_created_employee_id,
           ticket_solved_employee_name, ticket_solved_employee_id, asset_unit_title,
           ticket_updated_at, asset_unit_id, ticket_created_at, seating_unit_name,
           complex_name, seating_location_name
    FROM super_admin_ticket_view
  `;

  let conditions = [];

  if (unit) conditions.push(`asset_unit_id = '${unit}'`);
  if (user_id) conditions.push(`ticket_solved_employee_user_id = '${user_id}'`);
  if (status) conditions.push(`ticket_status = '${status}'`);
  if (priority) conditions.push(`priority = '${priority}'`);
  if (category) conditions.push(`ticket_category_id = '${category}'`);
  if (start_date && end_date) conditions.push(`ticket_created_at BETWEEN '${start_date}' AND '${end_date}'`);
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

  if (conditions.length > 0) {
    baseQuery += " WHERE " + conditions.join(" AND ");
  }

  // Always add pagination
  baseQuery += ` LIMIT ${limit} OFFSET ${offset}`;

  return baseQuery;
};



let ticketAdminReportList = (
  limit = 50, offset = 0, key, start_date, end_date, category,
  priority, unit, status, user_id, unitIds
) => {
  let baseQuery = `
    SELECT ticket_table_id, ticket_id, ticket_status, subject, priority, ticket_category_title, 
           ticket_created_employee_name, ticket_created_employee_id,
           ticket_solved_employee_name, ticket_solved_employee_id, asset_unit_title,
           ticket_updated_at, asset_unit_id, ticket_created_at, seating_unit_name,
           complex_name, seating_location_name
    FROM super_admin_ticket_view
  `;

  let conditions = [];
  // ⭐ Add unitIds array condition: asset_unit_id IN (...)
  if (unitIds && Array.isArray(unitIds) && unitIds.length > 0) {
    const idList = unitIds.map(id => `'${id}'`).join(","); 
    conditions.push(`asset_unit_id IN (${idList})`);
  }

  if (unit) conditions.push(`asset_unit_id = '${unit}'`);
  if (user_id) conditions.push(`ticket_solved_employee_user_id = '${user_id}'`);
  if (status) conditions.push(`ticket_status = '${status}'`);
  if (priority) conditions.push(`priority = '${priority}'`);
  if (category) conditions.push(`ticket_category_id = '${category}'`);

  if (start_date && end_date) {
    conditions.push(`ticket_created_at BETWEEN '${start_date}' AND '${end_date}'`);
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


  if (conditions.length > 0) {
    baseQuery += " WHERE " + conditions.join(" AND ");
  }

  baseQuery += ` LIMIT ${limit} OFFSET ${offset}`;

  return baseQuery;
};



let ticketReportListCount = (
 key, start_date, end_date, category, priority, unit, status, user_id, overdue
) => {
  let baseQuery = `
    SELECT ticket_table_id
    FROM super_admin_ticket_view
  `;

  let conditions = [];

  if (unit) conditions.push(`asset_unit_id = '${unit}'`);
  if (user_id) conditions.push(`ticket_solved_employee_user_id = '${user_id}'`);
  if (status) conditions.push(`ticket_status = '${status}'`);
  if (priority) conditions.push(`priority = '${priority}'`);
  if (category) conditions.push(`ticket_category_id = '${category}'`);
  if (start_date && end_date) conditions.push(`ticket_created_at BETWEEN '${start_date}' AND '${end_date}'`);
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

  if (conditions.length > 0) {
    baseQuery += " WHERE " + conditions.join(" AND ");
  }


  return baseQuery;
};

let ticketAdminReportListCount = (
 key, start_date, end_date, category, priority, unit, status, user_id, unitIds
) => {
  let baseQuery = `
    SELECT ticket_table_id
    FROM super_admin_ticket_view
  `;

  let conditions = [];
  // ⭐ Add unitIds array condition: asset_unit_id IN (...)
  if (unitIds && Array.isArray(unitIds) && unitIds.length > 0) {
    const idList = unitIds.map(id => `'${id}'`).join(","); 
    conditions.push(`asset_unit_id IN (${idList})`);
  }

  if (unit) conditions.push(`asset_unit_id = '${unit}'`);
  if (user_id) conditions.push(`ticket_solved_employee_user_id = '${user_id}'`);
  if (status) conditions.push(`ticket_status = '${status}'`);
  if (priority) conditions.push(`priority = '${priority}'`);
  if (category) conditions.push(`ticket_category_id = '${category}'`);
  if (start_date && end_date) conditions.push(`ticket_created_at BETWEEN '${start_date}' AND '${end_date}'`);
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

  if (conditions.length > 0) {
    baseQuery += " WHERE " + conditions.join(" AND ");
  }

  return baseQuery;
};

let ticketReport = (
 key,start_date,end_date,category,priority,unit,status,user_id
) => {
  let baseQuery = `
    SELECT ticket_table_id, ticket_id, ticket_status ,subject, priority, ticket_category_title, asset_serial_number,
    ticket_created_employee_name, ticket_created_employee_id,
    ticket_solved_employee_name, ticket_solved_employee_id, asset_unit_title, ticket_updated_at, asset_unit_id,ticket_created_at,seating_unit_name,complex_name,seating_location_name
    FROM super_admin_ticket_view
    `;

  let conditions = [];

  if (unit) {
    conditions.push(`asset_unit_id = '${unit}'`);
  }
  if (user_id) {
    conditions.push(`ticket_solved_employee_user_id = '${user_id}'`);
  }
  if (status) {
    conditions.push(`ticket_status = '${status}'`);
  }
  if (priority) {
    conditions.push(`priority = '${priority}'`);
  }
  if (category) {
    conditions.push(`ticket_category_id = '${category}'`);
  }

  if (start_date && end_date) {
    conditions.push(
      `ticket_created_at BETWEEN '${start_date}' AND '${end_date}'`
    );
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


if (conditions.length > 0) { baseQuery += " WHERE " + conditions.join(" AND "); }
  return baseQuery;
};



let ticketAdminReport = (
 key,start_date,end_date,category,priority,unit,status,user_id,unitIds
) => {
  let baseQuery = `
    SELECT ticket_table_id, ticket_id, ticket_status ,subject, priority, ticket_category_title, asset_serial_number,
    ticket_created_employee_name, ticket_created_employee_id,
    ticket_solved_employee_name, ticket_solved_employee_id, asset_unit_title, ticket_updated_at, asset_unit_id,ticket_created_at,seating_unit_name,complex_name,seating_location_name
    FROM super_admin_ticket_view
    `;

  let conditions = [];
  // ⭐ Add unitIds array condition: asset_unit_id IN (...)
  if (unitIds && Array.isArray(unitIds) && unitIds.length > 0) {
    const idList = unitIds.map(id => `'${id}'`).join(","); 
    conditions.push(`asset_unit_id IN (${idList})`);
  }
  if (unit) {
    conditions.push(`asset_unit_id = '${unit}'`);
  }
  if (user_id) {
    conditions.push(`ticket_solved_employee_user_id = '${user_id}'`);
  }
  if (status) {
    conditions.push(`ticket_status = '${status}'`);
  }
  if (priority) {
    conditions.push(`priority = '${priority}'`);
  }
  if (category) {
    conditions.push(`ticket_category_id = '${category}'`);
  }

  if (start_date && end_date) {
    conditions.push(
      `ticket_created_at BETWEEN '${start_date}' AND '${end_date}'`
    );
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


if (conditions.length > 0) { baseQuery += " WHERE " + conditions.join(" AND "); }
  return baseQuery;
};

let getSuperAdminTicketReportTotalCount = (
  key,
  priority,
  category,
  unit,
  status,
  from_date,
  to_date
) => {
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
    conditions.push(`ticket_category_id = '${category}'`);
  }
  if (from_date && to_date) {
    conditions.push(
      `ticket_created_at BETWEEN '${from_date}' AND '${to_date}'`
    );
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
  if (conditions.length > 0) {
    baseQuery += " WHERE " + conditions.join(" AND ");
  }

  return baseQuery;
};


let getUnitWiseSuperAdminCount = () => {
  return `
   SELECT 
    COUNT(id) AS total_ticket,
    SUM(CASE WHEN ticket_status = 'solved' THEN 1 ELSE 0 END) AS total_solved,
    SUM(CASE WHEN ticket_status = 'unsolved' THEN 1 ELSE 0 END) AS total_unsolved,
    SUM(CASE WHEN ticket_status = 'forward' THEN 1 ELSE 0 END) AS total_forward,
    SUM(CASE WHEN ticket_status = 'inprogress' THEN 1 ELSE 0 END) AS total_inprogress,
   CASE 
    WHEN SUM(CASE WHEN ticket_status = 'solved' THEN 1 ELSE 0 END) > 0
    THEN TIME_FORMAT(
            SEC_TO_TIME(
                SUM(CASE WHEN ticket_status = 'solved' 
                         THEN TIMESTAMPDIFF(SECOND, created_at, updated_at) 
                         ELSE 0 END
                ) / 
                SUM(CASE WHEN ticket_status = 'solved' THEN 1 ELSE 0 END)
            ),
            '%H:%i:%s'
         )
    ELSE '00:00:00'
END AS total_avg_time
FROM ${table_name}
WHERE unit_id IN (?) 
  AND status = 1;
  `;
};


let mobileDashboardDataCountEmployee = () => {
  return `
    SELECT
      (SELECT COUNT(id) FROM dbl_raise_ticket WHERE created_by = ? AND status = 1) AS total_ticket,
      (SELECT COUNT(id) FROM dbl_users WHERE status = 1) AS total_user,
      (SELECT COUNT(id) FROM dbl_asset_assign WHERE user_id = ? AND status = 1) AS total_asset
  `;
};


let mobileDashboardDataCountAdmin = () => {
  return `
    SELECT
      (SELECT COUNT(id) FROM dbl_raise_ticket WHERE solved_by = ? AND status = 1) AS total_ticket,
      (SELECT COUNT(id) FROM dbl_users WHERE status = 1) AS total_user,
      (SELECT COUNT(id) FROM dbl_asset WHERE unit_id IN (?) AND status = 1) AS total_asset,
      (SELECT COUNT(id) FROM dbl_tasks WHERE user_id = ? AND status = 1) AS total_task,
      (SELECT COUNT(id) FROM dbl_asset_assign WHERE user_id = ? AND status = 1) AS total_my_asset
    FROM dual;
  `;
};


let mobileDashboardDataCountSuperAdmin = () => {
  return `
    SELECT
      (SELECT COUNT(id) FROM dbl_raise_ticket WHERE status = 1) AS total_ticket,
      (SELECT COUNT(id) FROM dbl_users WHERE status = 1) AS total_user,
      (SELECT COUNT(id) FROM dbl_asset_assign WHERE status = 1) AS total_asset,
      (SELECT COUNT(id) FROM dbl_asset_assign WHERE user_id = ? AND status = 1) AS total_my_asset
  `;
};


let mobileDashboardDataCountUnitSuperAdmin = () => {
  return `
SELECT
  (SELECT COUNT(id) FROM dbl_raise_ticket WHERE unit_id IN (?) AND status = 1) AS total_ticket,
  (SELECT COUNT(id) FROM dbl_users WHERE status = 1) AS total_user,
  (SELECT COUNT(id) FROM dbl_asset WHERE unit_id IN (?) AND status = 1) AS total_asset,
   (SELECT COUNT(id) FROM dbl_asset_assign WHERE user_id = ? AND status = 1) AS total_my_asset
FROM dual;
  `;
};


let getAllListUserWiseArchive = (
  id,
  key = "",
  priority = "",
  status = "",
  offset,
  limit
) => {
  let conditions = [`rt.created_by = ${id}`, `rt.status = 1`];

  if (priority) {
    conditions.push(`rt.priority = '${priority}'`);
  }
  if (status) {
    conditions.push(`rt.ticket_status = '${status}'`);
  }
  if (key) {
    conditions.push(
      `(rt.subject LIKE '%${key}%' OR rt.ticket_id LIKE '%${key}%')`
    );
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

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
        u.employee_id AS ticket_solved_employee_id,
        u.unit_name AS ticket_solved_unit_name,
        u.contact_no AS ticket_solved_contact_no,
        u.email AS ticket_solved_email,
        u.department AS ticket_solved_department,
        u.designation AS ticket_solved_designation,
        auv.name AS action_by_name,
        auv.designation AS action_by_designation,
        auv.department AS action_by_department,
        auv.email AS action_by_email,
        auv.contact_no AS action_by_contact_no,
        auv.unit_name AS action_by_unit_name,
        auv.employee_id AS action_by_employee_id,
        tf.details AS forward_details,
        tf.remarks AS forward_remarks,
        tf.created_at AS forward_date,
        slac.priority AS sla_priority,
        slac.response_time_value AS response_time_value,
        slac.response_time_unit AS response_time_unit,
        slac.resolve_time_value AS resolve_time_value,
        slac.resolve_time_unit AS resolve_time_unit,
        onBu.name AS on_behalf_created_name,
        onBu.employee_id AS on_behalf_created_employee_id,
        lv.seating_location_name AS seating_location_name,
        lv.building_name AS complex_name,
        lv.unit_name AS seating_unit_name
    FROM 
        dbl_raise_ticket_archive AS rt
    JOIN 
        dbl_asset_unit AS au ON au.id = rt.unit_id 
    JOIN 
        dbl_ticket_category AS tc ON tc.id = rt.category_id 
    LEFT JOIN 
        dbl_asset AS ass ON ass.id = rt.asset_id
    LEFT JOIN 
        users_view AS u ON u.id = rt.solved_by
    LEFT JOIN 
        users_view AS auv ON auv.id = rt.updated_by
    LEFT JOIN 
        dbl_ticket_forward AS tf ON tf.ticket_id = rt.id
    LEFT JOIN 
        dbl_sla_configuration AS slac ON slac.priority = rt.priority
    LEFT JOIN 
        users_view AS onBu ON onBu.id = rt.on_behalf_created_by
    LEFT JOIN 
        location_building_unit_view AS lv ON lv.seating_location_id = rt.seating_location
    ${whereClause}
    ORDER BY 
        rt.id DESC
    ${paginationClause};
  `;
};

let getAllListTotalCountUserWiseArchive = (
  id,
  key = "",
  priority = "",
  status = ""
) => {
  let conditions = [`rt.created_by = ${id}`, `rt.status = 1`];

  if (priority) {
    conditions.push(`rt.priority = '${priority}'`);
  }
  if (status) {
    conditions.push(`rt.ticket_status = '${status}'`);
  }
  if (key) {
    conditions.push(
      `(rt.subject LIKE '%${key}%' OR rt.ticket_id LIKE '%${key}%')`
    );
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  return `
        SELECT 
            rt.*,  
            au.title AS unit_name, 
            tc.title AS category_name,
            ass.name AS asset_name,
            ass.category AS asset_category,
            ass.serial_number AS serial_number
        FROM 
            dbl_raise_ticket_archive AS rt
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



let getUnitSuperAdminArchiveTicket = (key, priority, status, unitIds,location_id, offset, limit) => {
  let conditions = [];

  // Filter by unitIds
  if (unitIds && unitIds.length > 0) {
    const unitIdList = unitIds.join(","); // e.g. "4,21,20,19,22"
    conditions.push(`asset_unit_id IN (${unitIdList})`);
  }

  if (priority) {
    conditions.push(`priority = '${priority}'`);
  }
  if (status) {
    conditions.push(`ticket_status = '${status}'`);
  }
  if (key) {
    conditions.push(`(subject LIKE '%${key}%' OR ticket_id LIKE '%${key}%')`);
  }
  if (location_id) {
    conditions.push(`seating_location = '${location_id}'`);
  }
  // ✅ Add your new condition
   conditions.push(`ticket_status = 'solved'`);

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Pagination clause
  const paginationClause = `LIMIT ${limit} OFFSET ${offset}`;

  let query = `
        SELECT 
            *
        FROM 
            ${super_admin_archive_ticket_view} 
        ${whereClause}
        ${paginationClause}
    `;

  return query;
};


let getUnitSuperAdminArchiveTicketCount = (key, priority, status,unitIds,location_id) => {
  let conditions = [];

  // Filter by unitIds
  if (unitIds && unitIds.length > 0) {
    const unitIdList = unitIds.join(","); // e.g. "4,21,20,19,22"
    conditions.push(`asset_unit_id IN (${unitIdList})`);
  }

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
  
  if (location_id) {
    conditions.push(`seating_location = '${location_id}'`);
  }

  // ✅ Add your new condition
    conditions.push(`ticket_status = 'solved'`);
  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Build query parts conditionally
  let query = `
        SELECT 
            * 
        FROM 
            ${super_admin_archive_ticket_view} 
        ${whereClause}
    `;

  return query;
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
  getSuperAdminTicketReportTotalCount,
  ticketAdminCountingData,
  getAdminTicketTotalSolved,
  getAdminTicketTotalUnsolved,
  getAdminTicketTotalForward,
  getAdminTicketTotalInprogress,
  categoryBaseTicketListAdmin,
  priorityBaseTicketListForAdmin,
  monthWiseTicketCountAdmin,
  graphTicketTotalDataAdmin,
  graphTicketTotalSolveDataAdmin,
  graphTicketTotalUnSolveData,
  graphTicketTotalUnSolveDataAdmin,
  adminWiseUnitAndCategory,
  getTicketTotalAvgTime,
  getTicketAdminTotalAvgTime,
  ticketReport,
  addNewTrackingData,
  superAdminData,
  getUnitSuperAdminTicket,
  getUnitSuperAdminTicketCount,
  getAdminWiseTicketUpComingTotalCount,
  getAdminWiseUpComingTicket,
  getUnitSuperAdminPendingTicketCount,
  getUnitSuperAdminPendingTicket,
  getTicketAllListForArchive,
  addNewArchiveData,
  getUnitWiseSuperAdminCount,
  UnitSuperAdminPriorityBaseTicketList,
  categoryBaseTicketListUnitSuperAdmin,
  monthWiseTicketCountUnitSuperAdmin,
  graphTicketTotalDataUnitSuperAdmin,
  graphTicketTotalSolveDataUnitSuperAdmin,
  graphTicketTotalUnSolveDataUnitSuperAdmin,
  mobileDashboardDataCountEmployee,
  mobileDashboardDataCountAdmin,
  mobileDashboardDataCountSuperAdmin,
  mobileDashboardDataCountUnitSuperAdmin,
  ticketReportList,
  ticketReportListCount,
  ticketAdminReportList,
  ticketAdminReportListCount,
  ticketAdminReport,
  getTicketAllListForArchiveData,
  ticketTableFormat,
  getTicketAllListCount,
  getAdminWiseArchiveTicket,
  getAdminWiseArchiveTicketTotalCount,
  getAllListUserWiseArchive,
getAllListTotalCountUserWiseArchive,
getUnitSuperAdminArchiveTicket,
getUnitSuperAdminArchiveTicketCount
};
