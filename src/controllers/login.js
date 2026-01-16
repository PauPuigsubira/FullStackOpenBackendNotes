const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  
  const user = await User.findOne({ username })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)
  const compareResult = await bcrypt.compare(password, user ? user.passwordHash : '')
  console.log('bcrypt compare result:', compareResult)
  console.log('password correct:', passwordCorrect)
  if (!(user && passwordCorrect)) {
    console.log('invalid username or password attempt')
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }
  console.log('login successful for user:', username)
  const userForToken = {
    username: user.username,
    id: user._id,
  }
  // Generate JWT token that expires in 1 hour (60*60=3600 seconds)
  const token = jwt.sign(
    userForToken, 
    process.env.SECRET,     
    { expiresIn: 60*60 }
  )
  console.log('generated token:', token)
  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter