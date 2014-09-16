var _ = require('underscore');
var helpers = require('./helpers');
var loadingTemplate = require('./loading.hbs');

var MIN_SPACING = helpers.MIN_SPACING;
var MAX_SPACING = helpers.MAX_SPACING;
var DOT_SIZE = helpers.DOT_SIZE;


function Grid(w, h, el) {
    this.w = w;
    this.h = h;
    this.el = el;
    this.spacing = MIN_SPACING; // default

    this.dots = helpers.createDotList(this.w, this.h);

    this.el.innerHTML = loadingTemplate();
    this.setupCanvas();
}

Grid.prototype = {
    setupCanvas: function() {
        this.canvas = document.createElement('canvas');
        var pWidth = parseInt(window.getComputedStyle(this.el)['width'], 10);
        var spacing = (pWidth / this.w) | 0;
        this.spacing = Math.min(Math.max(MIN_SPACING, spacing), MAX_SPACING) / 2;

        this.canvas.style.backgroundColor = '#3d3d3d';
        this.canvas.width = this.spacing * this.w * 2;
        this.canvas.height = this.spacing * this.h * 2;

        this.ctx = this.canvas.getContext('2d');
        this.el.appendChild(this.canvas);
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
