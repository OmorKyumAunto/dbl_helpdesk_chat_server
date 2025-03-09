let current_date = new Date();
const moment = require("moment");
let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format(
  "YYYY-MM-DD HH:mm:ss"
);

let today_date = moment(current_date, "YYYY-MM-DD ").format(
  "YYYY-MM-DD"
);
module.exports = { current_time,today_date };
