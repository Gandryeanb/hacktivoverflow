const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: String,
    required: [true, 'title required']
  },
  description: {
    type: String,
    required: [true, 'description required']
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  tagId: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  commentId: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  userLike: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  userDislike: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  solved: {
    type: Number,
    default: 0
  },
  views: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});


const Post = mongoose.model('Post', postSchema);

module.exports = Post
