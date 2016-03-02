'use strict';

var world = require('../common/world');
var stream = require('stream');
var readLine = require('readline');
var util = require('util');

var currentRoom = world.rooms[0];
var inventory = [];

/*
var rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
});*/

function start() {
    console.log(currentRoom.description);
    //getAnswer();
}
start();

var testFilter = new stream.Transform({
  objectMode: true,   //include any existing constructor options

  transform (chunk, encoding, done) { // This is the _transform method
    var data = chunk.toString(); //read in data
    console.log(currentRoom.description);
    var transformed = data.toUpperCase(); //process data

    this.push(transformed); //pipe out data
    done(); //callback for when finished
  },

  flush(done) { // This is the _flush method
    //any final processing occurs here
    done();
  }
});

var inputFilter = new stream.Transform({
  transform (chunk, encoding, done) { // This is the _transform method
      var answer = chunk.toString().toUpperCase();

    /*
    var input = chunk.toString().toUpperCase().split(" ");
    var info;
    if (input[0] == 'GO') {
        
    } else if (input[0] == 'TAKE') {
        
    } else if (input[0] == 'USE') {
        
    } else if (input[0] == 'INVENTORY') {
        
    } else {
     // error invalid command    
    }*/

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
        console.log(answer);
        if (answer.substring(0,2).toUpperCase() == 'GO') {
            // Stores the direction of movement
            info = answer.substring(3).toLowerCase();
            //move(direction);
        } else if (answer.toUpperCase() == 'INVENTORY') {
           // console.log(printInventory(inventory));    
        } else if (answer.toUpperCase() == 'TAKE') {
            //take(currentRoom);
        } else if (answer.toUpperCase() == 'USE') {

        } else {   
        }
    }
    
});

var outputFilter = new stream.Transform({

});

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

process.stdin.pipe(inputFilter).pipe(gameFilter);