const errorHandler = error => {
  let message
  for (let errorName in error.errors) {
    if (error.errors[errorName].message)
      message = error.errors[errorName].message
  }
  return message
}

module.exports = { errorHandler }
