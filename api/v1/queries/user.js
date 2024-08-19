let table_name = "new_admin";


let getUserByEmail = () => {
    return `SELECT * FROM ${table_name} where  email = ? and status = 1 `;
}

let addNew = () => {
    return `INSERT INTO ${table_name} SET ?`;
}


let getUserInfo = () => {
    return `SELECT * FROM ${table_name} where  email = ? and password = ? and status = 1 `;
}


module.exports = {
    
    getUserByEmail,
    addNew,
    getUserInfo
}