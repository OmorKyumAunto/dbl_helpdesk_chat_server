let superAdminPermission = [
'employeeList','employeeAdd','employeeAllList','employeeDatails','employeeDetails','employeeDelete','employeeUpdate',"assignAdmin",'changeEmployeeStatus',
"assetUnitList","assetUnitActiveList","assetUnitListLimit","assetUnitAdd","assetUnitUpdate","changeAssetUnitStatus",'assetUnitDelete',
"assignEmployee",
"adminList",
"dashboardData","dashboardGraphData",
"addAsset","assetList","assetAllList","assetUpdate","assetDelete","uploadAsset","updateAsset",
"distributedAsset","allDistributedAsset","distributedDetails",
];

let adminPermission = [
   
'employeeList','employeeAdd','employeeAllList','employeeDatails','employeeDetails','employeeUpdate','assignEmployee','changeEmployeeStatus',

"dashboardData","dashboardGraphData",
"addAsset","assetList","assetAllList","assetUpdate","assetDelete","uploadAsset","updateAsset",
"distributedAsset","allDistributedAsset","distributedDetails",
];

let employeePermission = [
    
  "employeeAssignList","employeeTotalAssetAssignCount", "employeeUpdate",
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