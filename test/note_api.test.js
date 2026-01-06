const assert = require('node:assert')
const { describe, test, after, beforeEach } = require('node:test')
const Note = require('../src/models/note')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../src/app')
const helper = require('./test_helper')

const api = supertest(app)

describe('Notes API tests', async () => {
  beforeEach(
    async () => {
      await Note.deleteMany({})
      await Note.insertMany(helper.initialNotes)
/*       
      let noteObject = new Note(helper.initialNotes[0])
      await noteObject.save()
      
      noteObject = new Note(helper.initialNotes[1])
      await noteObject.save()
*/
/* Working version: All promises in parallel
      const noteObjects = helper.initialNotes.map(note => new Note(note))
      const promiseArray = noteObjects.map(note => note.save())
      await Promise.all(promiseArray)
*/
/* Working version: All promises in sequence
      for (let note of helper.initialNotes) {
        let noteObject = new Note(note)
        await noteObject.save()
      }
*/
  /* Not working: async functions are in for each but not at beforeEach level
      helper.initialNotes.forEach(async note => {
        let noteObject = new Note(note)
        await noteObject.save()
        console.log('Saved note:', noteObject)
      })
      console.log('BeforeEach complete')
    }
  */
    }
  )

  describe('when there is initially some notes saved', () => {
    test('notes are returned as json', async () => {
      await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('there are two notes', async () => {
      const notesAtEnd = await helper.notesInDb()
  
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
    })
    
    test('the first note is about HTTP methods', async () => {
      const notesAtEnd = await helper.notesInDb()
      const contents = notesAtEnd.map(e => e.content)
      assert(contents.includes('HTML is easy'))
    })
  
  })

  describe('viewing a specific note', () => {
    test('a specific note can be viewed', async () => {
      const notesAtStart = await helper.notesInDb()
  
      const noteToView = notesAtStart[0]
  
      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
  
      assert.deepStrictEqual(resultNote.body, noteToView)
    })
    
    test('succeeds with a valid id', async () => {
      const notesAtStart = await helper.notesInDb()
  
      const noteToView = notesAtStart[0]
  
      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
  
      const processedNoteToView = JSON.parse(JSON.stringify(noteToView))
  
      assert.deepStrictEqual(resultNote.body, processedNoteToView)
    })
  
    test('fails with status code 404 if note does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()
  
      await api
        .get(`/api/notes/${validNonexistingId}`)
        .expect(404)
    })
  
    test('fails with status code 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'
  
      await api
        .get(`/api/notes/${invalidId}`)
        .expect(400)
    })
  })

  describe('addition of a new note', () => {
    test('a valid note can be added ', async () => {
      const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
      }
  
      await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const notesAtEnd = await helper.notesInDb()
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)
      
      const contents = notesAtEnd.map(n => n.content)
      assert(contents.includes('async/await simplifies making async calls'))
    })
  
    test('note without content is not added', async () => {
      const newNote = {
        important: true
      }
    
      await api
        .post('/api/notes')
        .send(newNote)
        .expect(400)
    
      const notesAtEnd = await helper.notesInDb()
    
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
    })

  })

  describe('deletion of a note', () => {
    test('a note can be deleted', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToDelete = notesAtStart[0]
  
      await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)
    
      const notesAtEnd = await helper.notesInDb()
   
      const contents = notesAtEnd.map(r => r.content)
      assert(!contents.includes(noteToDelete.content))
    
      assert.strictEqual(notesAtEnd.length, notesAtStart.length - 1)
    })
  
  })

  after(async () => {
    await mongoose.connection.close()
  })
})

console.log('END Note API tests')