require('dotenv').config()
//const http = require('http')
const express = require("express");
const cors = require("cors");
const requestLogger = require("./middlewares/requestLogger");
const Note = require("./models/note");

// console.log('argumentos',process.argv);

// const password = process.argv[2]
// const url =
//   `mongodb+srv://fullstackopen:${password}@fullstackopennotes.cirdsfw.mongodb.net/noteApp?appName=fullstackopenNotes`
  
// const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// })

// noteSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString()
//     delete returnedObject._id
//     delete returnedObject.__v
//   }
// })

// const Note = mongoose.model('Note', noteSchema)

// const connection = (query) => {
//   mongoose.set('strictQuery',false)
//   mongoose.connect(url)

//   console.log(query)
//   query()
// }

let notes = [];
/*
let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];
*/
//Create a Web Server
const app = express(); 
//Treat request as JSON
app.use(express.json());
//Allow use of static html from dist folder
app.use(express.static("dist"));

app.use(requestLogger);

app.use(cors());

/*
const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(notes))
})
*/
const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

//Set Server End Points
/*
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});
*/
app.get("/api/notes", (request, response) => {
  console.log('GET Notes',request.path)
  // const findNotes = () => {
    Note
      .find({})
      .then(result => {
        console.log(result)
        response.json(result)
        //Note.connection.close()
      })
      .catch(err => response.status(400).json('Error: ' + err));
  
  // }
  // connection(findNotes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  
  Note
    .find({id_: id})
    .then(result => {
      console.log('with id', id, result)
      if (result.length > 0) {
        response.json(result)
      } else {
        response.status(404).end(`Note with id ${id} not found`);
      }
    })
    .catch(err => response.status(400).json('Error: ' + err));

});

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  };
  console.log(note);

  notes = notes.concat(note);

  response.json(note);
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port ${PORT} ${Date().toString()}`);
//create a server object:
/*
app.use("/api/v1/quiz", (req, res) => {
  const topic = req.query.topic;
  const num = req.query.num;
  console.log(topic, num);
  if (topic === "android") {
    res.json({
      status: "success",
      questions: androidData.slice(0, num)
    });
  } else {
    res.status(423);
    res.json({
      status: "error",
      errorMsg: "only android quiz supported for now"
    });
  }
});

app.use("/api", math);
app.listen(8080, () => {
  console.log("listening on 8080...");
}); //the server object listens on port 8080
*/