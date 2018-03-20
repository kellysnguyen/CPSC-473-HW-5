/* eslint-env node*/

var WebSocket = require("ws");
var WebSocketServer = WebSocket.Server;
var port = 3001;
var ws = new WebSocketServer({
  port: port
});

//Messages array holds all messages in conversation
var messages = [];
//Message[0] will always hold conversation topic
messages[0] = "*** Topic is 'Topic 1'";
console.log("websockets server started");

ws.on("connection", function(socket) {
  console.log("client connection established");
  //Send entire contents of messages array to new client
  //Messages[0] holds the topic of the conversation
  messages.forEach(function(msg) {
    socket.send(msg);
  });

  socket.on("message", function(data) {
    var substring = "/topic ";
    //Look for substring in position 0
    if (data.indexOf(substring) == 0) {
      data = data.replace("/topic ", "");
      data = "*** Topic is '" + data + "'";
      //Log new topic in the server
      console.log(data);
      //Always keep topic in position messages[0]
      messages[0] = data;
      //Notify all clients of the new topic
      ws.clients.forEach(function(clientSocket) {
        clientSocket.send(data);
      });
    } else {
      //Regular message, log to server
      console.log("message received: " + data);
      //Add new message to array
      messages.push(data);
      //Send the message to each client
      ws.clients.forEach(function(clientSocket) {
        clientSocket.send(data);
      });
    }
  });
});
