'use strict';

var world = require('../common/world');
var readLine = require('readline');
var stream = require('stream');

var currentRoom = world.rooms[0];
var inventory = [];

console.log(currentRoom.description);