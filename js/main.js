var _ = require('underscore');

var Grid = require('./grid');
var Maze = require('./maze');
var Solver = require('./solver');
var Stats = require('./stats');

var Info = require('./info');

var mazeEl;
var grid, maze, solver, stats;
window.solvers = [];


var setup = function() {
    var info = new Info({
        text: "PUT STUFF HERE",
        keyTrigger: true,
        container: 'wrapper'
    });

    mazeEl = document.querySelector('#maze');
    document.querySelector('.new-maze').addEventListener('click', newMaze);
    document.querySelector('.pause').addEventListener('click', pause);
    document.querySelector('.new-policy').addEventListener('click', newSolver);
    document.querySelector('.visualize-policy').addEventListener('click', visualizePolicy);
    start();
};

var pause = function() {
    solver.togglePlay();
};

var visualizePolicy = function() {
    stats.togglePolicyViz();
};

var start = function() {
    grid = new Grid(15, 9, mazeEl);
    maze = new Maze(grid);
    setupSolver();

    window._ = _;
};

var setupSolver = function() {
    solver = new Solver(maze);
    solvers.push(solver);
    stats = new Stats(solver);
    maze.onGenerated(solver.startTraining.bind(solver));
};

var newSolver = function() {
    document.querySelector('.messages').innerHTML = '';
    solver.destroy();
    stats.destroy();
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
