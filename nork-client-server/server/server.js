'use strict';

var world = require('../common/world');
//var readLine = require('readline');
var net = require('net');
var server = net.createServer();

var app = require('./lib/app.js');

/* practice code
server.listen({
  host: 'localhost',
  port: 80,
  exclusive: true
});

var socket = new net.Socket({
  fd: world.json,
  allowHalfOpen: false,
  readable: false,
  writable: false
});

var client = new net.Socket({
  fd: null,
  allowHalfOpen: false,
  readable: true,
  writable: false
});

client.connect({
    port: 80,
    host: 'localhost',
    family: 4,
    lookup: dns.lookup
}) {
    console.log("You made it, client! Let's get started...");
}

*/

/////////////////////////////
////// EXECUTING CODE ///////
/////////////////////////////

//notify (via observer!) when a a connection occurs
server.on('connection', function(socket) {
   //send a message to the socket
   socket.write('Hello you ' + socket + '! \n');
   
   /* when a socket is connected... */

    //notify on data received event
    socket.on('data', function(data) {

    //process data
    var echo = data.toString().replace('\n', '').toUpperCase();

    if(echo === 'EXIT') {
        socket.write("Goodbye!");
        socket.end();
    }
    else {
        socket.write("Did you say '"+echo+"'?");
    }
    });

   //close the connection
   //socket.end();

});

//when we start "listening" for connections
server.on('listening', function() {
   //get address info
   var addr = server.address();

   //print the info
   console.log('server listening on port %d', addr.port);
});

server.listen(8000); //listen on port 8000

//make the client
var client = new net.Socket();

client.on('data', function(data) { //when we get data
   console.log("Received: "+data); //output it
});

client.on('close', function() { //when connection closed
   console.log('Connection closed');
});


var HOST = '127.0.0.1'; //localhost
var PORT = 8000;
//connect to the server
client.connect(PORT, HOST, function() {
   console.log('Connected to: ' + HOST + ':' + PORT);
   app.roomDetails();
   app.askQuestion()
   //send message to server
   client.write("Hello server, I'm the client!");
});