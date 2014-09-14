var $ = require('jquery');
var _ = require('underscore');

var Grid = require('./grid');
var Maze = require('./maze');

$(function() {
    window.grid = new Grid(50, 100);
});
