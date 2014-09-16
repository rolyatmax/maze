var _ = require('underscore');
var helpers = require('./helpers');


function Stats(solver) {
    this.solver = solver;

    this.setupCanvas();
}

Stats.prototype = {
    setupCanvas: function() {
        this.canvas = document.createElement('canvas');
        var pWidth = parseInt(window.getComputedStyle(this.el)['width'], 10);
        this.spacing = (pWidth / this.w) | 0;
        this.spacing = Math.min(Math.max(MIN_SPACING, this.spacing), MAX_SPACING);

        this.canvas.width = this.spacing * this.w;
        this.canvas.height = this.spacing * this.h;

        this.ctx = this.canvas.getContext('2d');
        this.draw = this.draw.bind(this, this.ctx);
        this.el.appendChild(this.canvas);
    },

    draw: function(ctx) {
        this.dots.forEach(function(dot) {
            var pos = helpers.getCoords(dot);
            ctx.fillStyle = '#555';
            ctx.fillRect(pos.x * this.spacing + 1, pos.y * this.spacing + 1, DOT_SIZE, DOT_SIZE);
        }.bind(this));
    }
};

module.exports = Stats;
