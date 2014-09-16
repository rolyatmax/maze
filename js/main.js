var _ = require('underscore');

var Grid = require('./grid');
var Maze = require('./maze');
var Solver = require('./solver');


var start = function() {
    var grid = new Grid(20, 12, document.querySelector('#maze'));
    var maze = new Maze(grid);
    var solver = new Solver(maze);

    maze.onGenerated(solver.startTraining.bind(solver));

    window.solver = solver;
    window._ = _;
};

window.onload = start;
