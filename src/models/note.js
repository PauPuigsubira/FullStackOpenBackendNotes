const mongoose = require('mongoose')
//const config = require('../utils/config');
//const { info, error: infoError } = require('../utils/logger');

//mongoose.set('strictQuery', false)

/* const url = config.MONGODB_URI
info('connecting to', url)

mongoose
  .connect(url)
  .then(
    info('connected to MongoDB')
  )
  .catch(error => {
    infoError('error connecting to MongoDB:', error.message)
  }) */

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minlength: 5,
    required: true,
  },
  important: { type: Boolean },
  user: {    
    type: mongoose.Schema.Types.ObjectId,    
    ref: 'User',
    required: true
  }
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    if (returnedObject._id) returnedObject.id = returnedObject._id.toString()
    if (returnedObject.user && returnedObject.user._id) returnedObject.user = returnedObject.user._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const ObjectId = require('mongoose').Types.ObjectId; 

module.exports = mongoose.model('Note', noteSchema)
module.exports.ObjectId = ObjectId;