'use strict';

var net = require('net');
var readline = require('readline');
var host = require('../../common/host.js');

let io = readline.createInterface({
    input: process.stdin,
    output: process.stdout 
});

//make the client
var client = new net.Socket();

client.on('data', function(data) { //when we get data
    if (data.toString().includes('lost') || data.toString().includes('WON') ) {
        console.log(data + "");
        client.end();
    } else {
        io.question(data + "\nWhat would you like to do? ", function(response) {
            client.write(response); 
        }); //output it 
    }
    
});

client.on('close', function() { //when connection closed
   console.log('Connection closed');
   client.end();
});

client.connect(host.PORT, host.HOST, function() {
   console.log('Connected to: ' + host.HOST + ':' + host.PORT);
});

