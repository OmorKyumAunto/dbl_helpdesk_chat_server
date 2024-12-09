let superAdminPermission = [
'employeeList','employeeAdd','employeeAllList','employeeDatails','employeeDetails','employeeDelete','employeeUpdate',"assignAdmin",'changeEmployeeStatus',
"assetUnitList","assetUnitActiveList","assetUnitListLimit","assetUnitAdd","assetUnitUpdate","changeAssetUnitStatus",'assetUnitDelete',
"assignEmployee",
"adminList",
"dashboardData","dashboardGraphData",
"addAsset","assetList","assetAllList","assetUpdate","assetDelete","uploadAsset","updateAsset","assetUnitActiveList",
"distributedAsset","allDistributedAsset","distributedDetails",
"changePassword","employeeDashboard","assetUnitActiveList","adminList",
"employeeAssignList","assetDetails","searchAccess","searchAccessUpdate","adminAssinUnitAsset",


'employeeList','employeeAdd','employeeAllList','employeeDatails','employeeDetails','employeeDelete','employeeUpdate',"assignAdmin",'changeEmployeeStatus',
"assetUnitList","assetUnitActiveList","assetUnitListLimit","assetUnitAdd","assetUnitUpdate","changeAssetUnitStatus",'assetUnitDelete',
"assignEmployee",
"adminList",
"dashboardData","dashboardGraphData",
"addAsset","assetList","assetAllList","assetUpdate","assetDelete","uploadAsset","updateAsset","assetUnitActiveList",
"distributedAsset","allDistributedAsset","distributedDetails",
"changePassword","employeeDashboard","assetUnitActiveList","adminList",
"employeeAssignList","assetDetails","onlyEmployeeList",
"licesesList","licesesActiveList","licesesAdd","licesesUpdate","licesesDelete","licesesStatus",


"employeeAssignList","employeeTotalAssetAssignCount", "employeeUpdate","changePassword","dashboardData","dashboardGraphData","employeeDashboard","distributedDetails",
"adminList","assetUpdate","assetDetails","employeeCalculation",
"locationAdd","updateLocation","locationList","locationActiveList","changeLocationStatus",
"adminDistributedAsset",
"ticketCategoryCreate","ticketCategoryList","ticketCategoryActiveList","assetUnitUpdate","ticketCategoryUpdate","ticketCategoryChangeStatus","ticketCategoryDelete"
];

let adminPermission = [
'employeeList','employeeAdd','employeeAllList','employeeDatails','employeeDetails','employeeDelete','employeeUpdate',"assignAdmin",'changeEmployeeStatus',
"assetUnitList","assetUnitActiveList","assetUnitListLimit","assetUnitAdd","assetUnitUpdate","changeAssetUnitStatus",'assetUnitDelete',
"assignEmployee",
"adminList",
"dashboardData","dashboardGraphData",
"addAsset","assetList","assetAllList","assetUpdate","assetDelete","uploadAsset","updateAsset","assetUnitActiveList",
"distributedAsset","allDistributedAsset","distributedDetails",
"changePassword","employeeDashboard","assetUnitActiveList","adminList",
"employeeAssignList","assetDetails","searchAccess","searchAccessUpdate","adminAssinUnitAsset",

"locationActiveList","locationList","adminDistributedAsset",



'employeeList','employeeAdd','employeeAllList','employeeDatails','employeeDetails','employeeDelete','employeeUpdate',"assignAdmin",'changeEmployeeStatus',
"assetUnitList","assetUnitActiveList","assetUnitListLimit","assetUnitAdd","assetUnitUpdate","changeAssetUnitStatus",'assetUnitDelete',
"assignEmployee",
"adminList",
"dashboardData","dashboardGraphData",
"addAsset","assetList","assetAllList","assetUpdate","assetDelete","uploadAsset","updateAsset","assetUnitActiveList",
"distributedAsset","allDistributedAsset","distributedDetails",
"changePassword","employeeDashboard","assetUnitActiveList","adminList",
"employeeAssignList","assetDetails",



"licesesList","licesesActiveList","licesesAdd","licesesUpdate","licesesDelete","licesesStatus",
"employeeAssignList","employeeTotalAssetAssignCount", "employeeUpdate","changePassword","dashboardData","dashboardGraphData","employeeDashboard","distributedDetails",
"adminList","assetUpdate","assetDetails","onlyEmployeeList","employeeCalculation",
"ticketCategoryActiveList"
];

let employeePermission = [
    
'employeeList','employeeAdd','employeeAllList','employeeDatails','employeeDetails','employeeDelete','employeeUpdate',"assignAdmin",'changeEmployeeStatus',
"assetUnitList","assetUnitActiveList","assetUnitListLimit","assetUnitAdd","assetUnitUpdate","changeAssetUnitStatus",'assetUnitDelete',
"assignEmployee",
"adminList",
"dashboardData","dashboardGraphData",
"addAsset","assetList","assetAllList","assetUpdate","assetDelete","uploadAsset","updateAsset","assetUnitActiveList",
"distributedAsset","allDistributedAsset","distributedDetails",
"changePassword","employeeDashboard","assetUnitActiveList","adminList",
"employeeAssignList","assetDetails","searchAccess","searchAccessUpdate",


'employeeList','employeeAdd','employeeAllList','employeeDatails','employeeDetails','employeeDelete','employeeUpdate',"assignAdmin",'changeEmployeeStatus',
"assetUnitList","assetUnitActiveList","assetUnitListLimit","assetUnitAdd","assetUnitUpdate","changeAssetUnitStatus",'assetUnitDelete',
"assignEmployee",
"adminList",
"dashboardData","dashboardGraphData",
"addAsset","assetList","assetAllList","assetUpdate","assetDelete","uploadAsset","updateAsset","assetUnitActiveList",
"distributedAsset","allDistributedAsset","distributedDetails",
"changePassword","employeeDashboard","assetUnitActiveList","adminList",
"employeeAssignList","assetDetails","onlyEmployeeList",


"licesesList","licesesActiveList","licesesAdd","licesesUpdate","licesesDelete","licesesStatus",
  "employeeAssignList","employeeTotalAssetAssignCount", "employeeUpdate","changePassword","dashboardData","dashboardGraphData","employeeDashboard","distributedDetails",
  "adminList","assetUpdate","assetDetails","employeeCalculation","adminAssinUnitAsset",

  "locationActiveList",
  "ticketCategoryActiveList"
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