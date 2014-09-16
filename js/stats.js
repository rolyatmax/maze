var _ = require('underscore');
var helpers = require('./helpers');


function Stats(solver) {
    this.solver = solver;

    this.solver.onPlay = this.visualizePolicy.bind(this);

    this.showingPolicy = false;

    this.setupCanvas();
}

Stats.prototype = {
    setupCanvas: function() {
        this.canvas = document.createElement('canvas');

        var grid = this.solver.maze.grid;

        this.canvas.width = grid.spacing * grid.w * 2;
        this.canvas.height = grid.spacing * grid.h * 2;

        this.ctx = this.canvas.getContext('2d');
        grid.el.appendChild(this.canvas);
    },

    clearCanvas: function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    togglePolicyViz: function() {
        this.showingPolicy = !this.showingPolicy;
        if (this.showingPolicy) {
            this.visualizePolicy();
        } else {
            this.clearCanvas();
            this.solver.canvas.style.opacity = 1;
        }
    },

    visualizePolicy: function() {
        if (!this.showingPolicy) {
            return;
        }
        this.clearCanvas();
        this.solver.canvas.style.opacity = 0.2;
        var values = _.map(this.solver.policy, function(vals, node) {
            return {
                'name': node,
                'value': _.max(vals)
            };
        }.bind(this));
        var high = _.max(values, function(node) { return node['value']; })['value'];
        var low = _.min(values, function(node) { return node['value']; })['value'];
        var spectrumSize = high - low;
        values.forEach(function(node) {
            node['value'] = (node['value'] - low - (spectrumSize / 2)) / spectrumSize;
            this.drawDot(node);
        }.bind(this));
    },

    drawDot: function(node) {
        var spacing = this.solver.maze.grid.spacing;
        var coords = helpers.getCoords(node['name']);
        var val = (node['value'] + 1) / 2; // temp?
        this.ctx.fillStyle = 'rgba(250, 10, 10, ' + val + ')';
        this.ctx.fillRect(coords.x * spacing * 2, coords.y * spacing * 2, spacing * 2, spacing * 2);
    },

    destroy: function() {
        this.canvas.parentElement.removeChild(this.canvas);
    }
};

module.exports = Stats;
