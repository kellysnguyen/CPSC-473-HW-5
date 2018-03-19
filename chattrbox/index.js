var http = require("http");
var fs = require("fs");
var extract = require("./extract");
var mime = require("mime");
var wss = require("./websockets-server");

var handleError = function(err, res) {
  res.writeHead(404);
  fs.readFile("app/error.html", function(err, data) {
    if (err) {
      console.log("error with error message");
      return;
    } else {
      res.end(data);
    }
  });
};

var server = http.createServer(function(req, res) {
  console.log("Responding to a requrest.");

  var filePath = extract(req.url);
  fs.readFile(filePath, function(err, data) {
    if (err) {
      handleError(err, res);
      return;
    } else {
      var mimetype = mime.getType(filePath);
      res.setHeader("Content-Type", mimetype);
      res.end(data);
    }
  });
});
server.listen(3000);