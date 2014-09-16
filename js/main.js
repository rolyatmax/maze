var _ = require('underscore');

var Grid = require('./grid');
var Maze = require('./maze');
var Solver = require('./solver');

var mazeEl;
var grid, maze, solver;
window.solvers = [];


var setup = function() {
    mazeEl = document.querySelector('#maze');
    document.querySelector('.new-maze').addEventListener('click', newMaze);
    document.querySelector('.pause').addEventListener('click', pause);
    document.querySelector('.new-policy').addEventListener('click', newSolver);
    start();
};

var pause = function() {
    solver.togglePlay();
};

var start = function() {
    grid = new Grid(20, 12, mazeEl);
    maze = new Maze(grid);
    setupSolver();

    window._ = _;
};

var setupSolver = function() {
    solver = new Solver(maze);
    solvers.push(solver);
    maze.onGenerated(solver.startTraining.bind(solver));
};

var newSolver = function() {
    document.querySelector('.messages').innerHTML = '';
    solver.destroy();
    setupSolver();
};

var newMaze = function() {
    solver.destroy();
    mazeEl.innerHTML = '';
    document.querySelector('.messages').innerHTML = '';
    solvers = [];
    start();
};

window.onload = setup;
