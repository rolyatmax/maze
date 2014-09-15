
var DELIMITER = '|';


function getCoords(node) {
    var coords = node.split(DELIMITER);
    var x = +coords[0];
    var y = +coords[1];
    return {x: x, y: y};
}

function createDotList(w, h) {
    var dots = [];
    var x = w;
    while (x--) {
        var y = h;
        while (y--) {
            dots.push(x + DELIMITER + y);
        }
    }
    return dots;
}

function createDotDict(w, h) {
    var dict = {};
    var x = w;
    while (x--) {
        var y = h;
        while (y--) {
            dict[x + DELIMITER + y] = [];
        }
    }
    return dict;
}

function nodeKey(x, y) {
    return x + DELIMITER + y;
}

function getAdjacentNodes(node) {
    var pos = getCoords(node);
    return [
        nodeKey(pos.x - 1, pos.y),
        nodeKey(pos.x + 1, pos.y),
        nodeKey(pos.x, pos.y - 1),
        nodeKey(pos.x, pos.y + 1)
    ];
}

module.exports = {
    'DELIMITER': DELIMITER,
    'MIN_SPACING': 5,
    'MAX_SPACING': 80,
    'DOT_SIZE': 2,

    getCoords: getCoords,
    createDotList: createDotList,
    createDotDict: createDotDict,
    nodeKey: nodeKey,
    getAdjacentNodes: getAdjacentNodes
};
