const taskModel = require("../models/task");
const moment = require('moment-timezone');
const common = require("../common/common");
// 15 min remaining send email  
const taskRemainingSchedule = async () => {
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

           await common.taskRemainingEmail(data.user_email,'Your task starts in the remaining 15 minutes',email_data)
        }
      }
    }
  };
  

module.exports = { taskRemainingSchedule }
