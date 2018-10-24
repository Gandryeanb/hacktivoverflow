const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Tag required']
  },
  postId: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }]
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag
