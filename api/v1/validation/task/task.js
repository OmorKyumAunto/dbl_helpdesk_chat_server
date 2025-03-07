let current_date = new Date();
const moment = require("moment");
let current_time = moment(current_date, "YYYY-MM-DD HH:mm:ss").format(
  "YYYY-MM-DD HH:mm:ss"
);
module.exports = { current_time };
