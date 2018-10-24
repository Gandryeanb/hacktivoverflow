const tagSplitter = (val) => {

  let newVal = val.split(' ')
  for (let i = 0; i < newVal.length; i++) {
    newVal[i] = newVal[i].toLowerCase()
  }
  return newVal
}

module.exports = tagSplitter
