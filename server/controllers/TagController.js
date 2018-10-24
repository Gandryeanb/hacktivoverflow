const Tag = require('../models/tagModel')

class TagController {

  static createTag(req, res) {
    let data = {
      name: req.body.tagName
    }

    let tag = new Tag(data)

    tag.save()
      .then(data => {
        res.status(201).json({
          status: 'success',
          message: `creating category with name ${data.name} is success`
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: err.message
        })
      })
  }

  static getAllTag(req, res) {
    Tag.find()
      .populate('postId')
      .then(data => {
        res.status(200).json({
          status: 'success',
          data: data
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

module.exports = TagController
