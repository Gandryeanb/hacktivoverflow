const errCatcher = (errMsg) => {
  let msg = ''

  if (errMsg.indexOf('E11000') !== -1) {
    msg = 'Email already taken'
  } else {
    msg = errMsg.slice(24).split(':')[1].slice(1)
  }
  return msg

}

module.exports = errCatcher
