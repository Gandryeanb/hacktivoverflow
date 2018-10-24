const route = require('express').Router()
const TagController = require('../controllers/TagController')

route
  .get('/', TagController.getAllTag)
  .post('/', TagController.createTag)

module.exports = route
