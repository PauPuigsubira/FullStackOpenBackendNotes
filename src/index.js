const http = require('http')
/*
const express = require("express");
const math = require("./math");
const app = express();
const androidData = require("./quizData");
*/
//Create a Web Server
const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' })
  response.end('<h1>Hello World!</h1>')
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT} ${Date().toString()}`)
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