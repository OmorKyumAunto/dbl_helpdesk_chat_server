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

const currentDateZingHrFormat = ()=>{
  return moment(current_date)
  .tz("Asia/Dhaka")
  .format("DD-MM-YYYY");
}

const convertDateFormat= (inputDate) => {
  const formattedDate = moment(inputDate, 'DD MMM YYYY').format('YYYY-MM-DD');
  return formattedDate;
}

const  addSixHoursAndFormat = (dateString)=> {
  const newDate = moment(dateString).add(6, 'hours').format('YYYY-MM-DD');
  return newDate;
}

module.exports = { current_time, today_date,currentTime,currentDate,convertDateFormat,addSixHoursAndFormat ,currentDateZingHrFormat};


