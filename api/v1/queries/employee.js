let table_name = "dbl_employee";



let addNew = () => {
    return `INSERT INTO ${table_name} SET ?`;
}

let getByEmployee = () => {
    return `SELECT * FROM ${table_name} where  employee_id = ? and status != 0`;
}


let getList = (offset, limit, key) => {
    let searchCondition = key ? `AND LOWER(name) LIKE LOWER('%${key}%')` : '';
    return `SELECT * FROM ${table_name} WHERE status = 1 ${searchCondition} LIMIT ${limit} OFFSET ${offset}`;
  }
  

let getById = () => {
    return `SELECT * FROM ${table_name} where  id = ? and status = 1 `;
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
    getArtistListByAlbumId

}