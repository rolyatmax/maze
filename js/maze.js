var _ = require('underscore');

var DELIMITER = '|';

function Maze(grid) {
    this.grid = grid;
    this.stack = [];

    this.connections = {};
    var x = grid.w;
    while (x--) {
        var y = grid.h;
        while (y--) {
            this.connections[x + DELIMITER + y] = [];
        }
    }
}

Maze.prototype = {
    make: function() {
        if (this.made) {
            throw 'Maze already generated';
        }
        var start = nodeKey(0, 0);
        var current = start;
        while (!this.isFinished()) {
            var connection = this.pickMove(current);
            var next = connection[0];
            current = connection[1];
            if (next) {
                this.createConnection(next, current);
                current = next;
            }
        }
        this.made = true;
        return this.connections;
    },

    createConnection: function(next, current) {
        this.connections[next] = this.connections[next] || [];
        this.connections[current] = this.connections[current] || [];
        this.connections[next].push(current);
        this.connections[current].push(next);
    },

    pickMove: function(current) {
        var options = this.getOptions(current);
        if (options.length) {
            this.stack.push(current);
            var choice = _.sample(options);
            return [choice, current];
        }
        return this.pickMove(this.stack.pop());
    },

    getOptions: function(node) {
        return _.filter(getAdjacentNodes(node), function(option) {
            return this.grid.isInGrid(option) && !this.connections[option].length;
        }.bind(this));
    },

    isFinished: function() {
        var unvisited = _.filter(this.connections, function(nodeConnections) {
            return nodeConnections.length === 0;
        });
        return unvisited.length === 0;
    }
};

var nodeKey = function(x, y) {
    return x + DELIMITER + y;
};

var getAdjacentNodes = function(node) {
    var coords = node.split(DELIMITER);
    var x = +coords[0];
    var y = +coords[1];
    return [
        nodeKey(x - 1, y),
        nodeKey(x + 1, y),
        nodeKey(x, y - 1),
        nodeKey(x, y + 1)
    ];
};

module.exports = Maze;
