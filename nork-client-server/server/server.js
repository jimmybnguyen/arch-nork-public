'use strict';

var world = require('../../common/world');
//var readLine = require('readline');
var net = require('net');
var server = net.createServer();
var app = require('../lib/app.js');


/////////////////////////////
////// SERVER CODE //////////
/////////////////////////////

server.on('connection', function(socket) {
   //send a message to the socket
    socket.write("Welcome to NORK! \nYour commands are GO, TAKE, USE, and INVENTORY. You can exit the game at any time by typing EXIT. \n \n");
    socket.write(app.roomDetails() + "");
    
    
    
    socket.on('data', function(data) {
        console.log(data + "");
        data = data.toString().replace('\n', '').toLowerCase();
        if (data + "" == 'exit') {
            socket.write("Connection closed");
            socket.end();
        } else {
            var response = app.processAns(data);
            // writes new output b
            if (!response) {
                if (response === undefined) {
                    socket.write("I didn't get any input");
                } else {
                    socket.write("I'm sorry, I didn't understand that command.");
                }
                //socket.write(roomDetails(currentRoom));
            } else {
                socket.write(response);
            }
            
            if (app.won || app.lost) {
                socket.end();
                //socket.destroy()
                app.reset();
            };
        }
    });
  
});

//when we start "listening" for connections
server.on('listening', function() {
   //get address info
   var addr = server.address();

   //print the info
   console.log('server listening on port %d', addr.port);
});

server.listen(8000); //listen on port 8000


