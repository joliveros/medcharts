var port = 4000;
var express = require("express"),
argv = require('yargs').argv,
app = express();
port = argv.port || port;
app.get("/", function (req, res) {
  res.send("<!DOCTYPE html>" +
  "<html>" +
    "<head>" +
      "<title>medcharts</title>" +
    "</head>" +
    "<body>" +
      "<div id='app'></div>" +
      "<script type='text/javascript' src='/static/bundle.js'></script>" +
    "</body>" +
  "</html>")
})

app.get("/static/bundle.js", function (req, res) {
  res.sendFile("example/dist/bundle.js", {root: __dirname})
})

app.listen(port)
