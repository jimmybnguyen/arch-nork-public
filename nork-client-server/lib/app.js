'use strict';

// requires the JSON world file with rooms and their details
// also allows program to read input from the user
var world = require('../../common/world.json');
var readline = require('readline');

var io = readline.createInterface({
  input: process.stdin,
  output: process.stdout 
});

// Allows these functions to be used as a module
module.exports = {
  processAns: function(data) {
    return processAns(data);
  }, roomDetails: function() {
      return roomDetails();
  }
};
exports.won = won;

/////////////////////////////
//////// VARIABLES //////////
/////////////////////////////

var currentRoom = 0;
var inventory = [];
var won = false;// prints the room details of the current room
var output = '';
// including its name, description, and attached rooms
function roomDetails() {
    console.log("player is in room: " + currentRoom);
    var details = world.rooms[currentRoom].id.toUpperCase() + '\n' + world.rooms[currentRoom].description + '\n';
    details += formatRooms(currentRoom) + '';
    return details;
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


'use strict';

// also allows program to read input from the user
var readline = require('readline');

var io = readline.createInterface({
  input: process.stdin,
  output: process.stdout 
});


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
    if (world.rooms["won"]) {
        won == true;
    }
    // print out the room's details
    return roomDetails();
}

// searches to see if you can use a particular item 
// in that room, and returns that item's object
// returns null if that item isn't there
var findUse = function(itemName) {
    var usableItems = world.rooms[currentRoom].uses;
    if(usableItems) {
        usableItems.forEach(function(roomItem) {
            if (roomItem.item == itemName) {
                return this.itemName;
            } 
        })
    };
    return null;
}

// searches that room to see if there is that
// particular item in the room, returns it if so
// and returns null if nothing was found
var findItem = function(itemName) {
    var items = world.rooms[currentRoom].items;
    if(items) {
        for (var i = 0; i < items.length; i++) {
            if (items[i] == itemName) {
                return itemName;
            }
        }
    };
    return false;
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


/////////////////////////////
///////// COMMANDS //////////
/////////////////////////////

// Accepts the rest of the command the user typed as a parameter
// and uses it to decide when to enter a room
var go = function(direction) {
    var response;
    
    var room = world.rooms[currentRoom];
    console.log("Going " + direction + " from " + room.id);
    // if there's anything after the command other than a space
    if(direction.split(' ')[1]) {
        direction = direction.split(' ')[1];
        // if the room has that direction
        if(room.exits[direction]) {
            response += "Entering " + room.exits[direction].id + '...';
            response += enterRoom(room.exits[direction].id);
        } else {
            response = null;
        }
    } else if(direction != '' && room.exits[direction]) {
        // if there's just a direction passed in, with no space in between because it 
        // didn't understand the direction
        response += "Entering " + room.exits[direction].id + '...';
        enterRoom(room.exits[direction].id);
    } else {
        // otherwise, there's a command but no context 
        io.question("I'm sorry, where did you want to go? (Just the direction) ",
            go);
    }
    return response;
}

// TEST THIS
//////////////////////////////////
// takes an item of the given name from the environment 
// but only if that item is in that room
// and adds it to the inventory
var take = function(itemName) {
    var response;
    // if that room has any items
    if(world.rooms[currentRoom].items) {
        // and the current room has that item
       
        if (findItem(itemName)) {
            // pushes that item name to the inventory
            inventory.push(itemName);
            response += itemName.toUpperCase() + " added to Inventory.\n";
            var index = world.rooms[currentRoom].items.indexOf(itemName);
            if (index > -1) {
                world.rooms[currentRoom].items.splice(index, 1);
            }
        } else {
            response += "That item is not in this room!\n";
        }
    } else {
        response += "There are no items in this room to take.\n";
    }
    return response;
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
        if(world.rooms[currentRoom].uses.length > 0) {
            // and if you can use it in that room
            // (extended for speed in the case
            //  that you'd have to search every item in the room, for rooms
            //  with more items)
            var itemObject = findUse(activeItem);
            // if the room had the object
            if(itemObject) {
                // if the item has an effect
                if (itemObject.effect) {
                    // only do the action if the item hasn't been used
                    if (!itemObject.effect.consumed) {
                        // update the current room to where the item
                        // leads the user
                        /*
                        if (itemObject.effect.goto == "won") {
///////////////////////////////////////////
                            // WON()
                        } else {*/
                            currentRoom = roomIndex(itemObject.effect.goto);
                            roomDetails(currentRoom);
                        //}
                    }  
                } else {
                    write("That object doesn't do anything");
                }
            } else {
                write("You can't use that here");
            }
        } else {
            // the dreaded response!!
            write("You can't use any item here");
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
    var response;
    if (inventory.length > 0) {
        response = "INVENTORY\n";
        for(var i = 0; i < inventory.length; i++) {
            response += inventory[i].name + '\n';
        }     
    } else {
        response += "You have nothing in your inventory.";
    }
    return response;
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
    var response;
    
    if (answer) {
        answer = answer.toLowerCase();  
        // if the command contains a GO
        if(answer.search("go") >= 0) {
            // passes the string after GO
            response = go(answer.split("go")[1]);
        } else if(answer.search("take") >= 0) {
            // passes the string after take
            response = take(answer.split("take ")[1]);
        } else if(answer.search("use") >= 0) {
            response = use(answer.split("use ")[1]);
        } else if(answer.search("inventory") >= 0) {
            response = showInventory();
        } else {
            response = null;
        } 
    } else {
        response = undefined;
    }
    
    /*
    // if you've already won the game, change the question to allow the player more time
    if (won) {
        io.question(world.rooms[currentRoom].description + '\n', processAns);
    } else if (currentRoom != 1) {
        askQuestion();
    } */
    return response;
}