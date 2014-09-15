var _ = require('underscore');

var Grid = require('./grid');
var Maze = require('./maze');

var start = function() {
    var $maze = document.querySelector('#maze');
    var grid = new Grid(40, 30, $maze);
    var maze = new Maze(grid);

    window.maze = maze;
    window._ = _;
};

window.onload = start;
