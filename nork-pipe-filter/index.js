'use strict';

var world = require('../common/world');
var stream = require('stream');
var readLine = require('readline');
var util = require('util');

var currentRoom = 0;
var inventory = [];
var gameOver = false;

function start() {
    console.log(world.rooms[currentRoom].description);
    //getAnswer();
}

var inputFilter = new stream.Transform({
  transform (chunk, encoding, done) { // This is the _transform method
      var answer = chunk.toString().toUpperCase().trim();
      this.push(answer); //pipe out data
      done(); //callback for when finished
  },

  flush(done) { // This is the _flush method
    //any final processing occurs here
    done();
  }
    
});


var gameFilter = new stream.Transform({
    transform (chunk, encoding, done) {
        var answer = chunk.toString();
        var output;
        if (answer.substring(0,2).toUpperCase() == 'GO') {
            //stores the direction of movement
            var direction = answer.substring(3).toLowerCase();
            output = move(direction);
        } else if (answer.toUpperCase() == 'INVENTORY') {
           output = printInventory(inventory);
        } else if (answer.substring(0,4).toUpperCase() == 'TAKE') {
            var item = answer.substring(5).toLowerCase();
            output = take(item);
        } else if (answer.substring(0,3).toUpperCase() == 'USE') {
            //stores the item to be used 
            var item = answer.substring(4).toLowerCase();
            output = use(item);
        } else {  
            output = "INVALID COMMAND";
        }
        this.push(output); //pipe out data
        done(); //callback for when finished
      },

      flush(done) { // This is the _flush method
        //any final processing occurs here
        done();
      }
    
});

var outputFilter = new stream.Transform({
    transform (chunk, encoding, done) {
        var output = chunk.toString();
        //console.log(output);
        this.push(output + "\n"); //pipe out data
        done(); //callback for when finished
        if (gameOver) {
            process.exit();
        }   
      },
    
      flush(done) { // This is the _flush method
        //any final processing occurs here
        done();
      }
    

});

function printInventory(inventory) {
    return '\n' + '**********INVENTORY********** \n' + 
        inventory.toString() + '\n' + '*****************************';
}

var take = function(itemName) {
    // if that room has any items
    var result;
    if(world.rooms[currentRoom].items) {
        var activeItem;
        // and the current room has that item
        //var activeItem = world.rooms[currentRoom].items;
        for (var i = 0; i < world.rooms[currentRoom].items.length; i++) {
            if (world.rooms[currentRoom].items[i] == itemName) { 
                activeItem = itemName;
                inventory.push(activeItem);
                result = activeItem + " added to inventory";
                if (i > -1) {
                    world.rooms[currentRoom].items.splice(i, 1);
                }
            }
        }
        if (activeItem == null) {
            result = "That item is not in this room!"
        }
    } else {
        result = "There are no items in this room to take";
    }
    return result;
}

var move = function(direction) {
    var currentExits = world.rooms[currentRoom].exits;
    if (currentExits[direction] != null) {
        var index = roomIndex(currentExits[direction].id);
        currentRoom = index;
        if (world.rooms[currentRoom].status == "lost") {
            gameOver = true;
        }
        return world.rooms[currentRoom].description;
    } else {
        return "No room could be found in that direction";   
    }
}
    
var roomIndex = function(roomName) {
    for (var i = 0; i < world.rooms.length; i++) {
        if (world.rooms[i].id == roomName) {
            return i;
        }
    }
    return -1;
}

var use = function(itemName) {
    var activeItem;
    inventory.forEach(function(item) {
        if (item.name.toLowerCase() == itemName) {
            activeItem = item;
        }
    });
    if (activeItem) {
        if (currentRoom.uses.length > 0) {
            var itemObject = searchRoom(activeItem);
            if (itemObject) {
                if (itemObject.effect) {
                    if (!itemObject.effect.consumed) {
                        currentRoom = roomIndex(itemObject.effect.goto);   
                    }
                } else {
                    return "That object doesn't do anything!";   
                }
            } else {
                return "You can't use that here";   
            }
        }
    } else {
        return ('You do not have "' + itemName + '"'); 
    }
}

start();
process.stdin.pipe(inputFilter)
             .pipe(gameFilter)
             .pipe(outputFilter)
             .pipe(process.stdout);