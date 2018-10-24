const route = require('express').Router()
const PostController = require('../controllers/PostController')
const isLogin = require('../middlewares/isLogin')

route
  .post('/', isLogin, PostController.createPost)
  .put('/:id', isLogin, PostController.updatePost)
  .put('/view/:id', isLogin, PostController.addViewed)
  .delete('/:id', isLogin, PostController.removePost)
  .get('/:id', PostController.getPostDetail)
  .get('/', PostController.getAllPost)
  .get('/search/:title', PostController.getPostByQuery)
  .get('/up/:id', isLogin, PostController.upvote)
  .get('/down/:id', isLogin, PostController.downvote)

module.exports = route
