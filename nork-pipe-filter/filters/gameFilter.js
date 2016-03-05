'use strict';

var stream = require('stream');
var app = require('../lib/app.js');

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

module.exports.gameFilter = gameFilter;