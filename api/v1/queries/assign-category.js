const isEmpty = require("is-empty");
let table_name = "dbl_user_category_access";
let user_unit_category_view = "user_unit_category";

let getList = (status) => {
    let searchCondition = "status != 'delete'"; 

    if (status === 'active') {
        searchCondition += " AND status = 'active'";
    } else if (status === 'deactivate') {
        searchCondition += " AND status = 'deactivate'";
    }

    return `SELECT * FROM ${table_name} WHERE ${searchCondition} ORDER BY id DESC`;
}



let getBeforeCategoryAssignList = () => {
    return `SELECT 
    u.id AS user_id,
    u.employee_id AS employee_id,
    u.name AS name,
    u.email AS email,
    GROUP_CONCAT(au.title ORDER BY au.title ASC SEPARATOR ', ') AS asset_unit_titles
    FROM
        dbl_users AS u
    JOIN
        admin_search_access AS sa ON sa.user_id = u.id
    JOIN
        dbl_asset_unit AS au ON au.id = sa.unit_id
    GROUP BY 
        u.id, u.employee_id;`;
}

// let getAfterCategoryAssignList = () => {
//     return `SELECT *, uc.*  FROM ${user_unit_category_view} as ucv left join dbl_user_category_access as uc on ucv.user_id = uc.user_id`;
// }
let getAfterCategoryAssignList = (offset, limit, key) => {
    let searchCondition = '';
    
    if (key) {
        searchCondition = ` AND (
            LOWER(ucv.employee_id) LIKE LOWER('%${key}%') OR 
            LOWER(ucv.name) LIKE LOWER('%${key}%')
        )`;
    }
    
    return `
        SELECT 
            ucv.user_id,
            ucv.employee_id,
            ucv.name,
            ucv.email,
            ucv.asset_unit_ids,
            ucv.asset_unit_titles,
            ucv.ticket_category_titles,
            ucv.ticket_category_ids,
            CONCAT('[', 
                GROUP_CONCAT(
                    CONCAT(
                        '{"access_id":', uc.id,
                        ',"category_id":', uc.category_id,
                        ',"category_name":"', tc.title, '"}'
                    )
                ), 
            ']') AS assign_category
        FROM 
            user_unit_category AS ucv
        LEFT JOIN 
            dbl_user_category_access AS uc 
        ON 
            ucv.user_id = uc.user_id
        LEFT JOIN 
            dbl_ticket_category AS tc 
        ON 
            uc.category_id = tc.id
        WHERE 
            1=1
            ${searchCondition}
        GROUP BY 
            ucv.user_id, 
            ucv.employee_id, 
            ucv.name, 
            ucv.email, 
            ucv.asset_unit_ids, 
            ucv.asset_unit_titles, 
            ucv.ticket_category_titles, 
            ucv.ticket_category_ids
        ORDER BY 
            ucv.user_id DESC
        LIMIT ${limit} OFFSET ${offset};
    `;
};





let getOnlyDataList = () => {
    return `SELECT id,title FROM ${table_name}  where status IN ('active', 'deactivate')`;
}

let getActiveList = () => {
    return `SELECT * FROM ${table_name}  where status = 'active'`;
}

let getByTitle = () => {
    return `SELECT * FROM ${table_name} where  title = ? and status = 'active'`;
}

let getById = () => {
    return `SELECT * FROM ${table_name} where  id = ?  `;
}

let getByIdAndUser = () => {
    return `SELECT * FROM ${table_name} where  category_id = ?  and user_id = ? `;
}

let addNew = () => {
    return `INSERT INTO ${table_name} SET ?`;
}

let updateById = (data) => {
    let keys = Object.keys(data);

    let query = `update ${table_name} set ` + keys[0] + ` = ? `;

    for (let i = 1; i < keys.length; i++) {
        query += `, ` + keys[i] + ` = ? `;
    }

    query += ` where id = ? `;

    return query;
}

let getDataByWhereCondition = (data = {}, orderBy = {}, limit, offset, columnList = []) => {
    let keys = Object.keys(data);
    let columns = " * ";

    try {
        if (Array.isArray(columnList) && !isEmpty(columnList)) {
            columns = columnList.join(",");
        }
    } catch (error) {
        columns = " * ";
    }

    let query = `Select ${columns} from ${table_name} `;

    if (keys.length > 0) {

        if (Array.isArray(data[keys[0]])) {
            query += ` where ${keys[0]} BETWEEN ? and ? `
        } else if (typeof data[keys[0]] === 'object' && !Array.isArray(data[keys[0]]) && data[keys[0]] !== null) {

            let key2 = Object.keys(data[keys[0]]);

            for (let indexKey = 0; indexKey < key2.length; indexKey++) {
                let tempSubKeyValue = data[keys[0]][key2[indexKey]];
                if (key2[indexKey].toUpperCase() === "OR" && Array.isArray(tempSubKeyValue)) {
                    query += ` where ( ${keys[0]} = ? `;
                    for (let indexValue = 1; indexValue < tempSubKeyValue.length; indexValue++) {
                        query += ` or ` + keys[0] + ` = ? `;
                    }
                    query += ` ) `;

                } else if (key2[indexKey].toUpperCase() === "OR") {
                    query += ` where ${key2[indexKey].toLowerCase()} ` + keys[0] + ` = ? `;
                } else if (key2[indexKey].toUpperCase() === "LIKE") {
                    query += ` where ${keys[0]} like ? `;
                } else if (["IN", "NOT IN"].includes(key2[indexKey].toUpperCase())) {
                    query += ` where ${keys[0]}  ${key2[indexKey].toUpperCase()} ( ? ) `;
                } else if (["IN QUERY"].includes(key2[indexKey].toUpperCase())) {
                    query += ` where  ${keys[0]}  IN ( ${ data[keys[0]][key2[indexKey]] } ) `;
                } else if (["NOT IN QUERY"].includes(key2[indexKey].toUpperCase())) {
                    query += ` where  ${keys[0]}  NOT IN ( ${ data[keys[0]][key2[indexKey]] } ) `;
                } else if ("GTE" == key2[indexKey].toUpperCase()) {
                    query += ` where  ` + keys[0] + ` >= ? `;
                } else if ("GT" == key2[indexKey].toUpperCase()) {
                    query += ` where ` + keys[0] + ` > ? `;
                } else if ("LTE" == key2[indexKey].toUpperCase()) {
                    query += ` where ` + keys[0] + ` <= ? `;
                } else if ("LT" == key2[indexKey].toUpperCase()) {
                    query += ` where ` + keys[0] + ` < ? `;
                } else if ("NOT EQ" == key2[indexKey].toUpperCase()) {
                    query += ` where ` + keys[0] + ` != ? `;
                }
            }
        } else {
            query += ` where ${keys[0]} = ? `
        }

        for (let i = 1; i < keys.length; i++) {

            if (Array.isArray(data[keys[i]])) {
                query += `and ` + keys[i] + `  BETWEEN  ? and ? `;
            } else if (typeof data[keys[i]] === 'object' && !Array.isArray(data[keys[i]]) && data[keys[i]] !== null) {

                let key2 = Object.keys(data[keys[i]]);

                for (let indexKey = 0; indexKey < key2.length; indexKey++) {
                    let tempSubKeyValue = data[keys[i]][key2[indexKey]];
                    if (key2[indexKey].toUpperCase() === "OR" && Array.isArray(tempSubKeyValue)) {
                        query += ` or ( ${keys[i]} = ? `;
                        for (let indexValue = 1; indexValue < tempSubKeyValue.length; indexValue++) {
                            query += ` or ` + keys[i] + ` = ? `;
                        }
                        query += ` ) `;

                    } else if (key2[indexKey].toUpperCase() === "OR") {
                        query += ` or ${key2[indexKey].toLowerCase()} ` + keys[i] + ` = ? `;
                    } else if (key2[indexKey].toUpperCase() === "LIKE") {
                        query += ` and  ${keys[i]} like ? `;
                    } else if (["IN", "NOT IN"].includes(key2[indexKey].toUpperCase())) {
                        query += ` and  ${keys[i]}  ${key2[indexKey].toUpperCase()} ( ? ) `;
                    } else if (["IN QUERY"].includes(key2[indexKey].toUpperCase())) {
                        query += ` and  ${keys[i]}  IN ( ${ data[keys[i]][key2[indexKey]] } ) `;
                    } else if (["NOT IN QUERY"].includes(key2[indexKey].toUpperCase())) {
                        query += ` and  ${keys[i]}  NOT IN ( ${data[keys[i]][key2[indexKey]]} ) `;
                    } else if ("GTE" == key2[indexKey].toUpperCase()) {
                        query += ` and ` + keys[i] + ` >= ? `;
                    } else if ("GT" == key2[indexKey].toUpperCase()) {
                        query += ` and ` + keys[i] + ` > ? `;
                    } else if ("LTE" == key2[indexKey].toUpperCase()) {
                        query += ` and ` + keys[i] + ` <= ? `;
                    } else if ("LT" == key2[indexKey].toUpperCase()) {
                        query += ` and ` + keys[i] + ` < ? `;
                    } else if ("NOT EQ" == key2[indexKey].toUpperCase()) {
                        query += ` and ` + keys[i] + ` != ? `;
                    }
                }
            } else {
                query += `and ` + keys[i] + ` = ? `;
            }

        }


    }

    if (!isEmpty(orderBy)) {
        keys = Object.keys(orderBy);
        query += ` order by ${keys[0]} ${orderBy[keys[0]]} `;

        for (let i = 1; i < keys.length; i++) {
            query += `, ${keys[i]} ${orderBy[keys[i]]} `;
        }
    }

    query += `LIMIT ${offset}, ${limit}`;
    return query;
}

let getDetailsByIdAndWhereIn = () => {
    return `SELECT id,name,status FROM ${table_name} where  id IN (?) and status = 1`;
}

let getByUserId = () => {
    // return `SELECT id,name,status FROM ${table_name} where  id IN (?) and status = 1`;
    return `SELECT category_id FROM ${table_name} WHERE user_id = ?`
}
let deleteByUserAndCategories = () => {
    // return `SELECT id,name,status FROM ${table_name} where  id IN (?) and status = 1`;
    return `DELETE FROM ${table_name} WHERE user_id = ? AND category_id IN (?)`;
}

// async getByUserId(userId) {
//     return db.query('SELECT category_id FROM assign_categories WHERE user_id = ?', [userId]);
// }

// async deleteByUserAndCategories(userId, categoryIds) {
//     return db.query('DELETE FROM assign_categories WHERE user_id = ? AND category_id IN (?)', [userId, categoryIds]);
// }



module.exports = {
    getList,
    getActiveList,
    getByTitle,
    getById,
    addNew,
    updateById,
    getDataByWhereCondition,
    getDetailsByIdAndWhereIn,
    getOnlyDataList,
    getByIdAndUser,
    getBeforeCategoryAssignList,
    getAfterCategoryAssignList,
    getByUserId,
    deleteByUserAndCategories,
    getByUserId

}