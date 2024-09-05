let superAdminPermission = [
'employeeList','employeeAdd','employeeAllList','employeeDatails','employeeDetails','employeeDelete','employeeUpdate',"assignAdmin",
"assetUnitList","assetUnitActiveList","assetUnitListLimit","assetUnitAdd",
];

let adminPermission = [
   
'employeeList','employeeAdd','employeeAllList','employeeDatails','employeeDetails','employeeUpdate','assetUnitDelete',"changeAssetUnitStatus",
];

let employeePermission = [
    
  
];





let getRouterPermissionList = async(id = 0) => {
    return new Promise((resolve, reject) => {
        if (id === 1) resolve(superAdminPermission);
        else if (id === 2) resolve(adminPermission);
        else if (id === 3) resolve(employeePermission);
        else resolve([]);
    });
}


module.exports = {
    getRouterPermissionList
}