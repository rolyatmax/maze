var _ = require('underscore');

var DELIMITER = '|';

function Maze(grid) {
    this.grid = grid;
}

Maze.prototype = {

};

var generatePath = function(grid, start, isFinishedFn, minSegments) {
    var segCount = 0;
    var connections = {};
    var draw = function(start, minSegments) {
        var coords = start.split(DELIMITER);
        var x = +coords[0];
        var y = +coords[1];
        var options = [
            nodeKey(x - 1, y),
            nodeKey(x + 1, y),
            nodeKey(x, y - 1),
            nodeKey(x, y + 1)
        ];
        options = _.filterBy(options, grid.isInGrid.bind(grid));

    };
};

var nodeKey = function(x, y) {
    return x + DELIMITER + y;
};


module.exports = Maze;
