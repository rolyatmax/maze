var _ = require('underscore');
var helpers = require('./helpers');


function Solver(maze) {
    this.maze = maze;
    this.policy = {};
    this.current = helpers.nodeKey(0, 0);
    this.end = helpers.nodeKey(maze.grid.w - 1, maze.grid.h - 1);

    this.path = [this.current];
    this.runs = 0;
    this.scores = [];
    this.playing = true;

    window.addEventListener('keydown', this.onKeydown.bind(this));
    this.setupCanvas();

    _.defaults(this, {
        'explore': 0.1,
        'alpha': 0.5,
        'discount': 0.8,
        'decay': 0.99996
    });
}

Solver.prototype = {
    setupCanvas: function() {
        this.canvas = document.createElement('canvas');

        this.canvas.width = this.maze.grid.spacing * this.maze.grid.w;
        this.canvas.height = this.maze.grid.spacing * this.maze.grid.h;

        this.ctx = this.canvas.getContext('2d');
        this.draw = this.draw.bind(this, this.ctx);
        this.maze.grid.el.appendChild(this.canvas);
    },

    draw: function(ctx, start, end) {
        var spacing = this.maze.grid.spacing;
        var startPos = helpers.getCoords(start);
        var endPos = helpers.getCoords(end);
        ctx.strokeStyle = 'rgba(31, 231, 31, 0.95)';
        ctx.beginPath();
        ctx.moveTo(startPos.x * spacing + 1, startPos.y * spacing + 1);
        ctx.lineTo(endPos.x * spacing + 1, endPos.y * spacing + 1);
        ctx.stroke();
    },

    clearCanvas: function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    onKeydown: function(e) {
        if (e.which === 32) this.togglePlay(); // spacebar
    },

    togglePlay: function() {
        this.playing = !this.playing;
        if (this.playing) this.play();
    },

    start: function() {
        this.clearCanvas();
        this.startTime = this.startTime || Date.now();
        this.path = [];
        this.current = helpers.nodeKey(0, 0);
        this.play();
    },

    play: function() {
        var next = this.choose();
        var evaluateFn = this.evaluate.bind(this, this.current, -1);
        this.path.push(next);
        this.draw(this.current, next);
        this.current = next;
        evaluateFn();

        if (next === this.end) {
            return this.completedMaze();
        }
        if (this.playing) {
            _.defer(this.play.bind(this));
        }
    },

    completedMaze: function() {
        console.log(this.runs + ': Completed Maze in ' + this.path.length + ' steps');
        this.runs += 1;

        this.scores.push(this.path.length);
        var last = _.last(this.path, 2)[0];
        this.evaluate(last, 1000);

        var lastUniqScores = _.uniq(_.last(this.scores, 8));

        // stop when the last five scores are the same
        if (this.runs > 10 && lastUniqScores.length === 1) {
            console.log('Converged on optimal solution in ' + lastUniqScores[0] + ' steps');
            console.log('Performance (ms):', Date.now() - this.startTime);
        } else {
            _.delay(this.start.bind(this), 100);
        }
    },

    choose: function() {
        _ensureDefaultVals(this.policy, this.current, this.maze);
        var last = _.last(this.path, 2)[0];
        var actions = _.map(this.policy[this.current], function(value, node) {
            if (node === last && _.size(this.policy[this.current]) > 1) return false;
            return {
                'nodeMovedTo': node,
                'value': value
            };
        }.bind(this));
        actions = _.compact(actions);

        var min = _.min(actions, function(action) { return action['value']; });
        var max = _.max(actions, function(action) { return action['value']; });

        var chooseRandom = (min['value'] === max['value'] || Math.random() < this.explore);
        var action = chooseRandom ? _.sample(actions) : max;

        return action && action['nodeMovedTo'];
    },

    evaluate: function(last, reward) {
        _ensureDefaultVals(this.policy, this.current, this.maze);

        var prevValue = this.policy[last][this.current];
        var curBestChoice = _.max(this.policy[this.current]);
        var newValue = (1 - this.discount) * prevValue + this.alpha * (reward + this.discount * curBestChoice);
        this.policy[last][this.current] = newValue;

        // console.log(this.explore);
        this.alpha *= this.decay;
    }
};

function _ensureDefaultVals(policy, current, maze) {
    policy[current] = policy[current] || {};
    var currentState = policy[current];
    var actions = maze.connections[current];
    actions.forEach(function(action) {
        currentState[action] = currentState[action] || 0;
    });
}

module.exports = Solver;
