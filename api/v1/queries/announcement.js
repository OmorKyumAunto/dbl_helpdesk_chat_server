let table_name = "dbl_announcement";


let getUserByEmail = () => {
    return `SELECT * FROM ${table_name} where  email = ? and status = 1 `;
}

let addNew = () => {
    return `INSERT INTO ${table_name} SET ?`;
}


let getListMobileForSuperAdmin = (offset, limit) => {
return `
SELECT 
  a.id,
  a.title,
  a.description,
  a.announcement_date,
  a.break_time,
  a.unit_id,
  a.priority,
  u.title AS unit_name,
  us.name as created_by_name,
  us.employee_id as created_by_employee_id
FROM ${table_name} AS a
LEFT JOIN dbl_asset_unit AS u ON u.id = a.unit_id
LEFT JOIN dbl_users AS us ON us.id = a.created_by
WHERE a.status = 1
ORDER BY a.id DESC
LIMIT ${limit} OFFSET ${offset}
`;
}

let getListMobileForSuperAdminCount = () => {
    return `SELECT id FROM ${table_name} WHERE status = 1 ORDER BY id desc`;
}



let getListMobileForAdmin = (offset, limit) => {

    return `SELECT id,title,description,announcement_date,break_time,unit_id,priority FROM ${table_name} WHERE status = 1 AND (unit_id IN (?) OR unit_id IS NULL) ORDER BY id desc LIMIT ${limit} OFFSET ${offset}`;
}

let getListMobileForAdminCount = () => {
    return `SELECT id FROM ${table_name} WHERE status = 1 AND (unit_id IN (?) OR unit_id IS NULL) `;
}

let getListMobileForEmployee = (offset, limit) => {

    return `SELECT id,title,description,announcement_date,break_time,unit_id,priority FROM ${table_name} WHERE status = 1 AND (unit_id = ? OR unit_id IS NULL) ORDER BY id desc LIMIT ${limit} OFFSET ${offset}`;
}

let getListMobileForEmployeeCount = () => {
    return `SELECT id FROM ${table_name} WHERE status = 1 AND (unit_id = ? OR unit_id IS NULL) `;
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
    getListMobileForSuperAdmin,
    getByIdForDeleted,
    getByProfileId,
    getByEmployeeId,
    getListMobileForSuperAdminCount,
    getListMobileForAdmin,
    getListMobileForAdminCount,
    getListMobileForEmployee,getListMobileForEmployeeCount
}