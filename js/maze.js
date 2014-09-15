var _ = require('underscore');
var helpers = require('./helpers');


function Maze(grid) {
    this.grid = grid;
    this.stack = [];

    this.connections = helpers.createDotDict(grid.w, grid.h);
    this.draw = this.draw.bind(this, this.grid.ctx);

    // give the screen a chance to draw
    this.grid.canvas.classList.add('hide');
    var onFinish = _.delay.bind(_, this.onFinish.bind(this), 300);
    _.defer(this.make.bind(this, this.onProgress, onFinish));
}

Maze.prototype = {
    onFinish: function() {
        var progressContainer = document.querySelector('.loading');
        progressContainer.parentElement.removeChild(progressContainer);
        this.draw();
        this.grid.canvas.classList.remove('hide');
    },

    onProgress: function(perc) {
        document.querySelector('.progress').style.width = perc + '%';
    },

    draw: function(ctx) {
        var spacing = this.grid.spacing;
        _.each(this.connections, function(ends, start) {
            var startPos = helpers.getCoords(start);
            ends.forEach(function(end) {
                var endPos = helpers.getCoords(end);
                ctx.strokeStyle = '#555';
                ctx.beginPath();
                ctx.moveTo(startPos.x * spacing + 1, startPos.y * spacing + 1);
                ctx.lineTo(endPos.x * spacing + 1, endPos.y * spacing + 1);
                ctx.stroke();
            });
        });
    },

    make: function(updateCb, finishCb) {
        if (this.made) {
            throw 'Maze already generated';
        }
        var start = helpers.nodeKey(0, 0);
        var current = start;
        var isFinished = this.isFinished.bind(this, updateCb);

        this.drawPath(isFinished, finishCb, current);
        this.made = true;
    },

    drawPath: function(isFinished, finishCb, current) {
        if (isFinished()) {
            return finishCb();
        }

        var connection = this.pickMove(current);
        var next = connection[0];
        current = connection[1];
        if (next) {
            this.createConnection(next, current);
            current = next;
        }
        var drawPath = this.drawPath.bind(this, isFinished, finishCb, current);
        _.defer(drawPath);
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
        return _.filter(helpers.getAdjacentNodes(node), function(option) {
            return this.grid.isInGrid(option) && !this.connections[option].length;
        }.bind(this));
    },

    isFinished: function(updateCb) {
        var unvisited = _.filter(this.connections, function(nodeConnections) {
            return nodeConnections.length === 0;
        });
        var finished = unvisited.length === 0;
        var total = this.grid.w * this.grid.h;
        var perc = finished ? 100 : (100 * (total - unvisited.length) / total) | 0;
        if (updateCb) updateCb(perc);
        return finished;
    }
};

module.exports = Maze;
