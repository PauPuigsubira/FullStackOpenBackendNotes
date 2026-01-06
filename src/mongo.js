const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
/*
const url =
  `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority`
*/
/*
  const url =
  `mongodb+srv://fullstackopen:${password}@fullstackopennotes.cirdsfw.mongodb.net/noteApp?appName=fullstackopenNotes`
*/
  const url =
  `mongodb+srv://fullstackopen:${password}@fullstackopennotes.cirdsfw.mongodb.net/testNoteApp?appName=fullstackopenNotes`
mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const notes = [
  new Note({
    content: 'HTML is easy',
    important: true,
  }),
  new Note({
    content: 'Browser can execute only JavaScript',
    important: false,
  })
]

notes.forEach(note => {
  note
    .save()
    .then(result => {
        console.log('note saved!')

        console.log(result)
    })
})
mongoose.connection.close()

/*
Note.find({important: true}).then(result => {
  result.forEach(note => {
    console.log('is Important',note)
  })
  //mongoose.connection.close()
})

Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})
*/