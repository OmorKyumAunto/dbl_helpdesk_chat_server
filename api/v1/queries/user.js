let table_name = "dbl_users";


let getUserByEmail = () => {
    return `SELECT * FROM ${table_name} where  email = ? and status = 1 `;
}

let addNew = () => {
    return `INSERT INTO ${table_name} SET ?`;
}


let getUserInfo = () => {
    return `SELECT * FROM ${table_name} where  email = ? and password = ? and status = 1 `;
}

let getUserById = () => {
    return `SELECT  id,role_id,profile_id,employee_id,name,email,status FROM ${table_name} where  id = ?  and status = 1 `;
}

let getUserByEmployeeId = () => {
    return `SELECT  * FROM ${table_name} where  employee_id = ?  and status = 1 `;
}


const updateByEmployeeUser = () => {
    return `UPDATE ${table_name} SET ? WHERE profile_id = ?`;
}

const updateById = () => {
    return `UPDATE ${table_name} SET ? WHERE profile_id = ?`;
}

module.exports = {
    
    getUserByEmail,
    addNew,
    getUserInfo,
    getUserById,
    getUserByEmployeeId,
    updateByEmployeeUser,
    updateById
}