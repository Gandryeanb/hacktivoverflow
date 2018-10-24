const Comment = require('../models/commentModel')
const Post = require('../models/postModel')

class CommentController {

  static createComment(req, res) {
    let data = {
      body: req.body.commentHTMLInput,
      userId: req.decoded.id,
      postId: req.params.id
    }

    let comment = new Comment(data)

    comment.save()
      .then(data => {
        res.status(201).json({
          status: 'success',
          message: `creating comment with success`
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: err.message
        })
      })
  }

  static removeComment(req, res) {
    Comment.deleteOne({
        _id: req.params.id
      })
      .then(data => {

        Post.updateOne({
            commentId: req.params.id
          }, {
            $pull: {
              commentId: req.params.id
            }
          })
          .then(data => {
            res.status(200).json({
              status: 'success',
              message: 'comment deleted successfully'
            })
          })
          .catch(err => {
            res.status(500).json({
              status: 'failed',
              message: err.message
            })
          })
      })
      .catch(err => {
        res.status(200).json({
          status: 'failed',
          message: err.message
        })
      })
  }

  static upvote(req, res) {
    Comment.updateOne({
        _id: req.params.id
      }, {
        $push: {
          userLike: req.decoded.id
        }
      })
      .then(data => {
        Comment.updateOne({
            _id: req.params.id
          }, {
            $pull: {
              userDislike: req.decoded.id
            }
          })
          .then(data => {
            res.status(200).json({
              status: 'success',
              message: 'upvoting comment success'
            })
          })
          .catch(err => {
            res.status(500).json({
              status: 'failed',
              message: err.message
            })
          })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: err.message
        })
      })
  }

  static downvote(req, res) {
    Comment.updateOne({
        _id: req.params.id
      }, {
        $pull: {
          userLike: req.decoded.id
        }
      })
      .then(data => {
        Comment.updateOne({
            _id: req.params.id
          }, {
            $push: {
              userDislike: req.decoded.id
            }
          })
          .then(data => {
            res.status(200).json({
              status: 'success',
              message: 'downvoting comment success'
            })
          })
          .catch(err => {
            res.status(500).json({
              status: 'failed',
              message: err.message
            })
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

module.exports = CommentController
