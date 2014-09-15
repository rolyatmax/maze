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

    _.defaults(this, {
        'discover': 0.0,
        'alpha': 1.0,
        'discount': 0.2,
        'decay': 0.99996
    });
}

Solver.prototype = {
    start: function() {
        this.startTime = this.startTime || Date.now();
        this.path = [];
        this.current = helpers.nodeKey(0, 0);
        this.play();
    },

    play: function() {
        var next = this.choose();
        var evaluateFn = this.evaluate.bind(this, this.current);
        this.path.push(next);
        this.current = next;
        evaluateFn();

        if (next === this.end) {
            return this.completedMaze();
        }
        this.play();
        // _.defer(this.play.bind(this));
    },

    completedMaze: function() {
        console.log(this.runs + ': Completed Maze in ' + this.path.length + ' steps');
        this.runs += 1;

        this.scores.push(this.path.length);
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
        var actions = _.map(this.policy[this.current], function(value, node) {
            return {
                'nodeMovedTo': node,
                'value': value
            };
        });

        var min = _.min(actions, function(action) { return action['value']; });
        var max = _.max(actions, function(action) { return action['value']; });

        var chooseRandom = (min['value'] === max['value'] || Math.random() < this.discover);
        var action = chooseRandom ? _.sample(actions) : max;

        return action['nodeMovedTo'];
    },

    evaluate: function(last) {
        _ensureDefaultVals(this.policy, this.current, this.maze);

        // every move is punished in order to encourage expediency
        var punishment = -1;
        var prevValue = this.policy[last][this.current];
        var curBestChoice = _.max(this.policy[this.current]);
        var newValue = (1 - this.discount) * prevValue + this.alpha * (punishment + this.discount * curBestChoice);
        this.policy[last][this.current] = newValue;

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
