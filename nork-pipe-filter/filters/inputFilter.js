'use strict';

var stream = require('stream');

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

module.exports.inputFilter = inputFilter;