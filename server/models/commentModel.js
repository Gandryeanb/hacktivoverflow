const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = require('../models/postModel')

const commentSchema = new Schema({
  body: {
    type: String,
    required: [true, 'Comment required']
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  userLike: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  userDislike: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],
  solving: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

commentSchema.post('save', doc => {
  Post.updateOne({
      _id: doc.postId
    }, {
      $push: {
        commentId: doc._id
      }
    })
    .then(data => {})
})

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment
