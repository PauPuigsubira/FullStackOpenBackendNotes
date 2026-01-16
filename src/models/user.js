const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {    
    type: String,
    minlength: 3,   
    required: true,    
    unique: true // esto asegura la unicidad de username  
  },
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    if (returnedObject._id) returnedObject.id = returnedObject._id.toString()

    //if (returnedObject.notes) returnedObject.notes = returnedObject.notes
    delete returnedObject._id
    delete returnedObject.__v
    // el passwordHash no debe mostrarse
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User