var WebSocket = require('ws');
var express = require('express');
var http = require('http');

// var sqlite = require('sqlite3');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server: server });

var PORT = process.env.PORT || 3000;


wss.on('connection', function connection(client) {
  client.isAlive = true;

  // to check user is connected or not with the server
  client.on('pong', () => {
    client.isAlive = true;
  });


  let msg = "Server: Welcome!";
  client.send(msg);
  client.on('message', function incoming(message) {
    msg = message;

    for (var cl of wss.clients) {

      // only information went to the Other clients 
      if (cl != client)
        cl.send(message);
    }
    console.log("Received the following message:\n" + message);
  });
});

setInterval(() => {
  wss.clients.forEach((client) => {

    if (!client.isAlive) return client.terminate();

    client.isAlive = false;
    client.ping(null, false, true);
  });
}, 10000);

//start the server
server.listen(PORT, () => {
  console.log('Server started on port ', server.address().port);
})