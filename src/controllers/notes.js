const jwt = require('jsonwebtoken')
const notesRouter = require('express').Router()
const Note = require("../models/note");
const User = require('../models/user')
//const { ObjectId } = require('../models/note');
const { info } = require('../utils/logger');

const getTokenFrom = request => {
  console.log('Getting token from request headers...')
  const authorization = request.get('Authorization')
  console.log('Authorization header:', authorization)
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  console.log('No token found in request')
  return null
}

notesRouter.get('/', async(request, response) => {
  info('GET Notes',request.path)
/*
  Note
    .find({})
    .then(result => {
      info(result)
      response.json(result)
    })
    .catch(err => response.status(400).json('Error: ' + err));  
*/

//  try {
    const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
    info(notes)
    response.json(notes)
//  } catch (error) {
//    response.status(400).json('Error: ' + error)
//  }

});

notesRouter.get('/:id', async (request, response) => {
  const id = request.params.id;
/*
  Note
    .find({_id: new ObjectId(id)})
    .then(result => {
      info('with id', id, result)
      if (result.length > 0) {
        response.json(result[0])
      } else {
        response.status(404).end(`Note with id ${id} not found`);
      }
    })
    .catch(err => next(err));
*/

//  try {
    const note = await Note.findById(id)
    if (note) {
      response.json(note)
    } else {
      response.status(404).end(`Note with id ${id} not found`);
    }
//  } catch (error) {
//    next(error)
//  }

});

notesRouter.post('/', async (request, response) => {
  const body = request.body;
  console.log('POST body:', body);
  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }
  console.log('Getting token from request...', request.headers)
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)  
    console.log('decoded token:', decodedToken)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  
  const user = await User.findById(decodedToken.id)
  console.log('User found by decoded token id:', user)
  //const user = await User.findById(body.userId);
  //console.log('User for new note:', user);
  const note = new Note({
    content: body.content,
    important: Boolean(body.important) || false,
    user: user.id,
  });
/*
  note
    .save()
    .then(savedNote => response.status(201).json(savedNote))
    .catch(error => next(error))
*/

//  try {
    const savedNote = await note.save()
    //console.log('Saved note:', savedNote)
    //console.log('user', user)
    user.notes = user.notes.concat(savedNote.id)
    await user.save()

    response.status(201).json(savedNote)
//  } catch (error) {
//    next(error)
//  }

});

notesRouter.delete('/:id', async (request, response) => {
/*
  Note.findByIdAndDelete(request.params.id)
    .then(()=> {
      response.status(204).end()
    })
    .catch(error => next(error))
*/

//  try {
    await Note.findByIdAndDelete(request.params.id)
    response.status(204).end()
//  } catch (error) {
//    next(error)
//  }

})

notesRouter.put('/:id', async (request, response) => {
  const { content, important } = request.body
/*
  Note
    .findByIdAndUpdate(
      request.params.id, 
      { content, important }, 
      { new: true, runValidators: true, context: 'query' }
    )
    .then(updatedNote => {
      console.log('Updated note:', updatedNote)
      return response.json(updatedNote)
    })
    .catch(error => next(error))
*/

//  try {
    const updatedNote = await Note.findByIdAndUpdate(
      request.params.id, 
      { content, important }, 
      { new: true, runValidators: true, context: 'query' }
    )
    response.json(updatedNote)
//  } catch (error) {
//    next(error)
//  }

})

module.exports = notesRouter
