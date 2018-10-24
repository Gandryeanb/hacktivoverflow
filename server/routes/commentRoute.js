const router = require('express').Router()
const CommentController = require('../controllers/CommentController')
const isLogin = require('../middlewares/isLogin')

router
  .post('/:id', isLogin, CommentController.createComment)
  .delete('/:id', isLogin, CommentController.removeComment)
  .get('/up/:id', isLogin, CommentController.upvote)
  .get('/down/:id', isLogin, CommentController.downvote)

module.exports = router
