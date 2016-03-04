'use strict';

var world = require('../../common/world');
//var readLine = require('readline');
var net = require('net');
var server = net.createServer();
var app = require('../lib/app.js');
var currentRoom = 0;

/////////////////////////////
////// EXECUTING CODE ///////
/////////////////////////////

module.exports = {
  roomDetails: function () {
    roomDetails();
  }, formatRooms: function() {
    formatRooms()
  }
};
exports.currentRoom = currentRoom;

server.on('connection', function(socket) {
   //send a message to the socket
    socket.write("Welcome to NORK!. \nYour commands are GO, TAKE, USE, and INVENTORY. You can exit the game at any time by typing EXIT. \n");
    socket.write(roomDetails(currentRoom));
    
    
    socket.on('data', function(data) {
        data = data.toString().replace('\n', '').toLowerCase();
        socket.write("received data: " + data);
        var response = app.processAns(data, currentRoom);
        // writes new output b
        if (!response) {
            if (response === undefined) {
                socket.write("I didn't get any input");
            } else {
                socket.write("I'm sorry, I didn't understand that command.");
            }
            socket.write(roomDetails(currentRoom));
        } else {
            socket.write(response);
        }
        
        if (app.won) {
            socket.write("CONGRATULATIONS, YOU'VE WON!");
            socket.end();
        };
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


// prints the room details of the current room
// including its name, description, and attached rooms
function roomDetails(currentRoom) {
    console.log("player is in room: " + currentRoom);
    var details = world.rooms[currentRoom].id.toUpperCase() + '\n \n';
    details += formatRooms(currentRoom) + '';
    return details + '\n';
}

// prints out to the user the surrounding rooms
// in a nice, formatted way
var formatRooms = function(roomIndex) {
    var room = world.rooms[roomIndex];
    var rooms = 'ROOMS: \n'
    for(var exit in room.exits) {
        rooms += exit + ': ' + room.exits[exit].id + "\n";
    }
    return rooms;
}
