let table_name = "dbl_employee";
let table_name2 = "users_view";



let addNew = () => {
    return `INSERT INTO ${table_name} SET ?`;
}

let getByEmployee = () => {
    return `SELECT * FROM ${table_name} where employee_id = ? and status = 1`;
}


let getList = (offset, limit, key, unit_name) => {
    let searchCondition = '';

    if (key) {
        searchCondition += ` AND (LOWER(employee_id) LIKE LOWER('%${key}%') OR LOWER(name) LIKE LOWER('%${key}%'))`;
    }

    if (unit_name) {
        searchCondition += `AND UPPER(unit_name) LIKE UPPER('%${unit_name}%') `;
    }

    return `SELECT * FROM ${table_name2} WHERE status = 1 ${searchCondition} ORDER BY id desc LIMIT ${limit} OFFSET ${offset}`;
}




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

  
let getById = () => {
    return `SELECT * FROM ${table_name} where  id = ? and status = 1 `;
}

let getByIdForDeleted = () => {
    return `delete FROM ${table_name} where  id = ? and status = 1 `;
}

let getDataByEmployeeId = () => {
    return `SELECT * FROM ${table_name} where  employee_id = ? and status = 1 `;
}


let me = () => {
    return `SELECT id,name,email,status FROM ${table_name2} where  id = ? and status = 1 `;
}




let getUserByEmployeeIdNo = () => {
    return `SELECT * FROM ${table_name} where  employee_id = ? and status = 1 `;
}









const updateById = () => {
    return `UPDATE ${table_name} SET ? WHERE id = ?`;
}

const updateByAlbum = () => {
    return `UPDATE ${table_name} SET ? WHERE id = ?`;
}

let getArtistListByAlbumId = () => {
    return `SELECT id,name,date_of_birth FROM m360ict_artists where id in (SELECT artist_id FROM m360ict_album_wise_artists where album_id = ? and status = 1) and status = 1;`;
}


module.exports = {
    addNew,
    getByEmployee,
    getList,
    getById,
    updateById,
    updateByAlbum,
    getArtistListByAlbumId,
    me,
    getTotalList,
    getDataByEmployeeId,
    getByIdForDeleted,
    getUserByEmployeeIdNo

}