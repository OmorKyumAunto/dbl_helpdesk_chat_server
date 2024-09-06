let table_name = "dbl_admins";


let getUserByEmail = () => {
    return `SELECT * FROM ${table_name} where  email = ? and status = 1 `;
}

let addNew = () => {
    return `INSERT INTO ${table_name} SET ?`;
}

let getList = () => {
    return `SELECT *  FROM  ${table_name} WHERE status = 1 order by id desc`;
}

let getUserInfo = () => {
    return `SELECT * FROM ${table_name} where  email = ? and password = ? and status = 1 `;
}

let getById = () => {
    return `SELECT * FROM ${table_name} where  id = ? and status = 1 `;
}

const updateById = () => {
    return `UPDATE ${table_name} SET ? WHERE id = ?`;
}


module.exports = {
    getUserByEmail,
    addNew,
    getUserInfo,
    getById,
    updateById,
    getList
}