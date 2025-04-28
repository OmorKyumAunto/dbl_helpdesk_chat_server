const cron = require('node-cron');

const {taskRemainingSchedule,ZingHrImplement} = require('../common/api-call')

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

module.exports = {nodeCorn,nodeCornForZingHrSync}






