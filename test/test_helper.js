const jwt = require('jsonwebtoken')
const Note = require('../src/models/note')
const User = require('../src/models/user')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
    user: '6960b4daecc037400beb798f'
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
    user: '6960b4daecc037400beb798f'
  }
]

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon', user: '6960b4daecc037400beb798f' })
  await note.save()
  await note.deleteOne()
  return note._id.toString()
}

 const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const getTokenFrom = async () => {
  const users = await usersInDb()

  console.log('Users in DB for token generation:', users)
  const user = users[0]
  console.log('Generating token for user:', user)

  const userForToken = {
    username: user.username,
    id: user.id,
  }
  console.log('Payload for token:', userForToken)
  const token = jwt.sign(
    userForToken, 
    process.env.SECRET,
    { expiresIn: 60*60 }
  )
  console.log('generated token:', token)
  return token
}

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb,
  getTokenFrom
} 