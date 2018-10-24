require('dotenv').config()
const CronJob = require('cron').CronJob
const User = require('../models/userModel')
const emailSender = require('../helpers/emailSender')
const kue = require('kue')
const queue = kue.createQueue()
const mongoose = require('mongoose')
const db = mongoose.connection
const {
  sendVoucher
} = emailSender

mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb://localhost/hackverflow' || process.env.DB_PRODUCTION, {
  useNewUrlParser: true
})

console.log('Before job instantiation')
const job = new CronJob('0 0 17 8 *', function () {

  let luckyUser = []

  let get10RandomUser = new Promise((resolve, reject) => {
    for (let i = 0; i < 10; i++) {
      User.findOne()
        .then(data => {
          if (luckyUser.length === 0) {
            luckyUser.push(data.email)
          } else {
            let alreadyPicked = false
            for (let j = 0; j < luckyUser.length; j++) {
              if (luckyUser[j] === data.email) {
                alreadyPicked = true
              }
            }

            if (!alreadyPicked) {
              luckyUser.push(data.email)
              if (i === 10 - 1) {
                resolve()
              }
            } else {
              i--
            }
          }
        })
        .catch(err => {
          console.log(err.message)
          reject()
        })
    }
  })

  Promise.all([get10RandomUser])
    .then(data => {
      let sendEmailToLuckyUser = new Promise((resolve, reject) => {
        for (let i = 0; i < luckyUser.length; i++) {
          let voucher = jwt.sign({
            email: data.email
          }, process.env.JWT_HASH)

          queue.create('Email-Voucher17an', {
            toEmail: data.email,
            voucher
          }).priority('high').removeOnComplete(true).save(err => {
            if (!err) {
              console.log('job Email-Verification created successfuly')
            } else {
              console.log(err)
            }
          })
        }
      })

      Promise.all([sendEmailToLuckyUser])
        .then(data => {
          queue.process('Email-Verification', (job, done) => {
            sendVoucher(job.data.toEmail, job.data.voucher)
            done()
          })
        })
        .catch(err => {
          console.log(err.response)
        })
    })
    .catch(err => {
      console.log(err.message)
    })
})

db
  .on('error', console.error.bind(console, 'connection error:'))
  .once('open', function () {
    console.log(`> BD on CRON Connected`)
  });


console.log('After job instantiation')
job.start()

kue.app.listen(3002, () => {
  console.log('> Kue CRON 17an Online')
})
