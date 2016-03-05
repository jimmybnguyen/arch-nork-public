'use strict';

// requires the JSON world file with rooms and their details
// also allows program to read input from the user
var readline = require('readline');

var io = readline.createInterface({
  input: process.stdin,
  output: process.stdout 
});

 // Allows these functions to be used as a module
module.exports = {
    processAns: function(data) {
        return this.processAns(data);
    }, roomDetails: function() {
        return this.roomDetails();
    }/*, reset: function() {
        reset();
    }*/
};



class Game {
    constructor() {
        this.currentRoom = 0;
        this.inventory = [];
        this.world = require('../../common/world.json');
        this.lost = false;
        this.won = false;
    }

    // including its name, description, and attached rooms
    roomDetails() {
        console.log("player is in room: " + this.currentRoom);
        var details = this.world.rooms[this.currentRoom].id.toUpperCase() + '\n' + this.world.rooms[this.currentRoom].description + '\n\n';
        details += this.formatRooms(this.currentRoom);
        return details;
    }

    // prints out to the user the surrounding rooms
    // in a nice, formatted way
    formatRooms(roomIndex) {
        var room = this.world.rooms[roomIndex];
        var rooms = 'EXITS: \n'
        for(var exit in room.exits) {
            rooms += exit + "\n";
        }
        return rooms;
    }

    /////////////////////////////
    ////////// ROOMS ////////////
    /////////////////////////////

    // this function is called from go() when the player
    // enters a room. It updates the currentRoom, and 
    // displays its information to the user. If the player
    // entered the treasure room, it deems the game as won.
    // if the player enters the shack, it ends the game.
    enterRoom(roomName) {
        console.log("Player moved from " + this.world.rooms[this.currentRoom].id + " to " + roomName + '\n');
        // updates currentRoom
        this.currentRoom = this.roomIndex(roomName);
    
        if (this.world.rooms[this.currentRoom].status == "won") {
            // if they won the game
            this.won = true;
            return this.world.rooms[this.currentRoom].description + "\nCONGRATULATIONS! YOU'VE WON!\n";
        } else if (this.world.rooms[this.currentRoom].status == "lost") {
            // if they lost the game
            this.lost = true;
            return this.world.rooms[this.currentRoom].description + "\nYou have lost the game";
        }
        // print out the room's details
        return this.roomDetails();
    }

    // searches to see if you can use a particular item 
    // in that room, and returns that item's object
    // returns null if that item isn't there
    findUse(itemName) {
        var usableItems = this.world.rooms[this.currentRoom].uses;
        if(usableItems) {
            for (var i = 0; i < usableItems.length; i++) {
                if (usableItems[i].item == itemName) {
                    return usableItems[i];
                }
            }
        };
        return null;
    }

    // searches that room to see if there is that
    // particular item in the room, returns it if so
    // and returns null if nothing was found
    findItem(itemName) {
        var items = this.world.rooms[this.currentRoom].items;
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
    roomIndex(roomName) {
        for (var i = 0; i < this.world.rooms.length; i++) {
            if (this.world.rooms[i].id == roomName) {
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
    go (direction) {
        var response = '';
        
        var room = this.world.rooms[this.currentRoom];
        console.log("Going " + direction + " from " + room.id);
        // if there's anything after the command other than a space
        if(direction.split(' ')[1]) {
            direction = direction.split(' ')[1];
            // if the room has that direction
            if(room.exits[direction]) {
                response = "Entering " + room.exits[direction].id + '...\n';
                response += this.enterRoom(room.exits[direction].id);
            } else {
                response = null;
            }
        } else if(direction != '' && room.exits[direction]) {
            // if there's just a direction passed in, with no space in between because it 
            // didn't understand the direction
            response = "Entering " + room.exits[direction].id + '...';
            this.enterRoom(room.exits[direction].id);
        } else {
            // otherwise, there's a command but no context 
            response += "I'm sorry, where did you want to go";
        }
        return response;
    }

    // takes an item of the given name from the environment 
    // but only if that item is in that room
    // and adds it to the inventory
    take(itemName) {
        var response = '';
        // if that room has any items
        if(this.world.rooms[this.currentRoom].items) {
            // and the current room has that item
        
            if (this.findItem(itemName)) {
                // pushes that item name to the inventory
                this.inventory.push(itemName);
                response += itemName.toUpperCase() + " added to Inventory.\n";
                var index = this.world.rooms[this.currentRoom].items.indexOf(itemName);
                if (index > -1) {
                    this.world.rooms[this.currentRoom].items.splice(index, 1);
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
    use(itemName) {
        var response = ''; 
        var activeItem;
        // check your inventory for that item
        this.inventory.forEach(function(item){
            if(item.toLowerCase() == itemName) {
                activeItem = item;
            }
        });
        // if you have it in your inventory
        if(activeItem) {
            // if you can use any item in that room
            if(this.world.rooms[this.currentRoom].uses && this.world.rooms[this.currentRoom].uses.length > 0) {
                // and if you can use it in that room
                // (extended for speed in the case
                //  that you'd have to search every item in the room, for rooms
                //  with more items)
                var itemObject = this.findUse(activeItem);
                // if the room had the object
                if(itemObject) {
                    // if the item has an effect
                    if (itemObject.effect) {
                        // only remove from the inventory
                        // if the item can be consumed
                        if (itemObject.effect.consumed) {              
                            // remove from your inventory
                            var index = this.inventory.indexOf(itemName);
                            if (index > -1) {
                                this.inventory.splice(index, 1);
                            }
                        }  
                        response = itemObject.description + '\n';
                            
                        // update the current room to where the item
                        response += this.enterRoom(itemObject.effect.goto);
                        // output the item's effect 
                    } else {
                        response = "That object doesn't do anything";
                    }
                } else {
                    response = "You can't use that here";
                }
            } else {
                // the dreaded response!!
                response = "You can't use any item here";
            }
        } else {
            response = 'You do not have "' + itemName + '"';
        };
        return response;
    }

    // shows the user's inventory as long as how the item
    // can be used. Also prints that they have nothing in
    // their inventory if it is empty.
    showInventory() {
        var response = "";
        if (this.inventory.length > 0) {
            response = "INVENTORY\n";
            for(var i = 0; i < this.inventory.length; i++) {
                // if the item in the inventory hasn't been used
                response += this.inventory[i].toUpperCase();
                response += '\n';
            }     
        } else {
            response = "You have nothing in your inventory.";
        }
        return response;
    }

    /////////////////////////////
    /////// COMMUNICATION ///////
    /////////////////////////////

    // processes the answer given to the input for
    // command terms, and sends them to the correct 
    // respective functions.Also allows the user to quit the game
    // if they've typed in more than 3 incorrect commands
    processAns(answer) {
        var response = '';
        
        if (answer) {
            answer = answer.toLowerCase();  
            // if the command contains a GO
            if(answer.search("go") >= 0) {
                // passes the string after GO
                response = this.go(answer.split("go")[1]);
            } else if(answer.search("take") >= 0) {
                // passes the string after take
                response = this.take(answer.split("take ")[1]);
            } else if(answer.search("use") >= 0) {
                response = this.use(answer.split("use ")[1]);
            } else if(answer.search("inventory") >= 0) {
                response = this.showInventory();
            } else {
                response = null;
            } 
        } else {
            response = undefined;
        }
        return response;
    }
}

module.exports.won = this.won;// prints the room details of the current room
module.exports.lost = this.lost;
module.exports.Game = Game;