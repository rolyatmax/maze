var _ = require('underscore');
var helpers = require('./helpers');


function Solver(maze) {
    this.maze = maze;
    this.end = helpers.nodeKey(maze.grid.w - 1, maze.grid.h - 1);
    this.playing = true;

    this.msgContainer = document.querySelector('.messages');

    this.setupCanvas();

    _.defaults(this, {
        'explore': 0.0,
        'alpha': 0.5,
        'discount': 0.8,
        'decay': 0.99996,
        'rewards': {
            'step': -1,
            'finished': 1000
        }
    });
}

Solver.prototype = {
    startTraining: function() {
        this.policy = {};
        this.runs = 0;
        this.scores = [];
        this.start();
    },

    start: function() {
        this.clearCanvas();
        this.startTime = this.startTime || Date.now();
        this.path = [];
        this.current = helpers.nodeKey(0, 0);
        this.play();
    },

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

    togglePlay: function() {
        this.playing = !this.playing;
        if (this.playing) this.play();
    },

    play: function() {
        var next = this.choose();
        var evaluateFn = this.evaluate.bind(this, this.current, 'step');
        this.path.push(next);
        this.draw(this.current, next);
        this.current = next;
        evaluateFn();

        if (next === this.end) {
            return this.completedMaze();
        }

        var totalNodes = this.maze.grid.h * this.maze.grid.w;
        if (this.path.length > totalNodes * 10) {
            // this is a relatively arbitrary number that keeps the algo from
            // getting stuck
            this.msgLog('Got stuck, trying again: ' + this.path.length + ' steps');
            return _.delay(this.start.bind(this), 100);
        }
        if (this.playing) {
            _.defer(this.play.bind(this));
        }
    },

    completedMaze: function() {
        this.runs += 1;
        this.logMsg(this.runs + ': Completed: ' + this.path.length + ' steps');

        this.scores.push(this.path.length);
        var last = _.last(this.path, 2)[0];
        this.evaluate(last, 'finished');

        // stop when the last n scores are the same
        var lastUniqScores = _.uniq(_.last(this.scores, 6));
        if (this.runs > 10 && lastUniqScores.length === 1) {
            this.logMsg('Solution: ' + lastUniqScores[0] + ' steps');
            this.logMsg('Performance (ms): ' + (Date.now() - this.startTime));
        } else {
            _.delay(this.start.bind(this), 100);
        }
    },

    logMsg: function(msg) {
        console.log(msg);
        var firstChild = this.msgContainer.childNodes[0];
        var span = document.createElement('span');
        span.innerHTML = msg;
        this.msgContainer.insertBefore(span, firstChild);
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

    evaluate: function(last, rewardName) {
        _ensureDefaultVals(this.policy, this.current, this.maze);

        var reward = this.rewards[rewardName];

        var prevValue = this.policy[last][this.current];
        var curBestChoice = _.max(this.policy[this.current]);
        var newValue = (1 - this.discount) * prevValue + this.alpha * (reward + this.discount * curBestChoice);
        this.policy[last][this.current] = newValue;

        // console.log(this.explore);
        // this.alpha *= this.decay;
    },

    destroy: function() {
        this.playing = false;
        this.canvas.parentElement.removeChild(this.canvas);
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
