'use strict';

var stream = require('stream');
var app = require('./lib/app.js');
var inputFilter = require('./filters/inputFilter.js');
var gameFilter = require('./filters/gameFilter.js');
var outputFilter = require('./filters/outputFilter.js');

app.start();

process.stdin.pipe(inputFilter.inputFilter)
             .pipe(gameFilter.gameFilter)
             .pipe(outputFilter.outputFilter)
             .pipe(process.stdout);