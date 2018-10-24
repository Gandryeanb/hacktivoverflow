const Post = require('../models/postModel')
const Tag = require('../models/tagModel')
const Comment = require('../models/commentModel')
const tagSplitter = require('../helpers/tagSpliter')

class PostController {

  static addViewed(req, res) {
    Post.updateOne({
        _id: req.params.id
      }, {
        views: req.decoded.id
      })
      .then(data => {
        res.status(200).json({
          status: 'success',
          message: 'adding views success'
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: err.message
        })
      })
  }

  static updatePost(req, res) {
    Post.updateOne({
        _id: req.params.id
      }, {
        tagId: []
      })
      .then(data => {
        let tagList = tagSplitter(req.body.tagName)
        let createdTag = []
        let uncreatedTag = []

        let checkTag = new Promise((resolve, reject) => {
          for (let i = 0; i < tagList.length; i++) {
            Tag.findOne({
                name: tagList[i]
              })
              .then(data => {
                if (data) {
                  createdTag.push(data._id)
                  if (i === tagList.length - 1) {
                    resolve()
                  }
                } else {
                  uncreatedTag.push(tagList[i])
                  if (i === tagList.length - 1) {
                    resolve()
                  }
                }
              })
              .catch(err => {
                reject()
              })
          }
        })

        Promise.all([checkTag])
          .then(data => {
            let creatingTag = new Promise((resolve, reject) => {
              if (uncreatedTag.length !== 0 && uncreatedTag[0] !== '') {
                for (let i = 0; i < uncreatedTag.length; i++) {
                  let newData = {
                    name: uncreatedTag[i]
                  }

                  let tag = new Tag(newData)

                  tag
                    .save()
                    .then(data => {
                      createdTag.push(data._id)

                      if (i === uncreatedTag.length - 1) {
                        resolve()
                      }
                    })
                    .catch(err => {
                      reject()
                    })
                }
              } else {
                resolve()
              }
            })

            Promise.all([creatingTag])
              .then(data => {
                Tag.updateMany({
                    postId: req.params.id
                  }, {
                    $pull: {
                      postId: req.params.id
                    }
                  })
                  .then(data => {
                    Post.updateOne({
                        _id: req.params.id
                      }, {
                        title: req.body.title,
                        description: req.body.descriptionHTML,
                        tagId: createdTag,
                      })
                      .then(data => {

                        Tag.updateMany({
                            _id: {
                              $in: createdTag
                            }
                          }, {
                            $push: {
                              postId: req.params.id
                            }
                          })
                          .then(data => {
                            res.status(200).json({
                              status: 'success',
                              message: 'data updated successfully'
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
                  message: 'failed creating post2',
                  err: err.message
                })
              })
          })
          .catch(err => {
            res.status(500).json({
              status: 'failed',
              message: 'error when creating post3'
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

  static createPost(req, res) {
    let tagList = tagSplitter(req.body.tagName)
    let createdTag = []
    let uncreatedTag = []

    let checkTag = new Promise((resolve, reject) => {
      for (let i = 0; i < tagList.length; i++) {
        Tag.findOne({
            name: tagList[i]
          })
          .then(data => {
            if (data) {
              createdTag.push(data._id)
              if (i === tagList.length - 1) {
                resolve()
              }
            } else {
              uncreatedTag.push(tagList[i])
              if (i === tagList.length - 1) {
                resolve()
              }
            }
          })
          .catch(err => {
            reject()
          })
      }
    })

    Promise.all([checkTag])
      .then(data => {
        let creatingTag = new Promise((resolve, reject) => {
          if (uncreatedTag.length !== 0) {
            for (let i = 0; i < uncreatedTag.length; i++) {
              let newData = {
                name: uncreatedTag[i]
              }

              let tag = new Tag(newData)

              tag
                .save()
                .then(data => {
                  createdTag.push(data._id)

                  if (i === uncreatedTag.length - 1) {
                    resolve()
                  }
                })
                .catch(err => {
                  reject()
                })
            }
          } else {
            resolve()
          }
        })

        Promise.all([creatingTag])
          .then(data => {

            setTimeout(() => {

              console.log(createdTag)
              let posData = {
                title: req.body.title,
                description: req.body.descriptionHTML,
                tagId: createdTag,
                userId: req.decoded.id
              }
              let pos = new Post(posData)

              pos
                .save()
                .then(dataPost => {
                  Tag.updateMany({
                      _id: {
                        $in: createdTag
                      }
                    }, {
                      $push: {
                        postId: dataPost._id
                      }
                    })
                    .then(data => {
                      res.status(201).json({
                        status: 'success',
                        dataPost
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
            }, 100)

          })
          .catch(err => {
            res.status(500).json({
              status: 'failed',
              message: 'failed creating post2'
            })
          })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: 'error when creating post3'
        })
      })
  }

  static getPostByQuery(req, res) {
    Post.find({
        title: {
          $regex: req.params.title,
          $options: 'i'
        }
      })
      .populate('tagId')
      .populate('userId')
      .populate({
        path: 'commentId',
        populate: {
          path: 'userId'
        }
      })
      .then(data => {
        res.status(200).json({
          status: 'success',
          data
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: err.message
        })
      })
  }

  static getAllPost(req, res) {
    Post.find()
      .populate('tagId')
      .populate('userId')
      .populate({
        path: 'commentId',
        populate: {
          path: 'userId'
        }
      })
      .then(data => {
        res.status(200).json({
          status: 'success',
          data
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: err.message
        })
      })
  }

  static getPostDetail(req, res) {
    Post.findOne({
        _id: req.params.id
      })
      .populate('userId')
      .populate({
        path: 'commentId',
        populate: {
          path: 'userId'
        }
      })
      .populate('tagId')
      .then(data => {
        res.status(200).json({
          status: 'success',
          data
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: err.message
        })
      })
  }

  static upvote(req, res) {
    Post.updateOne({
        _id: req.params.id
      }, {
        $push: {
          userLike: req.decoded.id
        }
      })
      .then(data => {
        Post.updateOne({
            _id: req.params.id
          }, {
            $pull: {
              userDislike: req.decoded.id
            }
          })
          .then(data => {
            res.status(200).json({
              status: 'success',
              message: 'upvoting post success'
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
    Post.updateOne({
        _id: req.params.id
      }, {
        $pull: {
          userLike: req.decoded.id
        }
      })
      .then(data => {
        Post.updateOne({
            _id: req.params.id
          }, {
            $push: {
              userDislike: req.decoded.id
            }
          })
          .then(data => {
            res.status(200).json({
              status: 'success',
              message: 'upvoting post success'
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

  static removePost(req, res) {
    Comment.find({
        postId: req.params.id
      })
      .then(data => {
        let removeAllComment = new Promise((resolve, reject) => {
          if (data.length !== 0) {
            for (let i = 0; i < data.length; i++) {
              Comment.deleteOne({
                  _id: data[i]._id
                })
                .then(data => {
                  if (i === data.length - 1) {
                    resolve()
                  }
                })
                .catch(err => {
                  reject()
                })
            }
            resolve()
          } else {
            resolve()
          }
        })

        Promise.all([removeAllComment])
          .then(data => {
            Post.deleteOne({
                _id: req.params.id
              })
              .then(data => {
                Tag.updateMany({
                    postId: req.params.id
                  }, {
                    $pull: {
                      postId: req.params.id
                    }
                  })
                  .then(data => {
                    res.status(200).json({
                      status: 'success',
                      message: 'deleting post success'
                    })
                  })
                  .catch(err => {
                    res.status(500).json({
                      status: 'failed',
                      message: 'deleting post failed'
                    })
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
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: err.message
        })
      })
  }
}

module.exports = PostController
