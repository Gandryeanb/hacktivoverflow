require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 80
const cors = require('cors')
const mongoose = require('mongoose')
const db = mongoose.connection
const kue = require('kue')

mongoose.set('useCreateIndex', true)
mongoose.connect(process.env.DB_DEV || process.env.DB_PRODUCTION, {
  useNewUrlParser: true
})

const userRoute = require('./routes/userRoute')
const tagRoute = require('./routes/tagRoute')
const postRoute = require('./routes/postRoute')
const commentRoute = require('./routes/commentRoute')

app
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({
    extended: false
  }))
  .use('/comment', commentRoute)
  .use('/post', postRoute)
  .use('/tag', tagRoute)
  .use('/users', userRoute)
  .use('/', (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'server hackverflow is active'
    })
  })

  .listen(port, () => {
    console.log(`\n> Server running on port ${port}`)
  })

db
  .on('error', console.error.bind(console, 'connection error:'))
  .once('open', function () {
    console.log(`> BD Connected`)
  });

kue.app.listen(3001, () => {
  console.log('> Kue On Server Online')
})
