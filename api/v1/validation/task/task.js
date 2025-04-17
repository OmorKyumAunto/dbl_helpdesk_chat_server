const moment = require("moment-timezone");

let current_date = new Date();

// Set timezone to Dhaka (Asia/Dhaka)
let current_time = moment(current_date)
  .tz("Asia/Dhaka")
  .format("YYYY-MM-DD HH:mm:ss");

let today_date = moment(current_date)
  .tz("Asia/Dhaka")
  .format("YYYY-MM-DD");


const currentTime = ()=>{
  return moment(current_date)
  .tz("Asia/Dhaka")
  .format("YYYY-MM-DD HH:mm:ss");
}

const currentDate = ()=>{
  return moment(current_date)
  .tz("Asia/Dhaka")
  .format("YYYY-MM-DD");
}

module.exports = { current_time, today_date,currentTime,currentDate };


