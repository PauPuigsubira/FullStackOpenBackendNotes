// IMPORTANT: Make sure to import `instrument.js` at the top of your file.
require('./instrument');
// All other imports below
require('express-async-errors');
const mongoose = require("mongoose");
const config = require("./utils/config");
const { info, error: infoError } = require("./utils/logger");

const express = require("express");
const cors = require("cors");
const requestLogger = require("./utils/middlewares/requestLogger");
const errorHandler = require('./utils/middlewares/errorHandler');
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
const Sentry = require("@sentry/node");

mongoose.set('strictQuery', false)

const url = config.MONGODB_URI
info('connecting to', url)

mongoose
  .connect(url)
  .then(
    info('connected to MongoDB')
  )
  .catch(error => {
    infoError('error connecting to MongoDB:', error.message)
  })

//Create a Web Server
const app = express(); 
//Allow use of static html from dist folder
app.use(express.static("dist"));
app.use('/images',express.static('public/assets/images'));
//Treat request as JSON
app.use(express.json());
//Handle request logging
app.use(requestLogger);

app.use(cors());

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

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
// This snippet contains an intentional error and can be used as a test to make sure that everything's working as expected.
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);
// este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
app.use(errorHandler);

module.exports = app;