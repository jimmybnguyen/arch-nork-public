'use strict';

var stream = require('stream');
var app = require('./lib/app.js');

/**
* Processes the user's input 
*/
var inputFilter = new stream.Transform({
  transform (chunk, encoding, done) { 
      var answer = chunk.toString().toUpperCase().trim(); //the input
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
            output = app.move(direction);
        } else if (answer.toUpperCase() == 'INVENTORY') {
            output = app.printInventory();
        } else if (answer.substring(0,4).toUpperCase() == 'TAKE') {
            var item = answer.substring(5).toLowerCase();
            output = app.take(item);
        } else if (answer.substring(0,3).toUpperCase() == 'USE') {
            var item = answer.substring(4).toLowerCase();
            output = app.use(item);
        } else if (answer.toUpperCase() == 'HELP') {
                 output = app.help();
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
        if (!app.gameOver) {
            this.push(output + "\n" + "What would you like to do?" + "\n> "); 
        } else {
            this.push(output);
        }
        done();
        if (app.gameOver) { //the player lost or won the game
            process.exit();
        }   
      },
    
      flush(done) { 
        done();
      }
});

app.start();
process.stdin.pipe(inputFilter)
             .pipe(gameFilter)
             .pipe(outputFilter)
             .pipe(process.stdout);