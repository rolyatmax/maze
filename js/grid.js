var _ = require('underscore');

var DELIMITER = '|';

function Grid(w, h) {
    this.w = w;
    this.h = h;
}

Grid.prototype = {
    isEdge: function(node) {
        var coords = node.split(DELIMITER);
        var x = +coords[0];
        var y = +coords[1];
        if (x === 0 || y === 0 || x >= this.w - 1 || y >= this.h - 1) {
            return true;
        }
        return false;
    },

    isInGrid: function(node) {
        var coords = node.split(DELIMITER);
        var x = +coords[0];
        var y = +coords[1];
        if (x < 0 || y < 0 || x >= this.w || y >= this.h) {
            return false;
        }
        return true;
    }
};

module.exports = Grid;
