let table_name = "dbl_asset";

let table_name2 = "dbl_asset_assign";

let table_view = "asset_assign_user_view";



let addNew = () => {
    return `INSERT INTO ${table_name} SET ?`;
}

let getByEmployee = () => {
    return `SELECT * FROM ${table_name} where  employee_id = ? and status = 1`;
}


let getList = (offset, limit, key, unit, type ) => {
  let searchCondition = '';

  if (key) {
      searchCondition += `AND (LOWER(category) LIKE LOWER('%${key}%') OR LOWER(model) LIKE LOWER('%${key}%') OR UPPER(serial_number) LIKE UPPER('%${key}%')) `;
  }

  if (unit) {
    searchCondition += `AND unit_id LIKE '%${unit}%' `;
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
    searchCondition += `AND unit_id LIKE '%${unit}%' `;
  }
  if (type) {
    searchCondition += `AND lower(remarks) LIKE lower('%${type}%') `;
  }

  return `SELECT * FROM ${table_name} WHERE status = 1 ${searchCondition} ORDER BY id desc `;
}


let distributedAssetList = (offset, limit, key, unit,type) => {
  let searchCondition = [];

  if (unit) {
    searchCondition.push(`UPPER(employee_unit_name) LIKE UPPER('%${unit}%')`);
  }

  if (type) {
    searchCondition.push(`UPPER(category) LIKE UPPER('%${type}%')`);
  }
  

  if (key) {
    searchCondition.push(`(
      LOWER(user_id_no) LIKE LOWER('%${key}%') 
      OR LOWER(user_name) LIKE LOWER('%${key}%') 
      OR LOWER(serial_number) LIKE LOWER('%${key}%') 
      OR email LIKE '%${key}%' 
      OR LOWER(department) LIKE LOWER('%${key}%')
    )`);
  }

  let whereClause = searchCondition.length ? `WHERE ${searchCondition.join(' AND ')}` : '';

  return `SELECT * FROM ${table_view} ${whereClause} ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`;
}





let distributedTotalAssetList = (key, unit, type) => {
  let searchCondition = [];

 
  if (key) {
    searchCondition.push(`(LOWER(user_id_no) LIKE LOWER('%${key}%') OR LOWER(user_name) LIKE LOWER('%${key}%') OR LOWER(serial_number) LIKE LOWER('%${key}%'))`);
  }

  if (type) {
    searchCondition.push(`UPPER(category) LIKE UPPER('%${type}%')`);
  }
  
  if (unit) {
    searchCondition.push(`UPPER(employee_unit_name) LIKE UPPER('%${unit}%')`);
  }

  let whereClause = searchCondition.length ? `WHERE ${searchCondition.join(' AND ')}` : '';

  return `SELECT * FROM ${table_view} ${whereClause} ORDER BY id DESC`;
}



let getLastData = () => {
    return `SELECT * FROM ${table_name} where  status = 1 order by id desc  `;
  }
  
  

let getById = () => {
    return `SELECT * FROM ${table_name} where  id = ? and status = 1 `;
}

let getDuplicateSerialNumber = () => {
  return `SELECT * FROM ${table_name} where  serial_number = ? and status = 1 `;
}



let getByEmployeeId = () => {
  return `SELECT * FROM ${table_view} where  employee_id = ? and status = 1 `;
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
    return `SELECT count(id) as total_employee FROM dbl_users WHERE status = 1`; 
};

let getListOfDashboard3 = () => {
    return `SELECT count(id) as total_assign_asset FROM dbl_asset WHERE status = 1 and is_assign = 1`; 
};



let getListOfDashboardGraph = () => {
    return `
      SELECT 
        MONTH(assign_date) as month,
        COUNT(id) as total_assign_asset 
      FROM 
        dbl_asset_assign 
      WHERE 
        status = 1 
        AND assign_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY 
        MONTH(assign_date)
      ORDER BY 
        MONTH(assign_date) DESC
    `;
  };
  
  
  let getListOfDashboardGraph2 = () => {
    return `
      SELECT 
        MONTH(purchase_date) as month,
        COUNT(id) as total_asset 
      FROM 
        dbl_asset 
      WHERE 
        status = 1 
        AND purchase_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY 
        MONTH(purchase_date)
      ORDER BY 
        MONTH(purchase_date) DESC
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
  return `select * from ${table_name} where status != 0 order by id desc`;
}


let totalAssetCount = () => {
  return `select count(id) as total_asset from ${table_name} where status = 1`;
}



let getDistributedData = () => {
  return `SELECT * FROM ${table_view} where  id = ? and status = 1`;
}



let alreadyAssignUnit = () => {
  return `SELECT * FROM ${table_name} where  unit_id = ? and status = 1 `;
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
    getAssetList,
    getDuplicateSerialNumber,
    totalAssetCount,
    getDistributedData,
    alreadyAssignUnit


}