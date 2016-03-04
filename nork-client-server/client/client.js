'use strict';

var net = require('net');
var readline = require('readline');

let io = readline.createInterface({
    input: process.stdin,
    output: process.stdout 
});

var HOST = '127.0.0.1'; //localhost
var PORT = 8000;
//connect to the server

//make the client
var client = new net.Socket();

client.on('data', function(data) { //when we get data
    console.log("Client got data\n" + data);
    io.question(data + "", function(response) {
      client.write(response); 
    }); //output it  */
});

client.on('close', function() { //when connection closed
   console.log('Connection closed');
});

client.connect(PORT, HOST, function() {
   console.log('Connected to: ' + HOST + ':' + PORT);
});

