const cron = require('node-cron');
const {taskRemainingSchedule,ZingHrImplement,ticketArchive} = require('../common/api-call')

const processSomething = () =>{
    console.log('🔥Running backend at:', new Date().toLocaleString());
}


// Schedule it to run every day at 3am
const nodeCornForZingHrSync = ()=>{
    cron.schedule('00 03 * * *', () => {
      ZingHrImplement()
    });
  
}

// Schedule it to run every minute
const nodeCorn = ()=>{
  cron.schedule('* * * * *', () => {
    processSomething();
    taskRemainingSchedule()
  });

}

 // Schedule to run at 23:59 on 31st December every year
// const nodeCronForAutoTicketingArchive = () => {
//   cron.schedule('59 23 31 12 *', () => {
//     ticketArchive();
//     console.log("Auto Ticket Archive executed on 31st Dec at 11:59 PM");
//   });
// };

const nodeCronForAutoTicketingArchive = () => {
  cron.schedule('14 13 27 12 *', () => {
    ticketArchive();
    console.log("Auto Ticket Archive executed on 27th Dec at 12:42 PM");
  });
};


module.exports = {nodeCorn,nodeCornForZingHrSync,nodeCronForAutoTicketingArchive}






