let table_name = "dbl_asset";

let table_name2 = "dbl_asset_assign";

let table_view = "asset_assign_user_view";



let addNew = () => {
    return `INSERT INTO ${table_name} SET ?`;
}

let getByEmployee = () => {
    return `SELECT * FROM ${table_name} where  employee_id = ? and status = 1`;
}


let getList = (offset, limit, key, unit, type, location, status, from_date, to_date) => {
  let searchCondition = 'status != 0 ';

  if (from_date && to_date) {
    searchCondition += ` AND DATE(created_at) BETWEEN '${from_date}' AND '${to_date}'`;
  }

  if (key) {
    searchCondition += ` AND (
      LOWER(category) LIKE LOWER('%${key}%') OR 
      LOWER(model) LIKE LOWER('%${key}%') OR 
      UPPER(serial_number) LIKE UPPER('%${key}%') OR 
      UPPER(po_number) LIKE UPPER('%${key}%')
    ) `;
  }

  // ✅ Fixed unit filter
  if (unit && Array.isArray(unit) && unit.length > 0) {
    const units = unit.join(',');
    searchCondition += ` AND unit_id IN (${units}) `;
  } else if (unit && typeof unit === 'string' && unit.trim() !== '') {
    searchCondition += ` AND unit_id IN (${unit}) `;
  }

  if (location) {
    searchCondition += ` AND location LIKE '%${location}%' `;
  }

  if (type) {
    searchCondition += ` AND LOWER(remarks) LIKE LOWER('%${type}%') `;
  }

  if (status) {
    searchCondition += ` AND status = '${status}' `;
  }

  return `
    SELECT * 
    FROM ${table_name} 
    WHERE ${searchCondition} 
    AND status != 0
    ORDER BY id DESC 
    LIMIT ${limit} OFFSET ${offset};
  `;
};


let adminUnitWisetotalAssetCount = () => {
  return `SELECT 
    COUNT(u.id) AS user_count
    FROM 
        dbl_users AS u
    JOIN 
        admin_search_access AS sa 
    ON 
        sa.user_id = u.id
    JOIN 
        dbl_asset AS asset 
    ON 
        asset.unit_id = sa.unit_id
    WHERE 
        u.role_id = 2 
        AND asset.status != 0
        AND u.id = ?;
    `;
}


let employeeWiseAssigntotalAssetCount = () => {
  return `
  SELECT 
    COUNT(u.id) AS employee_assign_asset_count
    FROM 
        dbl_users AS u
    JOIN 
        admin_search_access AS sa 
    ON 
        sa.user_id = u.id
    JOIN 
        asset_assign_user_view AS aav 
    ON 
        aav.asset_unit_id = sa.unit_id
    WHERE 
        u.role_id = 2 
        AND u.id = ?;`;
}



let getTotalList = (key, unit, type,location,status,from_date,to_date) => {
  let searchCondition = 'status != 0 ';
  
  if (from_date && to_date) {
    searchCondition += ` AND DATE(created_at) BETWEEN '${from_date}' AND '${to_date}'`;
  }
  if (key) {
    searchCondition += `AND (LOWER(category) LIKE LOWER('%${key}%') OR LOWER(model) LIKE LOWER('%${key}%') OR UPPER(serial_number) LIKE UPPER('%${key}%') OR UPPER(po_number) LIKE UPPER('%${key}%')) `;
  }
  if (unit && Array.isArray(unit) && unit.length > 0) {
    const units = unit.join(',');
    searchCondition += ` AND unit_id IN (${units}) `;
  } else if (unit && typeof unit === 'string' && unit.trim() !== '') {
    searchCondition += ` AND unit_id IN (${unit}) `;
  }
  if (location) {
    searchCondition += `AND location LIKE '%${location}%' `;
  }

  if (type) {
    searchCondition += `AND lower(remarks) LIKE lower('%${type}%') `;
  }
  if (status) {
    searchCondition += `AND status = '${status}' `;
  }

  return `SELECT * FROM ${table_name} WHERE  ${searchCondition}`;
}


let assetReport = (unit,start_date,end_date,category,remarks,key,start_purchase_date,end_purchase_date) => {
  let searchCondition = 'a.status != 0';

  if (start_date && end_date) {
    searchCondition += ` AND DATE(a.created_at) BETWEEN '${start_date}' AND '${end_date}'`;
  }
  
  if (start_purchase_date && end_purchase_date) {
    searchCondition += ` AND DATE(a.purchase_date) BETWEEN '${start_purchase_date}' AND '${end_purchase_date}'`;
  }

  if (unit) {
    searchCondition += ` AND a.unit_id = '${unit}'`;
  }
  
  if (category) {
    searchCondition += ` AND LOWER(a.category) LIKE LOWER('%${category}%')`;
  }

  if (remarks) {
    searchCondition += ` AND a.remarks = '${remarks}'`;
  }
  
  if(key){
    searchCondition += ` AND (LOWER(a.name) LIKE LOWER('%${key}%') OR LOWER(a.category) LIKE LOWER('%${key}%') OR a.serial_number LIKE '%${key}%' OR a.po_number LIKE '%${key}%' OR LOWER(a.model) LIKE LOWER('%${key}%'))`; 
  }

  return `
    SELECT a.id, a.name, a.category, a.purchase_date, a.serial_number,
           a.po_number, a.price, a.unit_id, au.title as unit_name, a.model,
           a.specification, a.asset_no, a.remarks, a.location as location_id,a.status,
           l.location as location_name, u.name as asset_created_name, 
           u.employee_id as asset_created_employee_id, 
           u.department as asset_created_department,
           u.designation as asset_created_designation,
           u.contact_no as asset_created_contact_no
    FROM ${table_name} AS a
    LEFT JOIN dbl_asset_unit AS au ON au.id = a.unit_id
    LEFT JOIN location AS l ON l.id = a.location
    LEFT JOIN users_view AS u ON u.id = a.created_by
    WHERE ${searchCondition} AND a.status = 1
    ORDER BY a.id DESC


  `;
};

let assetCategoryCount = (
  unit,
  start_date,
  end_date,
  category,
  remarks,
  key,
  start_purchase_date,
  end_purchase_date
) => {
  let searchCondition = "a.status != 0";

  if (start_date && end_date) {
    searchCondition += ` AND DATE(a.created_at) BETWEEN '${start_date}' AND '${end_date}'`;
  }

  if (start_purchase_date && end_purchase_date) {
    searchCondition += ` AND DATE(a.purchase_date) BETWEEN '${start_purchase_date}' AND '${end_purchase_date}'`;
  }

  if (unit) {
    searchCondition += ` AND a.unit_id = '${unit}'`;
  }

  if (category) {
    searchCondition += ` AND LOWER(a.category) LIKE LOWER('%${category}%')`;
  }

  if (remarks) {
    searchCondition += ` AND a.remarks = '${remarks}'`;
  }

  if (key) {
    searchCondition += ` AND (LOWER(a.name) LIKE LOWER('%${key}%') 
                          OR LOWER(a.category) LIKE LOWER('%${key}%') 
                          OR a.serial_number LIKE '%${key}%' 
                          OR a.po_number LIKE '%${key}%' 
                          OR LOWER(a.model) LIKE LOWER('%${key}%'))`;
  }

  return `
    SELECT 
      SUM(CASE WHEN category = 'Laptop' THEN 1 ELSE 0 END) AS total_laptop,
      SUM(CASE WHEN category = 'Desktop' THEN 1 ELSE 0 END) AS total_desktop,
      SUM(CASE WHEN category = 'Monitor' THEN 1 ELSE 0 END) AS total_monitor,
      SUM(CASE WHEN category = 'Accessories' THEN 1 ELSE 0 END) AS accessories_count,
      SUM(CASE WHEN category = 'TV' THEN 1 ELSE 0 END) AS tv_count,
      SUM(CASE WHEN category = 'Ipad/Tab' THEN 1 ELSE 0 END) AS tab_count,
      SUM(CASE WHEN category = 'Projector' THEN 1 ELSE 0 END) AS projector_count,
      SUM(CASE WHEN category = 'Attendence Machine' THEN 1 ELSE 0 END) AS attendance_machine_count,
      SUM(CASE WHEN category = 'Speaker' THEN 1 ELSE 0 END) AS speaker_count,
      SUM(CASE WHEN category = 'Scanner' THEN 1 ELSE 0 END) AS scanner_count,
      SUM(CASE WHEN category = 'Camera' THEN 1 ELSE 0 END) AS camera_count,
      SUM(CASE WHEN category = 'NVR/DVR' THEN 1 ELSE 0 END) AS nvr_drv_count,
      SUM(CASE WHEN category = 'Online/Industrial UPS' THEN 1 ELSE 0 END) AS ups_count,
      SUM(CASE WHEN category = 'Conference System' THEN 1 ELSE 0 END) AS conference_system_count,
      SUM(CASE WHEN category = 'Firewall' THEN 1 ELSE 0 END) AS firewall_count,
      SUM(CASE WHEN category = 'Core Router' THEN 1 ELSE 0 END) AS core_router_count,
      SUM(CASE WHEN category = 'Access Point' THEN 1 ELSE 0 END) AS access_point_count,
      SUM(CASE WHEN category = 'Server' THEN 1 ELSE 0 END) AS server_count,
      SUM(CASE WHEN category = 'Network Rack' THEN 1 ELSE 0 END) AS network_rack_count,
      SUM(CASE WHEN category = '24 Port Switch Managable' THEN 1 ELSE 0 END) AS 24_port_switch_count,
      SUM(CASE WHEN category = '48 Port Switch Managable' THEN 1 ELSE 0 END) AS 48_port_switch_count,
      SUM(CASE WHEN category = 'Non Managable Switch' THEN 1 ELSE 0 END) AS non_managable_switch_count
      FROM ${table_name} AS a
      WHERE ${searchCondition} AND a.status = 1;
  `;
};

module.exports = {
  assetReport,
  assetCategoryCount
};



let distributedAssetList = (offset, limit, key, unit, type, employee_type, location, from_date, to_date) => {
  let searchCondition = [];

  if (from_date && to_date) {
    searchCondition.push(
      `asset_create_date BETWEEN '${from_date}' AND '${to_date}'`
    );
  }

  // Unit filter
  if (unit && Array.isArray(unit) && unit.length > 0) {
    const units = unit.join(',');
    searchCondition.push(`asset_unit_id IN (${units})`);
  } else if (unit && typeof unit === 'string' && unit.trim() !== '') {
    searchCondition.push(`asset_unit_id IN (${unit})`);
  }

  if (location) {
    searchCondition.push(`location_id LIKE '%${location}%'`);
  }

  if (type) {
    searchCondition.push(`UPPER(category) LIKE UPPER('%${type}%')`);
  }

  if (employee_type) {
    if (employee_type === "management") {
      searchCondition.push(`user_id_no LIKE '1510%'`);
    } else if (employee_type === "non-management") {
      searchCondition.push(`user_id_no NOT LIKE '1510%'`);
    }
  }

  if (key) {
    searchCondition.push(`(
      LOWER(user_id_no) LIKE LOWER('%${key}%') 
      OR LOWER(user_name) LIKE LOWER('%${key}%') 
      OR LOWER(serial_number) LIKE LOWER('%${key}%')
      OR LOWER(asset_name) LIKE LOWER('%${key}%')
    )`);
  }

  let whereClause = searchCondition.length ? `WHERE ${searchCondition.join(' AND ')}` : '';

  return `SELECT * FROM ${table_view} ${whereClause} ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`;
};



let distributedAssetReport = (unit, start_date, end_date, category, employee_type,key) => {
  let searchCondition = [];

  if (start_date && end_date) {
    searchCondition.push(`DATE(assign_date) BETWEEN '${start_date}' AND '${end_date}'`);
  }

  if (unit) {
    searchCondition.push(`asset_unit_id = '${unit}'`);
  }

  if (category) {
    searchCondition.push(`category = '${category}'`);
  }

  if (key) {
    searchCondition.push(`(
      LOWER(asset_name) LIKE LOWER('%${key}%') OR 
      serial_number LIKE '%${key}%' OR 
      po_number LIKE '%${key}%' OR 
      LOWER(model) LIKE LOWER('%${key}%') OR 
      LOWER(user_name) LIKE LOWER('%${key}%') OR 
      user_id_no LIKE '%${key}%'
    )`);
  }
  if (employee_type) {
    if (employee_type === "management") {
      searchCondition.push(`(user_id_no) LIKE '1510%'`);
    } else if (employee_type === "non-management") {
      searchCondition.push(`(user_id_no) NOT LIKE '1510%'`);
    }
  }
  let whereClause = searchCondition.length ? `WHERE ${searchCondition.join(' AND ')}` : '';




  return `
    SELECT id, asset_name, category, purchase_date, serial_number,
           po_number, asset_no, model, specification, device_remarks,
           asset_unit_name, assign_date, location_name, user_name,
           user_id_no, designation, department,assign_by_name,assign_by_employee_id,assign_by_department,assign_by_designation,assign_by_contact_no
    FROM ${table_view}
    ${whereClause}
  `;
};


let adminDistributedAssetList = (offset, limit, key, unit, type, employee_type,location,user_id) => {
  let searchCondition = [];

  if (user_id) {
    searchCondition.push(`(user_id) LIKE ('%${user_id}%')`);
  }
  if (unit) {
    searchCondition.push(`asset_unit_id = '${unit}'`);
  }
  if (location) {
    searchCondition.push(`(location_id) LIKE ('%${location}%')`);
  }

  if (type) {
    searchCondition.push(`UPPER(category) LIKE UPPER('%${type}%')`);
  }

  if (employee_type) {
    if (employee_type === "management") {
      // Management employees (start with 1510)
      searchCondition.push(`(user_id_no) LIKE '1510%'`);
    } else if (employee_type === "non-management") {
      // Non-management employees (any user_id_no)
      searchCondition.push(`(user_id_no) NOT LIKE '1510%'`);
    }
  }

  if (key) {
    searchCondition.push(`(
      LOWER(user_id_no) LIKE LOWER('%${key}%') 
      OR LOWER(user_name) LIKE LOWER('%${key}%') 
      OR LOWER(serial_number) LIKE LOWER('%${key}%')
      OR LOWER(asset_name) LIKE LOWER('%${key}%')
    )`);
  }

  let whereClause = searchCondition.length ? `WHERE ${searchCondition.join(' AND ')}` : '';

  return `SELECT * FROM ${table_view} ${whereClause}  ORDER BY id DESC LIMIT ${limit} OFFSET ${offset}`;
};




let adminDistributedCategoryData = (unit, start_date, end_date, category, employee_type, key) => {
  let searchCondition = [];

  // 🔹 Date filter
  if (start_date && end_date) {
    searchCondition.push(`DATE(assign_date) BETWEEN '${start_date}' AND '${end_date}'`);
  }

  // 🔹 Unit filter
  if (unit) {
    searchCondition.push(`asset_unit_id = '${unit}'`);
  }

  // 🔹 Category filter
  if (category) {
    searchCondition.push(`category = '${category}'`);
  }

  // 🔹 Keyword search
  if (key) {
    searchCondition.push(`(
      LOWER(asset_name) LIKE LOWER('%${key}%') OR 
      serial_number LIKE '%${key}%' OR 
      po_number LIKE '%${key}%' OR 
      LOWER(model) LIKE LOWER('%${key}%') OR 
      LOWER(user_name) LIKE LOWER('%${key}%') OR 
      user_id_no LIKE '%${key}%'
    )`);
  }

  // 🔹 Employee type filter
  if (employee_type) {
    if (employee_type === "management") {
      searchCondition.push(`(user_id_no) LIKE '1510%'`);
    } else if (employee_type === "non-management") {
      searchCondition.push(`(user_id_no) NOT LIKE '1510%'`);
    }
  }

  let whereClause = searchCondition.length ? `WHERE ${searchCondition.join(" AND ")}` : "";

  // ✅ Final query (only counting data)
  return `
    SELECT 
      SUM(CASE WHEN category = 'Laptop' THEN 1 ELSE 0 END) AS total_laptop,
      SUM(CASE WHEN category = 'Desktop' THEN 1 ELSE 0 END) AS total_desktop,
      SUM(CASE WHEN category = 'Monitor' THEN 1 ELSE 0 END) AS total_monitor,
      SUM(CASE WHEN category = 'Accessories' THEN 1 ELSE 0 END) AS accessories_count,
      SUM(CASE WHEN category = 'TV' THEN 1 ELSE 0 END) AS tv_count,
      SUM(CASE WHEN category = 'Ipad/Tab' THEN 1 ELSE 0 END) AS tab_count,
      SUM(CASE WHEN category = 'Projector' THEN 1 ELSE 0 END) AS projector_count,
      SUM(CASE WHEN category = 'Attendence Machine' THEN 1 ELSE 0 END) AS attendance_machine_count,
      SUM(CASE WHEN category = 'Speaker' THEN 1 ELSE 0 END) AS speaker_count,
      SUM(CASE WHEN category = 'Scanner' THEN 1 ELSE 0 END) AS scanner_count,
      SUM(CASE WHEN category = 'Camera' THEN 1 ELSE 0 END) AS camera_count,
      SUM(CASE WHEN category = 'NVR/DVR' THEN 1 ELSE 0 END) AS nvr_dvr_count,
      SUM(CASE WHEN category = 'Online/Industrial UPS' THEN 1 ELSE 0 END) AS ups_count,
      SUM(CASE WHEN category = 'Conference System' THEN 1 ELSE 0 END) AS conference_system_count,
      SUM(CASE WHEN category = 'Firewall' THEN 1 ELSE 0 END) AS firewall_count,
      SUM(CASE WHEN category = 'Core Router' THEN 1 ELSE 0 END) AS core_router_count,
      SUM(CASE WHEN category = 'Access Point' THEN 1 ELSE 0 END) AS access_point_count,
      SUM(CASE WHEN category = 'Server' THEN 1 ELSE 0 END) AS server_count,
      SUM(CASE WHEN category = 'Network Rack' THEN 1 ELSE 0 END) AS network_rack_count,
      SUM(CASE WHEN category = '24 Port Switch Managable' THEN 1 ELSE 0 END) AS port_24_switch_count,
      SUM(CASE WHEN category = '48 Port Switch Managable' THEN 1 ELSE 0 END) AS port_48_switch_count,
      SUM(CASE WHEN category = 'Non Managable Switch' THEN 1 ELSE 0 END) AS non_managable_switch_count
    FROM ${table_view}
    ${whereClause};
  `;
};


let distributedTotalAssetList = (key,unit,type,employee_type,location,from_date,to_date) => {
  let searchCondition = [];

  if (from_date && to_date) {
    searchCondition.push(
      `asset_create_date BETWEEN '${from_date}' AND '${to_date}'`
    );
  }

  if (key) {
    searchCondition.push(`(LOWER(user_id_no) LIKE LOWER('%${key}%') OR LOWER(user_name) LIKE LOWER('%${key}%') OR LOWER(serial_number) LIKE LOWER('%${key}%'))`);
  }

  if (type) {
    searchCondition.push(`UPPER(category) LIKE UPPER('%${type}%')`);
  }

  // Unit filter
  if (unit && Array.isArray(unit) && unit.length > 0) {
    const units = unit.join(',');
    searchCondition.push(`asset_unit_id IN (${units})`);
  } else if (unit && typeof unit === 'string' && unit.trim() !== '') {
    searchCondition.push(`asset_unit_id IN (${unit})`);
  }

  if (location) {
    searchCondition.push(`UPPER(location_id) LIKE ('%${location}%')`);
  }
  if (employee_type) {
    if (employee_type === "management") {
      // Management employees (start with 1510)
      searchCondition.push(`(user_id_no) LIKE '1510%'`);
    } else if (employee_type === "non-management") {
      // Non-management employees (any user_id_no)
      searchCondition.push(`(user_id_no) NOT LIKE '1510%'`);
    }
  }

  let whereClause = searchCondition.length ? `WHERE ${searchCondition.join(' AND ')}` : '';

  return `SELECT * FROM ${table_view} ${whereClause} ORDER BY id DESC`;
}



let adminDistributedTotalAssetList = (key, unit, location,type,employee_type,user_id) => {
  let searchCondition = [];

  if (user_id) {
    searchCondition.push(`(user_id) LIKE ('%${user_id}%')`);
  }

  if (key) {
    searchCondition.push(`(LOWER(user_id_no) LIKE LOWER('%${key}%') OR LOWER(user_name) LIKE LOWER('%${key}%') OR LOWER(serial_number) LIKE LOWER('%${key}%'))`);
  }

  if (type) {
    searchCondition.push(`UPPER(category) LIKE UPPER('%${type}%')`);
  }
  
  if (unit) {
    searchCondition.push(`(asset_unit_id) LIKE ('%${unit}%')`);
  }
  if (location) {
    searchCondition.push(`(location_id) LIKE ('%${location}%')`);
  }
  

  if (employee_type) {
    if (employee_type === "management") {
      // Management employees (start with 1510)
      searchCondition.push(`(user_id_no) LIKE '1510%'`);
    } else if (employee_type === "non-management") {
      // Non-management employees (any user_id_no)
      searchCondition.push(`(user_id_no) NOT LIKE '1510%'`);
    }
  }

  let whereClause = searchCondition.length ? `WHERE ${searchCondition.join(' AND ')}` : '';

  return `SELECT * FROM ${table_view} ${whereClause} and user_id = ${user_id} ORDER BY id DESC`;
}


let getLastData = () => {
    return `SELECT * FROM ${table_name} where  status = 1 order by id desc  `;
  }
  
  

let getById = () => {
    return `SELECT * FROM ${table_name} where  id = ? and status != 0 `;
}

let getByIdActiveData = () => {
  return `SELECT * FROM ${table_name} where  id = ? and status != 0 `;
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
  return `SELECT count(id) as total_asset FROM dbl_asset WHERE status != 0`; 
};

let getAdminWiseListOfDashboard = () => {
  return `SELECT count(id) as total_asset FROM dbl_asset WHERE unit_id in (?) AND status != 0`; 
};
  
let getListOfDashboard2 = () => {
    return `SELECT count(id) as total_employee FROM dbl_users WHERE status = 1`; 
};

let getListOfDashboard3 = () => {

   return `SELECT count(id) as total_assign_asset FROM asset_assign_user_view WHERE  status != 0`; 
};

let adminWiseGetListOfDashboard = () => {
    return `SELECT count(id) as total_assign_asset FROM asset_assign_user_view WHERE asset_unit_id in (?) AND status != 0`; 
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
  

  let getListOfDashboardGraphAdmin = () => {
    return `
      SELECT 
        MONTH(aas.assign_date) AS month,
        COUNT(aas.id) AS total_assign_asset
      FROM 
        dbl_users AS u
      JOIN 
        admin_search_access AS sa 
      ON 
        sa.user_id = u.id
      JOIN 
        dbl_asset AS asset 
      ON 
        asset.unit_id = sa.unit_id
      LEFT JOIN 
        dbl_asset_assign AS aas 
      ON 
        aas.asset_id = asset.id
      WHERE 
        u.role_id = 2 
        AND asset.status = 1
        AND aas.status = 1        
        AND aas.assign_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
        AND u.id = ?
      GROUP BY 
        MONTH(aas.assign_date)
      ORDER BY 
        MONTH(aas.assign_date) DESC;
    `;
  };
  
  
  let getListOfDashboardGraphUnitSuperAdmin = () => {
    return `
      SELECT 
        MONTH(aas.assign_date) AS month,
        COUNT(aas.id) AS total_assign_asset
      FROM 
        dbl_users AS u
      JOIN 
        admin_search_access AS sa 
      ON 
        sa.user_id = u.id
      JOIN 
        dbl_asset AS asset 
      ON 
        asset.unit_id = sa.unit_id
      LEFT JOIN 
        dbl_asset_assign AS aas 
      ON 
        aas.asset_id = asset.id
      WHERE 
        u.role_id = 4
        AND asset.status = 1
        AND aas.status = 1        
        AND aas.assign_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
        AND sa.unit_id in (?)
      GROUP BY 
        MONTH(aas.assign_date)
      ORDER BY 
        MONTH(aas.assign_date) DESC;
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


  let getListOfDashboardGraph2Admin = () => {
      return `
  SELECT 
      MONTH(aav.asset_create_date) AS month,
      COUNT(aav.id) AS total_asset
  FROM 
      dbl_users AS u
  JOIN 
      admin_search_access AS sa 
  ON 
      sa.user_id = u.id
  JOIN 
      asset_assign_user_view AS aav 
  ON 
      aav.asset_unit_id = sa.unit_id
  WHERE 
      u.role_id = 2 
      AND u.id = ?  -- Replace ? with the actual value in your code
      AND aav.asset_create_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
  GROUP BY 
      MONTH(aav.asset_create_date)
  ORDER BY 
      MONTH(aav.asset_create_date) DESC;

          `
 };
    

let getListOfDashboardGraph2UnitSuperAdmin = () => {
      return `
  SELECT 
      MONTH(aav.asset_create_date) AS month,
      COUNT(aav.id) AS total_asset
  FROM 
      dbl_users AS u
  JOIN 
      admin_search_access AS sa 
  ON 
      sa.user_id = u.id
  JOIN 
      asset_assign_user_view AS aav 
  ON 
      aav.asset_unit_id = sa.unit_id
  WHERE 
      u.role_id = 4
      AND aav.asset_create_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      AND sa.unit_id in (?)
  GROUP BY 
      MONTH(aav.asset_create_date)
  ORDER BY 
      MONTH(aav.asset_create_date) DESC;

          `
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

let monitorCountData = () => {
  return `SELECT count(id) as total_monitors FROM ${table_name}  WHERE category = 'monitor' and status = 1`; 
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


let adminWiseAccessoriesData = () => {
  return `SELECT 
    COUNT(asset.id) AS total_count,
    SUM(CASE WHEN asset.category = 'Laptop' THEN 1 ELSE 0 END) AS laptop_count,
    SUM(CASE WHEN asset.category = 'Monitor' THEN 1 ELSE 0 END) AS monitor_count,
    SUM(CASE WHEN asset.category = 'Desktop' THEN 1 ELSE 0 END) AS desktop_count,
    SUM(CASE WHEN asset.category = 'Printer' THEN 1 ELSE 0 END) AS printer_count,
    SUM(CASE WHEN asset.category = 'Accessories' THEN 1 ELSE 0 END) AS accessories_count
FROM 
    dbl_users AS u
JOIN 
    admin_search_access AS sa 
ON 
    sa.user_id = u.id
JOIN 
    dbl_asset AS asset 
ON 
    asset.unit_id = sa.unit_id
WHERE 
    u.role_id = 2 
    AND asset.status = 1
    AND u.id = ?;`;
}


let unitSuperAdminWiseAccessoriesData = () => {
  return `SELECT 
    COUNT(u.id) AS total_count,
    SUM(CASE WHEN asset.category = 'Laptop' THEN 1 ELSE 0 END) AS laptop_count,
    SUM(CASE WHEN asset.category = 'Monitor' THEN 1 ELSE 0 END) AS monitor_count,
    SUM(CASE WHEN asset.category = 'Desktop' THEN 1 ELSE 0 END) AS desktop_count,
    SUM(CASE WHEN asset.category = 'Printer' THEN 1 ELSE 0 END) AS printer_count,
    SUM(CASE WHEN asset.category = 'Accessories' THEN 1 ELSE 0 END) AS accessories_count
FROM 
    dbl_users AS u
JOIN 
    admin_search_access AS sa 
ON 
    sa.user_id = u.id
JOIN 
    dbl_asset AS asset 
ON 
    asset.unit_id = sa.unit_id
WHERE 
    u.role_id = 4 
    AND asset.status = 1
    AND sa.unit_id in (?) ;`;
}


let superAdminWiseAccessoriesData = () => {
  return `SELECT 
    COUNT(id) AS total_count,
    SUM(CASE WHEN category = 'Laptop' THEN 1 ELSE 0 END) AS laptop_count,
    SUM(CASE WHEN category = 'Monitor' THEN 1 ELSE 0 END) AS monitor_count,
    SUM(CASE WHEN category = 'Desktop' THEN 1 ELSE 0 END) AS desktop_count,
    SUM(CASE WHEN category = 'Printer' THEN 1 ELSE 0 END) AS printer_count
FROM 
    dbl_asset  

WHERE 
     status != 0`;
}


const assignUnitUserWiseDelete = () => {
    return `DELETE  from admin_search_access  WHERE user_id = ?`;
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
    alreadyAssignUnit,
    adminUnitWisetotalAssetCount,
    monitorCountData,
    employeeWiseAssigntotalAssetCount,
    adminDistributedAssetList,
    adminDistributedTotalAssetList,
    adminWiseAccessoriesData,
    getListOfDashboardGraphAdmin,
    getListOfDashboardGraph2Admin,
    getByIdActiveData,
    assetReport,
    distributedAssetReport,
    getListOfDashboardGraphUnitSuperAdmin,
    getListOfDashboardGraph2UnitSuperAdmin,
    unitSuperAdminWiseAccessoriesData,
    superAdminWiseAccessoriesData,
    getAdminWiseListOfDashboard,
    adminWiseGetListOfDashboard,
    assignUnitUserWiseDelete,
    assetCategoryCount,
    adminDistributedCategoryData
}