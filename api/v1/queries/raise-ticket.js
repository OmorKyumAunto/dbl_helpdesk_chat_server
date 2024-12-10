const isEmpty = require("is-empty");
let table_name = "dbl_raise_ticket";

let getList = () => {
    return `SELECT id,location, unit_id FROM ${table_name} WHERE status = 1 ORDER BY id DESC `;
}
let getAllList = () => {
    return `SELECT id,location, unit_id,status FROM ${table_name} WHERE status != 0 ORDER BY id DESC `;
}

let getAllLocationDataByUnitId = () => {
    return `SELECT id,location,unit_id,status FROM ${table_name} WHERE unit_id = ? and status = 1 ORDER BY id DESC `;
}



let getLocation = () => {

    return `SELECT * FROM ${table_name}  where location = ? and unit_id = ? and status = 1`;
}

let getAllListUserWise = () => {
    return `SELECT 
    rt.*,  
    au.title AS unit_name, 
    tc.title AS category_name,
    ass.name AS asset_name,
    ass.category AS asset_category
    FROM 
        ${table_name}  AS rt
    JOIN 
        dbl_asset_unit AS au ON au.id = rt.unit_id 
    JOIN 
        dbl_ticket_category AS tc ON tc.id = rt.category_id 
    LEFT JOIN 
        dbl_asset AS ass ON ass.id = rt.asset_id
    WHERE 
        rt.created_by = ? AND rt.status = 1
    ORDER BY 
        rt.created_at DESC;`;
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
    return `SELECT * FROM ${table_name} where  id = ? and status = 1 `;
}

let getByNonDeleteData = () => {
    return `SELECT * FROM ${table_name} where  id = ? and status != 0 `;
}
let addNew = () => {
    return `INSERT INTO ${table_name} SET ?`;
}

const updateById = () => {
    return `UPDATE ${table_name} SET ? WHERE id = ?`;
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
    getByNonDeleteData,
    getAllLocationDataByUnitId,
    getUnitWiseLocation,
    getAllListUserWise

}