'use strict';

var stream = require('stream');
var app = require('../lib/app.js');

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

module.exports.outputFilter = outputFilter;