let table_name = "dbl_asset";

let table_name2 = "dbl_asset_assign";

let table_view = "asset_assign_user_view";



let addNew = () => {
    return `INSERT INTO ${table_name} SET ?`;
}

let getByEmployee = () => {
    return `SELECT * FROM ${table_name} where  employee_id = ? and status != 0`;
}


let getList = (offset, limit, key, unit, type ) => {
  let searchCondition = '';

  if (key) {
      searchCondition += `AND (LOWER(category) LIKE LOWER('%${key}%') OR LOWER(model) LIKE LOWER('%${key}%') OR UPPER(serial_number) LIKE UPPER('%${key}%')) `;
  }

  if (unit) {
      searchCondition += `AND UPPER(unit_name) LIKE UPPER('%${unit}%') `;
  }
  if (type) {
    searchCondition += `AND lower(remarks) LIKE lower('%${type}%') `;
  }

  return `SELECT * FROM ${table_name} WHERE status = 1 ${searchCondition} ORDER BY id desc LIMIT ${limit} OFFSET ${offset}`;
}



let getTotalList = (key, unit, type) => {
  let searchCondition = '';

  if (key) {
      searchCondition += `AND (LOWER(category) LIKE LOWER('%${key}%') OR LOWER(model) LIKE LOWER('%${key}%') OR UPPER(serial_number) LIKE UPPER('%${key}%')) `;
  }

  if (unit) {
      searchCondition += `AND UPPER(unit_name) LIKE UPPER('%${unit}%') `;
  }
  if (type) {
    searchCondition += `AND lower(remarks) LIKE lower('%${type}%') `;
  }

  return `SELECT * FROM ${table_name} WHERE status = 1 ${searchCondition} ORDER BY id desc `;
}


let distributedAssetList = (offset, limit, key, unit) => {
  // Initialize searchCondition as an array to hold all conditions
  let searchCondition = [];

  // Add unit search condition if unit is provided
  if (unit) {
    searchCondition.push(`UPPER(employee_unit) LIKE UPPER('%${unit}%')`);
  }

  // Add key search condition if key is provided
  if (key) {
    searchCondition.push(`(LOWER(employee_id_no) LIKE LOWER('%${key}%') OR LOWER(employee_name) LIKE LOWER('%${key}%') OR LOWER(serial_number) LIKE LOWER('%${key}%'))`);
  }

  // Combine the conditions with AND, and check if any conditions exist
  let whereClause = searchCondition.length ? `WHERE ${searchCondition.join(' AND ')}` : '';

  // Return the final query with the search conditions applied
  return `SELECT * FROM ${table_view} ${whereClause} ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`;
}




let distributedTotalAssetList = (key, unit, type) => {
  // Initialize searchCondition as an array to hold all conditions
  let searchCondition = [];

  // Add key search condition if key is provided
  if (key) {
    searchCondition.push(`(LOWER(employee_id_no) LIKE LOWER('%${key}%') OR LOWER(employee_name) LIKE LOWER('%${key}%') OR LOWER(serial_number) LIKE LOWER('%${key}%'))`);
  }

  // Add unit search condition if unit is provided
  if (unit) {
    searchCondition.push(`UPPER(employee_unit) LIKE UPPER('%${unit}%')`);
  }

  // Combine the conditions with AND, and check if any conditions exist
  let whereClause = searchCondition.length ? `WHERE ${searchCondition.join(' AND ')}` : '';

  // Return the final query with the search conditions applied
  return `SELECT * FROM ${table_view} ${whereClause} ORDER BY id DESC`;
}



let getLastData = () => {
    return `SELECT * FROM ${table_name} where  status = 1 order by id desc  `;
  }
  
  

let getById = () => {
    return `SELECT * FROM ${table_name} where  id = ? and status = 1 `;
}

let getByEmployeeId = () => {
  return `SELECT * FROM ${table_view} where  id = ? and status = 1 `;
}


let getByIdAssign = () => {
    return `SELECT * FROM ${table_name} where  id = ?  and is_assign = 1 and status = 1 `;
}



const updateById = () => {
    return `UPDATE ${table_name} SET ? WHERE id = ?`;
}


let getListOfDashboard = () => {
  return `SELECT count(id) as total_asset FROM dbl_asset WHERE status = 1`; 
};
  
let getListOfDashboard2 = () => {
    return `SELECT count(id) as total_laptop FROM dbl_employee WHERE status = 1`; 
};

let getListOfDashboard3 = () => {
    return `SELECT count(id) as total_assign_asset FROM dbl_asset WHERE status = 1 and is_assign = 1`; 
};



let getListOfDashboardGraph = () => {
    return `
      SELECT 
        MONTH(created_at) as month,
        COUNT(id) as total_assign_asset 
      FROM 
        dbl_asset 
      WHERE 
        status = 1 
        AND is_assign = 1 
        AND created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY 
        MONTH(created_at)
      ORDER BY 
        MONTH(created_at) DESC
    `;
  };
  
  
  let getListOfDashboardGraph2 = () => {
    return `
      SELECT 
        MONTH(created_at) as month,
        COUNT(id) as total_asset 
      FROM 
        dbl_asset 
      WHERE 
        status = 1 
        AND created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY 
        MONTH(created_at)
      ORDER BY 
        MONTH(created_at) DESC
    `;
  };


const updateByAlbum = () => {
    return `UPDATE ${table_name} SET ? WHERE id = ?`;
}

let getArtistListByAlbumId = () => {
    return `SELECT id,name,date_of_birth FROM m360ict_artists where id in (SELECT artist_id FROM m360ict_album_wise_artists where album_id = ? and status = 1) and status = 1;`;
}


let laptopCountData = () => {
  return `SELECT count(id) as total_laptop FROM ${table_name}  WHERE category = 'laptop' and status = 1`; 
};

let desktopCountData = () => {
  return `SELECT count(id) as total_desktop FROM ${table_name}  WHERE category = 'desktop' and status = 1`; 
};



let printerCountData = () => {
  return `SELECT count(id) as total_printer FROM ${table_name}  WHERE category = 'printer' and status = 1`; 
};


let accessoriesCountData = () => {
  return `SELECT count(id) as total_accessories FROM ${table_name}  WHERE category = 'accessories' and status = 1`; 
};


let getAssetList = () => {
  return `select * from ${table_name} where status = 1 order by id desc`;
}


module.exports = {
    addNew,
    getByEmployee,
    getList,
    getById,
    updateById,
    updateByAlbum,
    getArtistListByAlbumId,
    getLastData,
    distributedAssetList,
    getByIdAssign,
    getListOfDashboard,
    getListOfDashboard2,
    getListOfDashboard3,
    getListOfDashboardGraph,
    getListOfDashboardGraph2,
    getTotalList,
    distributedTotalAssetList,
    getByEmployeeId,
    laptopCountData,
    printerCountData,
    desktopCountData,
    accessoriesCountData,
    getAssetList


}