'use strict';

var world = require('../common/world');
var stream = require('stream');
var readLine = require('readline');

var currentRoom = 0; //index of the current room in the world
var inventory = [];
var gameOver = false;

/**
* Displays the starting information for the game
*/
function start() {
    process.stdout.write(help() + '\n' + world.rooms[currentRoom].description + 
                         '\n\n' + "What would you like to do?" + '\n> ');
}

/**
* Processes the user's input 
*/
var inputFilter = new stream.Transform({
  transform (chunk, encoding, done) { 
      var answer = chunk.toString().toUpperCase().trim();
      this.push(answer); //pipe out data
      done(); //callback for when finished
  },

  flush(done) { 
    //any final processing occurs here
    done();
  }
    
});

/**
* Transform the user's input into world state changes 
*/
var gameFilter = new stream.Transform({
    transform (chunk, encoding, done) {
        var answer = chunk.toString();
        var output; //representation of the world state changes
        if (answer.substring(0,2).toUpperCase() == 'GO') {
            var direction = answer.substring(3).toLowerCase();
            output = move(direction);
        } else if (answer.toUpperCase() == 'INVENTORY') {
           output = printInventory(inventory);
        } else if (answer.substring(0,4).toUpperCase() == 'TAKE') {
            var item = answer.substring(5).toLowerCase();
            output = take(item);
        } else if (answer.substring(0,3).toUpperCase() == 'USE') {
            var item = answer.substring(4).toLowerCase();
            output = use(item);
            if (world.rooms[currentRoom].id == "won") { // the player won the game
                gameOver = true;   
            }
            
        } else if (answer.toUpperCase() == 'HELP') {
                 output = help();
        } else {  
            output = "INVALID COMMAND";
        }
        this.push(output); 
        done(); 
      },

      flush(done) { 
        done();
      }
    
});

/**
* Transforms the world state changes into output 
*/
var outputFilter = new stream.Transform({
    transform (chunk, encoding, done) {
        var output = chunk.toString();
        if (!gameOver) {
            this.push(output + "\n" + "What would you like to do?" + "\n> "); 
        } else {
            this.push(output);
        }
        done();
        if (gameOver) { //the player lost or won the game
            process.exit();
        }   
      },
    
      flush(done) { 
        done();
      }
    

});

/**
* Returns the current state of the inventory 
* @param {object} inventory the player's inventory
* @returns {string} a representation of the current inventory
*/
function printInventory(inventory) {
    return '\n' + '**********INVENTORY********** \n' + 
        inventory.toString() + '\n' + '*****************************' + '\n';
}

/**
* Adds an item in the room to the player's inventory
* @param {string} itemName the name of the item to be taken
* @returns {string} the result of taking an item 
*/
var take = function(itemName) {
    var result; //the output to the user
    if(world.rooms[currentRoom].items) {
        var activeItem; //the item in the room
        for (var i = 0; i < world.rooms[currentRoom].items.length; i++) {
            if (world.rooms[currentRoom].items[i] == itemName) { 
                activeItem = itemName;
                inventory.push(activeItem);
                result = activeItem + " added to inventory" + '\n';
                if (i > -1) {
                    world.rooms[currentRoom].items.splice(i, 1);
                }
            }
        }
        if (activeItem == null) {
            result = ("That item is not in this room!" + '\n');
        }
    } else {
        result = ("There are no items in this room to take" + '\n');
    }
    return result;
}

/**
* Changes the current room in the game
* @param {string} direction where the player wants to move
* @returns {string} the result of moving in a direction
*/
var move = function(direction) {
    var currentExits = world.rooms[currentRoom].exits;
    if (currentExits[direction] != null) {
        var index = roomIndex(currentExits[direction].id);
        currentRoom = index;
        if (world.rooms[currentRoom].status == "lost") { //the player lost the game
            gameOver = true;
        }
        return (world.rooms[currentRoom].description + '\n'); 
    } else {
        return ("There is nothing " + direction + " from here" + '\n');   
    }
}
    
/**
* Searches for a room in the world
* @param {string} roomName name of the room
* @returns {number} the index of the room in the world 
*/
var roomIndex = function(roomName) {
    for (var i = 0; i < world.rooms.length; i++) {
        if (world.rooms[i].id == roomName) {
            return i;
        }
    }
    return -1;
}

/**
* Uses an item from the player's inventory
* @param {string} itemName the name of the item to be used 
* @returns {string} the result of using the item
*/
var use = function(itemName) {
    var activeItem;
    for (var itemIndex in inventory) {
        var item = inventory[itemIndex];
        if (item.toLowerCase() == itemName) {
            activeItem = item;
        }
    }
    var roomUses = world.rooms[currentRoom].uses;
    if (activeItem) { //the item was found in the inventory
        if (roomUses != null) {
                var itemObject = searchRoom(activeItem);
                if (itemObject != null) { //the item can be used in the current room
                    if (roomUses[itemObject].effect) { // the object does something
                        if (!roomUses[itemObject].effect.consumed) { //the item has not been used yet
                            roomUses[itemObject].effect.consumed = true; //item cannot be used here anymore
                            currentRoom = roomIndex(roomUses[itemObject].effect.goto); //changes room due to using item
                            return (world.rooms[currentRoom].description + '\n');
                        } else {
                            return ("You already used this item here" + '\n');   
                        }
                    } else {
                        return ("That object doesn't do anything!" + '\n');   
                    }
                } else {
                    return ("You can't use that here" + '\n');   
                }
        } else {
            return  ("No items can be used here"+ '\n');  
        }
    } else {
        return ('You do not have "' + itemName + '"' + '\n'); 
    }
}

/**
* Searches the current room for an item 
* @param {string} itemName the item to be found
* @returns {number} the location of the item in the room
*/
var searchRoom = function(itemName) {
    for (var i = 0; i < world.rooms[currentRoom].uses.length; i++) {
        if (world.rooms[currentRoom].uses[i].item == itemName) {
            return i;   
        }
    }
    return null;
}

/**
* Displays all of the commands to the player
* @returns {string} every command in the game
*/
function help() {
    return('\n' + 
     '**********COMMANDS**********' + '\n' + 
     'GO (north, south, east, west)' + '\n' +
     'TAKE (item)' + '\n' + 'USE (item)' + '\n' + 'INVENTORY' + 
     '\n' + 'Type HELP to see this again' + '\n' +
     '****************************' + '\n')
}

start();
process.stdin.pipe(inputFilter)
             .pipe(gameFilter)
             .pipe(outputFilter)
             .pipe(process.stdout);