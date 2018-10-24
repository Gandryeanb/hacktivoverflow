const jwt = require('jsonwebtoken')

const isLogin = (req, res, next) => {
  let token = req.headers.token

  if (token) {
    let decoded = jwt.verify(req.headers.token, process.env.JWT_HASH)

    if (decoded) {

      req.decoded = decoded
      next()

    } else {
      res.status(500).json({
        status: 'failed',
        message: 'wrong token'
      })
    }

  } else {
    res.status(403).json({
      status: 'failed',
      message: 'you need to login first'
    })
  }
}

module.exports = isLogin
