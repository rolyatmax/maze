var _ = require('underscore');
var helpers = require('./helpers');

var MIN_SPACING = helpers.MIN_SPACING;
var MAX_SPACING = helpers.MAX_SPACING;
var DOT_SIZE = helpers.DOT_SIZE;


function Grid(w, h, el) {
    this.w = w;
    this.h = h;
    this.spacing = MIN_SPACING; // default

    this.dots = helpers.createDotList(this.w, this.h);

    this.setupCanvas(el);
}

Grid.prototype = {
    setupCanvas: function(parent) {
        this.canvas = document.createElement('canvas');
        var pWidth = parseInt(window.getComputedStyle(parent)['width'], 10);
        this.spacing = (pWidth / this.w) | 0;
        this.spacing = Math.min(Math.max(MIN_SPACING, this.spacing), MAX_SPACING);

        this.canvas.width = this.spacing * this.w;
        this.canvas.height = this.spacing * this.h;

        this.ctx = this.canvas.getContext('2d');
        this.draw = this.draw.bind(this, this.ctx);
        parent.appendChild(this.canvas);
    },

    draw: function(ctx) {
        this.dots.forEach(function(dot) {
            var pos = helpers.getCoords(dot);
            ctx.fillStyle = '#555';
            ctx.fillRect(pos.x * this.spacing + 1, pos.y * this.spacing + 1, DOT_SIZE, DOT_SIZE);
        }.bind(this));
    },

    isEdge: function(node) {
        var pos = helpers.getCoords(node);
        if (pos.x === 0 || pos.y === 0 || pos.x >= this.w - 1 || pos.y >= this.h - 1) {
            return true;
        }
        return false;
    },

    isInGrid: function(node) {
        var pos = helpers.getCoords(node);
        if (pos.x < 0 || pos.y < 0 || pos.x >= this.w || pos.y >= this.h) {
            return false;
        }
        return true;
    }
};

module.exports = Grid;
