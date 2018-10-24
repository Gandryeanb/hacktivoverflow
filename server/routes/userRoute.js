const route = require('express').Router()
const UserController = require('../controllers/UserController')
const isLogin = require('../middlewares/isLogin')

route
  .get('/', isLogin, UserController.getUser)
  .get('/verify/:id', UserController.veriryEmail)
  .get('/login/google', UserController.loginGoogle)
  .post('/login', UserController.loginWeb)
  .post('/register', UserController.registration)

module.exports = route
