const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const kue = require('kue')
const axios = require('axios')
const queue = kue.createQueue()
const errCatcher = require('../helpers/errCatcher')
const emailSender = require('../helpers/emailSender')

const {
  sendVerification,
  sendWellcomeEmail
} = emailSender

class UserController {

  static veriryEmail(req, res) {
    let tokenVerify = jwt.verify(req.params.id, process.env.JWT_HASH)

    User.updateOne({
        email: tokenVerify.email
      }, {
        verified: 1
      })
      .then(data => {
        res.status(200).json({
          status: 'success',
          message: 'verifying email success'
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: err.message
        })
      })
  }

  static registration(req, res) {
    let data = {
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      password: req.body.password
    }

    let user = new User(data)


    user.save()
      .then(data => {

        let verifyToken = jwt.sign({
          email: data.email
        }, process.env.JWT_HASH)

        queue.create('Email-Verification', {
          name: data.fname,
          toEmail: data.email,
          verifyToken
        }).priority('high').removeOnComplete(true).save(err => {
          if (!err) {
            console.log('job Email-Verification created successfuly')
          } else {
            console.log(err)
          }
        })

        queue.process('Email-Verification', (job, done) => {
          sendVerification(job.data.toEmail, job.data.name, job.data.verifyToken)
          sendWellcomeEmail(job.data.toEmail, job.data.name)
          done()
        })

        res.status(201).json({
          status: 'success',
          message: `registration with email ${data.email} success, please verify your account before you login`
        })
      })
      .catch(err => {
        let msg = errCatcher(err.message)
        if (msg.indexOf(',')) {
          msg = msg.split(',')[0]
        }
        res.status(500).json({
          status: 'failed',
          message: msg
        })
      })
  }

  static loginWeb(req, res) {
    User.findOne({
        email: req.body.email
      })
      .then(data => {
        if (data) {
          if (bcrypt.compareSync(req.body.password, data.password)) {
            if (data.verified === 1) {
              let token = jwt.sign({
                id: data._id,
                fname: data.fname,
                role: data.role
              }, process.env.JWT_HASH)

              res.status(200).json({
                status: 'success',
                token: token
              })
            } else {
              res.status(403).json({
                status: 'failed',
                message: 'You need to verify your email first'
              })
            }
          } else {
            res.status(500).json({
              status: 'failed',
              message: 'wrong email or password'
            })
          }
        } else {
          res.status(404).json({
            status: 'failed',
            message: 'user not found'
          })
        }
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: err.message
        })
      })
  }

  static loginGoogle(req, res) {
    let token = req.headers.token
    let userNewData = {}
    axios({
        url: `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`,
        method: 'get'
      })
      .then(data => {
        userNewData = data.data
        User.findOne({
            email: data.data.email,
          })
          .then(user => {
            if (user) {
              if (user.loginGoogle === 1) {
                let token = jwt.sign({
                  id: user._id,
                  fname: user.fname,
                  role: user.role
                }, process.env.JWT_HASH)

                res.status(200).json({
                  status: 'success',
                  token: token
                })
              } else {
                User.updateOne({
                    email: user.email
                  }, {
                    loginGoogle: 1
                  })
                  .then(statusUpdate => {
                    let token = jwt.sign({
                      id: user._id,
                      fname: user.fname,
                      role: user.role
                    }, process.env.JWT)

                    res.status(200).json({
                      status: 'success',
                      token: token
                    })
                  })
              }
            } else {

              let newDataUser = {
                fname: userNewData.given_name,
                lname: userNewData.family_name || '',
                email: userNewData.email,
                password: jwt.sign({
                  email: userNewData.email,
                  fname: userNewData.given_name
                }, process.env.JWT_HASH),
                loginGoogle: 1,
                loginWeb: 0,
                verified: 1
              }

              let user = new User(newDataUser)

              user.save()
                .then(data => {

                  let token = jwt.sign({
                    id: data._id,
                    fname: data.fname,
                    role: data.role
                  }, process.env.JWT_HASH)

                  res.status(201).json({
                    status: 'success',
                    token: token
                  })

                })
                .catch(err => {
                  res.status(500).json({
                    status: 'failed',
                    message: err.message
                  })
                })
            }
          })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: 'error when login-in you with google'
        })
      })
  }

  static getUser(req, res) {
    User.findOne({
        _id: req.decoded.id
      })
      .then(data => {
        res.status(200).json({
          status: 'success',
          data: {
            id: data._id,
            fname: data.fname,
            role: data.role,
            avatar: data.avatar
          }
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: err.message
        })
      })
  }

}

module.exports = UserController
