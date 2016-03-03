'use strict';

var world = require('../common/world');
var stream = require('stream');
var readLine = require('readline');
var util = require('util');

var currentRoom = world.rooms[0];
var inventory = [];
var gameOver = false;

/*
var rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
});*/

function start() {
    console.log(currentRoom.description);
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
        var output = chunk.toString();
        var info;
        if (output.substring(0,2).toUpperCase() == 'GO') {
            //stores the direction of movement
            info = output.substring(3).toLowerCase();
            //move(direction);
        } else if (output.toUpperCase() == 'INVENTORY') {
           output = printInventory(inventory);
        } else if (output.toUpperCase() == 'TAKE') {
            
        } else if (output.toUpperCase() == 'USE') {
            //stores the item to be used 
            info = output.substring(4).toLowerCase();
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

function take(room, item) {
    if (currentRoom.items != null) {
        inventory.push(currentRoom.items);  
        console.log('Items added to inventory: ' + currentRoom.items);
        
        // Remove items from the room
        currentRoom.items = null;
    } else {
        console.log('There is nothing in this room to take.');    
    }
}

/*
process.stdin
  .pipe(firstFilter);
*/
/*
  process.stdin.setEncoding('utf8');
  var util = require('util');

  process.stdin.on('data', function (text) {
    console.log('received data:', util.inspect(text));
    if (text === 'quit\n') {
      done();
    }
  });

  function done() {
    console.log('Now that process.stdin is paused, there is nothing more to do.');
    process.exit();
  }
  */
start();
process.stdin.pipe(inputFilter)
             .pipe(gameFilter)
             .pipe(outputFilter)
             .pipe(process.stdout);