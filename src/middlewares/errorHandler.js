const errorHandler = (error, request, response, next) => {
  console.error('error Name: ', error.name) 
  console.error('error message: ', error.message)

  if (
    error.name === 'CastError' ||
    error.name === 'BSONError'
  ) {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

module.exports = errorHandler