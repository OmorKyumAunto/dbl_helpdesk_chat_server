const cron = require('node-cron');

const {taskRemainingSchedule} = require('../common/api-call')

const processSomething = () =>{
    console.log('🔥Running backend at:', new Date().toLocaleString());
}


// Schedule it to run every minute
const nodeCorn = ()=>{
    cron.schedule('* * * * *', () => {
      processSomething();
      taskRemainingSchedule()
    });
  
  }

module.exports = {nodeCorn}






