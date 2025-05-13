const axios = require('axios');
const express = require("express");
const taskModel = require("../models/task");
const moment = require('moment-timezone');
const common = require("../common/common");
const userModel = require("../models/user");
const employeeModel = require("../models/employee");
const adminModel = require("../models/admins ");
const superAdminModel = require("../models/super-admins");
const zingHrOperationsModel = require("../models/zingHr-operations");
const {today_date,convertDateFormat,addSixHoursAndFormat,currentDateZingHrFormat} = require('../validation/task/task')
const bcrypt = require("bcrypt");
require('dotenv').config();
// 15 min remaining send email  
const taskRemainingSchedule = async () => {
    try {
        const result = await taskModel.taskScheduleList();
        const currentDate = moment().tz("Asia/Dhaka").format('YYYY-MM-DD');
        const currentTime = moment().tz("Asia/Dhaka").format('HH:mm:ss');
    
        for (let index = 0; index < result.length; index++) {
          const data = result[index];
        
          const dbDate = moment(data.start_date).tz("Asia/Dhaka").format('YYYY-MM-DD');
      
          if (dbDate === currentDate) {
            const taskTime = `${dbDate} ${data.start_time}`; 
      
            // Subtract 15 minutes
            const remainingTime = moment.tz(taskTime, "YYYY-MM-DD HH:mm:ss", "Asia/Dhaka")
              .subtract(15, 'minutes')
              .format('HH:mm:ss');
      
      
            if (currentTime === remainingTime) {
              const email_data = {
               user_name : data.user_name,
               task_code : data.task_code,
               quantity : data.quantity,
               category_title : data.category_title,
               start_date : await common.convertDateFormat(data.start_date)
               || '',
               start_time : await common.convertTimeStringTo12Hour(data.start_time)
                       || '',
               
              }
    
               await common.taskRemainingEmail(data.user_email,'Task Reminder',email_data)
            }
          }
        }
       } catch (error) {
        console.log("Task remaining error:",error)
       }
};
  


// zing hr implement  
const ZingHrImplement = async (req,res) => {
    try {
        console.log("Zing HR Sync to Help Desk process start ==>>")
        // Prepare API request body
        const requestBody = {
          SubscriptionName: process.env.SubscriptionName,
          Token: process.env.ZingHrToken,
          PageSize: "20000",
          PageNumber: "1",
          Fromdate: "01-01-1990",
          Todate: currentDateZingHrFormat,
          EmpFlag: ""
        };

        // Set a high timeout limit (default is 0 = no timeout)
        const axiosConfig = {
          headers: {
            'Content-Type': 'application/json'
          }
        //   ,
        //   timeout: 5 * 60 * 1000 // 5 minutes in ms
        };
        // Make API request
        const zingResponse = await axios.post(
          'https://portal.zinghr.com/2015/route/EmployeeDetails/GetEmployeeMasterDetails',
          requestBody,
          axiosConfig
        );
        if (zingResponse.data.Employees) {
   
    let sum = 0
    let total_update = 0
    let total_add = 0

    const employees = zingResponse.data?.Employees || [];
    for (let index = 0; index < employees.length; index++) {
        try {
           const data = employees[index];
           if (data.EmployeeCode && data.EmployeeCode.startsWith('151')) {
            
               if (data.EmployeeStatus === 'Existing' || data.EmployeeStatus === 'NewJoinee') {
                   
                   const getAttributeValue = (id) => {
                       const found = data.Attributes.find(attr => attr.AttributeTypeID === id);
                       return found ? found.AttributeTypeUnitDesc : null;
                   }
       
                   const employee = {
                       name: `${data.FirstName} ${data.LastName}`,
                       employee_id: data.EmployeeCode,
                       department: getAttributeValue("53"),
                       designation: getAttributeValue("56"),
                       email: data.Email,
                       contact_no: data.Mobile,
                       joining_date: convertDateFormat(data.DateofJoining),  // if needed can convert date format here
                       unit_name: getAttributeValue("50"),
                       business_type: getAttributeValue("76"),
                       line_of_business: getAttributeValue("51"),
                       grade: getAttributeValue("57"),
                       location : getAttributeValue("48"),
                       date_of_birth : convertDateFormat(data.DateofBirth),
                       line_manager_name : data.ReportingManagerName,
                       line_manager_id : data.ReportingManagerCode
                   }
                   const helpDeskData = await userModel.getByEmployeeId(data.EmployeeCode)
                  
                   let is_update = 0
                   let updateData = {}
                   let userUpdateData = {}
               
       
                   if(helpDeskData.length){
                   
                    if(helpDeskData[0].role_id === 3){
                       
                       const employeeData = await employeeModel.getByEmployeeId(data.EmployeeCode)
   
                       const helpDeskEmployeeData = {
                           name : employeeData[0]?.name || '',
                           employee_id : employeeData[0]?.employee_id || '',
                           department: employeeData[0]?.department || '',
                           designation: employeeData[0]?.designation || '',
                           email: employeeData[0]?.email || '',
                           contact_no: employeeData[0]?.contact_no || '',
                           joining_date: addSixHoursAndFormat(employeeData[0]?.joining_date)|| '',
                           unit_name: employeeData[0]?.unit_name || '',
                           business_type: employeeData[0]?.business_type || '',
                           line_of_business: employeeData[0]?.line_of_business || '',
                           grade : employeeData[0]?.grade || '',
                           location : employeeData[0]?.location || '',
                           date_of_birth : addSixHoursAndFormat(employeeData[0]?.date_of_birth) || '',
                           line_manager_name : employeeData[0]?.line_manager_name || '',
                           line_manager_id : employeeData[0]?.line_manager_id || '',
                       }
              
                       // check and update help desk employee data and zing hr data
                       if(helpDeskEmployeeData.name !== employee.name){
                         is_update = 1
                         updateData.name  = employee.name
                         userUpdateData.name = employee.name
                       }
                      
                        if(helpDeskEmployeeData.department !== employee.department){
                           is_update = 1
                           updateData.department  = employee.department
                       }
                        if(helpDeskEmployeeData.designation !== employee.designation){
                           is_update = 1
                           updateData.designation  = employee.designation
                       }
                        if((helpDeskEmployeeData.email || '') !== employee.email){
                           is_update = 1
                           updateData.email  = employee.email
                           userUpdateData.email = employee.email
                       }
                        if(helpDeskEmployeeData.contact_no !== employee.contact_no){
                           is_update = 1
                           updateData.contact_no  = employee.contact_no
                       }
                        if(helpDeskEmployeeData.joining_date !== employee.joining_date){
                           is_update = 1
                           updateData.joining_date  =employee.joining_date
                       }
                        if(helpDeskEmployeeData.unit_name !== employee.unit_name){
                           is_update = 1
                           updateData.unit_name  = employee.unit_name
                       }
                        if(helpDeskEmployeeData.business_type !== employee.business_type){
                           is_update = 1
                           updateData.business_type  = employee.business_type
                       }
                        if(helpDeskEmployeeData.line_of_business !== employee.line_of_business){
                           is_update = 1
                           updateData.line_of_business  = employee.line_of_business
                       }
                        if(helpDeskEmployeeData.grade !== employee.grade){
                           is_update = 1
                           updateData.grade  = employee.grade
                       }
                        if(helpDeskEmployeeData.grade !== employee.grade){
                        is_update = 1
                        updateData.grade  = employee.grade
                       }
                        if(helpDeskEmployeeData.date_of_birth !== employee.date_of_birth){
                            is_update = 1
                            updateData.date_of_birth  = employee.date_of_birth
                        }
                        if(helpDeskEmployeeData.location !== employee.location){
                            is_update = 1
                            updateData.location  = employee.location
                        }
                        if(helpDeskEmployeeData.line_manager_name !== employee.line_manager_name){
                            is_update = 1
                            updateData.line_manager_name  = employee.line_manager_name
                        }
                        if(helpDeskEmployeeData.line_manager_id !== employee.line_manager_id){
                            is_update = 1
                            updateData.line_manager_id  = employee.line_manager_id
                    }

                   if(is_update === 1){
                    total_update++
                       await Promise.all([
                           employeeModel.updateById(helpDeskData[0].profile_id, updateData),
                           userModel.updateById(userUpdateData,helpDeskData[0].id)
                           
                       ]);
                      
                   }else{
                       console.log("nothing update to employee")
                   }
                       
                    }
                    if(helpDeskData[0].role_id === 2){
                       const adminData = await adminModel.getByEmployeeId(data.EmployeeCode)
                       const helpDeskEmployeeData = {
                           name : adminData[0]?.name || '',
                           employee_id : adminData[0]?.employee_id || '',
                           department: adminData[0]?.department || '',
                           designation: adminData[0]?.designation || '',
                           email: adminData[0]?.email || '',
                           contact_no: adminData[0]?.contact_no || '',
                           joining_date: addSixHoursAndFormat(adminData[0]?.joining_date) || '',
                           unit_name: adminData[0]?.unit_name || '',
                           business_type: adminData[0]?.business_type || '',
                           line_of_business: adminData[0]?.line_of_business || '',
                           grade : adminData[0]?.grade || '',
                           location : adminData[0]?.location || '',
                           date_of_birth : addSixHoursAndFormat(adminData[0]?.date_of_birth) || '',
                           line_manager_name : adminData[0]?.line_manager_name || '',
                           line_manager_id : adminData[0]?.line_manager_id || '',
                       }
                     
                       // check and update help desk employee data and zing hr data
                       if(helpDeskEmployeeData.name !== employee.name){
                         is_update = 1
                         updateData.name  = employee.name
                         userUpdateData.name = employee.name
                       }
                        if(helpDeskEmployeeData.department !== employee.department){
                           is_update = 1
                         updateData.department  = employee.department
                       }
                        if(helpDeskEmployeeData.designation !== employee.designation){
                           is_update = 1
                           updateData.designation  = employee.designation
                       }
                        if((helpDeskEmployeeData.email || '') !== employee.email){
                           is_update = 1
                           updateData.email  = employee.email
                           userUpdateData.email = employee.email
                          
                       }
                        if(helpDeskEmployeeData.contact_no !== employee.contact_no){
                           is_update = 1
                           updateData.contact_no  = employee.contact_no
                          
                       }
                       
                        if(helpDeskEmployeeData.joining_date !== employee.joining_date){
                           is_update = 1
                           updateData.joining_date  = employee.joining_date
                           
                       }
                        if(helpDeskEmployeeData.unit_name !== employee.unit_name){
                           is_update = 1
                           updateData.unit_name  = employee.unit_name
                          
                       }
                        if(helpDeskEmployeeData.business_type !== employee.business_type){
                           is_update = 1
                           updateData.business_type  = employee.business_type
                          
                       }
                        if(helpDeskEmployeeData.line_of_business !== employee.line_of_business){
                           is_update = 1
                           updateData.line_of_business  = employee.line_of_business
                          
                       }
                        if(helpDeskEmployeeData.grade !== employee.grade){
                           is_update = 1
                           updateData.grade  = employee.grade
                          
                       }
                        if(helpDeskEmployeeData.date_of_birth !== employee.date_of_birth){
                            is_update = 1
                            updateData.date_of_birth  = employee.date_of_birth
                        }
                        if(helpDeskEmployeeData.location !== employee.location){
                            is_update = 1
                            updateData.location  = employee.location
                        }
                        if(helpDeskEmployeeData.line_manager_name !== employee.line_manager_name){
                            is_update = 1
                            updateData.line_manager_name  = employee.line_manager_name
                        }
                        if(helpDeskEmployeeData.line_manager_id !== employee.line_manager_id){
                            is_update = 1
                            updateData.line_manager_id  = employee.line_manager_id
                        }
   
                       if(is_update === 1){
                        total_update++
                           await Promise.all([
                               adminModel.updateById(helpDeskData[0].profile_id, updateData),
                               userModel.updateById(userUpdateData,helpDeskData[0].id),
                               
                           ]);
                    
                       }else{
                           console.log("Nothing to update")
                       }
                       
                    }
                    if(helpDeskData[0].role_id === 1){
      
                        const superAdminData = await superAdminModel.getByEmployeeId(data.EmployeeCode)
                        const helpDeskEmployeeData = {
                            name : superAdminData[0]?.name || '',
                            employee_id : superAdminData[0]?.employee_id || '',
                            department: superAdminData[0]?.department || '',
                            designation: superAdminData[0]?.designation || '',
                            email: superAdminData[0]?.email || '',
                            contact_no: superAdminData[0]?.contact_no || '',
                            joining_date: addSixHoursAndFormat(superAdminData[0]?.joining_date) || '',
                            unit_name: superAdminData[0]?.unit_name || '',
                            business_type: superAdminData[0]?.business_type || '',
                            line_of_business: superAdminData[0]?.line_of_business || '',
                            grade : superAdminData[0]?.grade || '',
                            location : superAdminData[0]?.location || '',
                            date_of_birth : addSixHoursAndFormat(superAdminData[0]?.date_of_birth) || '',
                            line_manager_name : superAdminData[0]?.line_manager_name || '',
                            line_manager_id : superAdminData[0]?.line_manager_id || '',
                        }
           
      
                        // check and update help desk employee data and zing hr data
                        if(helpDeskEmployeeData.name !== employee.name){
                          is_update = 1
                          updateData.name  = employee.name
                          userUpdateData.name = employee.name
                        }
                         if(helpDeskEmployeeData.department !== employee.department){
                            is_update = 1
                          updateData.department  = employee.department
                        }
                         if(helpDeskEmployeeData.designation !== employee.designation){
                            is_update = 1
                            updateData.designation  = employee.designation
                        }
                         if((helpDeskEmployeeData.email || '') !== employee.email){
                            is_update = 1
                            updateData.email  = employee.email
                            userUpdateData.email = employee.email
                           
                        }
                         if(helpDeskEmployeeData.contact_no !== employee.contact_no){
                            is_update = 1
                            updateData.contact_no  = employee.contact_no
                           
                        }
                        
                    
                         if(helpDeskEmployeeData.joining_date !== employee.joining_date){
                            is_update = 1
                            updateData.joining_date  = employee.joining_date
                            
                        }
                         if(helpDeskEmployeeData.unit_name !== employee.unit_name){
                            is_update = 1
                            updateData.unit_name  = employee.unit_name
                           
                        }
                         if(helpDeskEmployeeData.business_type !== employee.business_type){
                            is_update = 1
                            updateData.business_type  = employee.business_type
                           
                        }
                         if(helpDeskEmployeeData.line_of_business !== employee.line_of_business){
                            is_update = 1
                            updateData.line_of_business  = employee.line_of_business
                           
                        }
                         if(helpDeskEmployeeData.grade !== employee.grade){
                            is_update = 1
                            updateData.grade  = employee.grade
                           
                        }
                         if(helpDeskEmployeeData.date_of_birth !== employee.date_of_birth){
                             is_update = 1
                             updateData.date_of_birth  = employee.date_of_birth
                         }
                         if(helpDeskEmployeeData.location !== employee.location){
                             is_update = 1
                             updateData.location  = employee.location
                         }
                         if(helpDeskEmployeeData.line_manager_name !== employee.line_manager_name){
                             is_update = 1
                             updateData.line_manager_name  = employee.line_manager_name
                         }
                         if(helpDeskEmployeeData.line_manager_id !== employee.line_manager_id){
                             is_update = 1
                             updateData.line_manager_id  = employee.line_manager_id
                         }
      
                        if(is_update === 1){
                         total_update++
                            await Promise.all([
                                superAdminModel.updateById(helpDeskData[0].profile_id, updateData),
                                userModel.updateById(userUpdateData,helpDeskData[0].id),
                                
                            ]);
                     
                        }else{
                            console.log("Nothing to update")
                        }
                        
                     }             
                    else{
                        console.log("Nothing has this role id")
                     }
                    
                   }else{
                       await Promise.all([
                           (async () => {
                       //checkEmailFormat
                        const checkFormat = await commonObject.checkEmailFormat(employee.email)
                        if(checkFormat === false){
                          employee.licenses = '[10]' 
                        }else{
                          employee.licenses = '' 
                        }

                             const createdEmployee = await employeeModel.addNew(employee);
                             const userData = {
                               name: employee.name,
                               employee_id: employee.employee_id,
                               role_id: 3,
                               profile_id: createdEmployee.insertId,
                               email: employee.email,
                               password: bcrypt.hashSync(employee.employee_id.toString(), 10)
                             };
                             await userModel.addNew(userData);
                           })()
                         ]);
                         
                         total_add ++
                   }
                   
                 
               }else{
                console.log("This employee id is deleted: ",data.EmployeeCode)
               }
           }else{
               console.log("Nothing have any employee code: ",data.EmployeeCode)
           }
        } catch (error) {
            console.error(`Error processing employee at index ${index}:`, error.message);
            continue; 
        }
        sum++
    }
   
   console.log("TOTAL SUM ==> : ", sum)
   console.log("TOTAL update ==> : ", total_update)
   console.log("TOTAL add ==> : ", total_add)
  
   const operations ={
           status :'success',
           operation_date : today_date,
           operation_method : 'auto',
           get_zing_data : sum,
           total_update : total_update,
           total_add : total_add
   }
    await zingHrOperationsModel.addNew(operations)
    console.log("Zing HR Sync to Help Desk process end =>>")
    } else {
      console.log("There has no employee data.")
    }

    } catch (error) {
        const operations ={
            status :'failed',
            operation_method :'auto',
            operation_date : today_date,
    }
       await zingHrOperationsModel.addNew(operations)
       console.log("Zing HR operation failed to Catch stage : ",error)
  }
};

module.exports = { taskRemainingSchedule,ZingHrImplement }
