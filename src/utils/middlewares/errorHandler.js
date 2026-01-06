const logger = require('../logger')

const errorHandler = (error, request, response, next) => {
  logger.error('error Name: ', error.name) 
  logger.error('error message: ', error.message)

  if (
    error.name === 'CastError' ||
    error.name === 'BSONError'
  ) {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  
  next(error)
}

module.exports = errorHandler