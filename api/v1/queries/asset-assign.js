let table_name = "dbl_asset_assign";



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
    return `SELECT * FROM ${table_name} where  asset_id = ? and status = 1 `;
}


const updateById = () => {
    return `UPDATE ${table_name} SET ? WHERE asset_id = ?`;
}


const deleteAssetById = () => {
    return `delete from ${table_name} WHERE asset_id = ?  `;
}


const updateByAlbum = () => {
    return `UPDATE ${table_name} SET ? WHERE id = ?`;
}

let getArtistListByAlbumId = () => {
    return `SELECT id,name,date_of_birth FROM m360ict_artists where id in (SELECT artist_id FROM m360ict_album_wise_artists where album_id = ? and status = 1) and status = 1;`;
}


let totalAssignAssetCount = () => {
    return `SELECT count(id) FROM ${table_name} where  user_id = ? and status = 1 `;
}


let employeeAssignCount = () => {
    return  `SELECT count(id) as total_assign FROM ${table_name} where  user_id = ? `;
}
module.exports = {
    addNew,
    getByEmployee,
    getList,
    getById,
    updateById,
    updateByAlbum,
    getArtistListByAlbumId,
    deleteAssetById,
    totalAssignAssetCount,
    employeeAssignCount

}