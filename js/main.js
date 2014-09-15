var $ = require('jquery');
var _ = require('underscore');

var Grid = require('./grid');
var Maze = require('./maze');

$(function() {
    var grid = new Grid(5, 10);
    var maze = new Maze(grid);
    maze.make();

    window.maze = maze;
    window._ = _;
});
