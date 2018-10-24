const CronJob = require('cron').CronJob

const job = new CronJob('* * * * * *', function () {
  console.log('masuk')
})

job.start()
