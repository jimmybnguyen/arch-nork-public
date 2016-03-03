'use strict';

// requires the JSON world file with rooms and their details
// also allows program to read input from the user
var world = require('../../common/world.json');
var readline = require('readline');
var server = require('./server/server.js');

var io = readline.createInterface({
  input: process.stdin,
  output: process.stdout 
});

// Allows these functions to be used as a module
module.exports = {
  askQuestion: function () {
    askQuestion();
  },
  roomDetails: function () {
    roomDetails();
  }
};

/////////////////////////////
//////// TO BE IMPLEMENTED //
/////////////////////////////


/////////////////////////////
//////// VARIABLES //////////
/////////////////////////////

var currentRoom = 0;
var attempts = 0;
var inventory = [];
var won = false;

/////////////////////////////
////////// ROOMS ////////////
/////////////////////////////

// this function is called from go() when the player
// enters a room. It updates the currentRoom, and 
// displays its information to the user. If the player
// entered the treasure room, it deems the game as won.
// if the player enters the shack, it ends the game.
var enterRoom = function(roomName) {
    console.log("Player moved from " + world.rooms[currentRoom].id + " to " + roomName);
    // updates currentRoom
    currentRoom = roomIndex(roomName);
    // print out the room's details
    roomDetails();
    if(won) {
        // do shit
    }
    /////////////////////////////////////////////////
    // come back here
}

// searches a room for a particular item 
// and returns that item's object
// returns null if that item isn't there
var searchRoom = function(itemName) {
    world.rooms[currentRoom].uses.forEach(function(roomItem) {
        if (roomItem.item == itemName) {
            return this.itemName;
        } 
    });
    return null;
}

// returns the index number of a room given its name
// if there is no such room, it returns -1
var roomIndex = function(roomName) {
    for (var i = 0; i < world.rooms.length; i++) {
        if (world.rooms[i].id == roomName) {
            return i;
        }
    }
    return -1;
}

// prints out to the user the surrounding rooms
// in a nice, formatted way
var formatRooms = function(roomIndex) {
    var room = world.rooms[roomIndex];
    console.log('ROOMS:');
    for(var exit in room.exits) {
        console.log(exit + ': ' + room.exits[exit].id);
    }
}

///////////////////////////////////////////////
////////////// CODE GOOD UP TILL HERE /////////
///////////////////////////////////////////////

// prints the room details of the current room
// including its name, description, and attached rooms
var roomDetails = function() {
    console.log(world.rooms[currentRoom].id.toUpperCase() + '\n \n');
    formatRooms(currentRoom);
}

/////////////////////////////
///////// COMMANDS //////////
/////////////////////////////

// Accepts the rest of the command the user typed as a parameter
// and uses it to decide when to enter a room
var go = function(direction) {
    var room = world.rooms[currentRoom];
    // if there's anything after the command other than a space
    if(direction.split(' ')[1]) {
        direction = direction.split(' ')[1];
        // if the room has that direction
        if(room.exits[direction]) {
            console.log("Entering " + room.exits[direction].name + '...');
            enterRoom(room.exits[direction].name);
        } else {
            console.log("Sorry, that's not a valid direction.\n");
        }
    } else if(direction != '' && room.exits[direction]) {
        // if there's just a direction passed in, with no space in between because it 
        // didn't understand the direction
        console.log("Entering " + room.exits[direction].name + '...');
        enterRoom(room.exits[direction].name);
    } else {
        // otherwise, there's a command but no context 
        io.question("I'm sorry, where did you want to go? (Just the direction) ",
            go);
    }
   
}

// TEST THIS
//////////////////////////////////
// takes an item of the given name from the environment 
// but only if that item is in that room
// and adds it to the inventory
var take = function(itemName) {
    // if that room has any items
    if(world.rooms[currentRoom].items) {
        // and the current room has that item
        var activeItem = world.rooms[currentRoom].items[itemName];
        if (activeItem) {
            // pushes that item name to the inventory
            inventory.push(activeItem);
            console.log(activeItem.name + " added to Inventory.\n")
            var index = world.rooms.indexOf(activeItem);
            if (index > -1) {
                world.rooms.items.splice(index, 1);
            }
        } else {
            console.log("That item is not in this room!\n");
        }
    } else {
        console.log("There are no items in this room to take.\n");
    }
}

// uses the item that the user typed in
// as long as the item is in the inventory
// If it's a key, it has to be in the right room
// to be unlocked.
// If it's the treasure, it has to progress the game
// Item affects are gathered from object details
var use = function(itemName) {
    var activeItem;
    // check your inventory for that item
    inventory.forEach(function(item){
        if(item.name.toLowerCase() == itemName) {
            activeItem = item;
        }
    });
    // if you have it in your inventory
    if(activeItem) {
        // if you can use any item in that room
        if(currentRoom.uses.length > 0) {
            // and if you can use it in that room
            // (extended for speed in the case
            //  that you'd have to search every item in the room, for rooms
            //  with more items)
            var itemObject = searchRoom(activeItem);
            // if the room had the object
            if(itemObject) {
                // if the item has an effect
                if (itemObject.effect) {
                    // only do the action if the item hasn't been used
                    if (!itemObject.effect.consumed) {
                        // update the current room to where the item
                        // leads the user
                        if (itemObject.effect.goto == "won") {
///////////////////////////////////////////
                            // WON()
                        } else {
                            currentRoom = roomIndex(itemObject.effect.goto);
                            roomDetails();
                        }
                    }  
                } else {
                    server.client.write("That object doesn't do anything");
                }
            } else {
                server.client.write("You can't use that here");
            }
        } else {
            // the dreaded response!!
            server.client.write("You can't use any item here");
        }
        console.log(activeItem.used + "\n");
    } else {
        console.log('You do not have "' + itemName + '"');
    };
}

// shows the user's inventory as long as how the item
// can be used. Also prints that they have nothing in
// their inventory if it is empty.
var showInventory = function() {
    if (inventory.length > 0) {
        console.log("INVENTORY\n");
        for(var i = 0; i < inventory.length; i++) {
            console.log(inventory[i].name + '\n');
        }     
    } else {
        console.log("You have nothing in your inventory.");
    }
    
}

///////////////////////////////////////////////
////////////// CODE GOOD UP TILL HERE /////////
///////////////////////////////////////////////
// world.rooms[currentRoom].description + '\n')

/////////////////////////////
/////// COMMUNICATION ///////
/////////////////////////////

// asks the question
var askQuestion = function() {
    io.question("What next?" + '\n', processAns);
}

// processes the answer given to the input for
// command terms, and sends them to the correct 
// respective functions.Also allows the user to quit the game
// if they've typed in more than 3 incorrect commands
var processAns = function(answer) {
    if (answer) {
        answer = answer.toLowerCase();  
        // if the command contains a GO
        if(answer.search("go") >= 0) {
            // passes the string after GO
            go(answer.split("go")[1]);
        } else if(answer.search("take") >= 0) {
            // passes the string after take
            take(answer.split("take ")[1]);
        } else if(answer.search("use") >= 0) {
            use(answer.split("use ")[1]);
        } else if(answer.search("inventory") >= 0) {
            showInventory();
        } else {
            attempts++;
            if (attempts > 2) {
                io.question("Would you like to quit? (YES) ", function(answer) {
                    if (answer.toLowerCase() === "yes") {
                        io.close();
                        io.input.destroy();
                    } else {
                        io.question(questions[currentQuestion], processAns);
                    }
                });
            } 
            io.question("I'm sorry, what was that? ", processAns);
        } 
    } else {
        console.log("Sorry, I didn't catch that!");
    }
    // if you've already won the game, change the question to allow the player more time
    if (won) {
        io.question(questions[currentQuestion + 1] + '\n', processAns);
    } else if (currentRoom != 1) {
        askQuestion();
    }
}