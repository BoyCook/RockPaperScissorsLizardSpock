/*
 Core Dueler capability
 */
function Dueler(moves, wins) {
    this.moves = moves;
    this.wins = new Array();
    this.variations = {};

    if ((moves.length * 2) != wins.length) {
        throw "Two wins and losses must be defined for every move";
    }

    for (var i = 0; i < wins.length; i++) {
        var win = wins[i];
        this.addWin(win);
    }
    this.initVariations();
}

//Build matrix of all variations
Dueler.prototype.initVariations = function () {
    for (var x = 0; x < this.moves.length; x++) {
        var xMove = this.moves[x];
        this.variations[xMove] = {};
        for (var y = 0; y < this.moves.length; y++) {
            var yMove = this.moves[y];

            if (xMove == yMove) {
                this.variations[xMove][yMove] = { message:"It's a draw"};
            } else {
                this.variations[xMove][yMove] = this.getWinner(xMove, yMove);
            }
        }
    }
};

Dueler.prototype.getWinner = function (left, right) {
    var result = undefined;
    for (var i = 0; i < this.wins.length; i++) {
        var win = this.wins[i];
        if ((win.winner == left || win.winner == right) &&
            (win.loser == left || win.loser == right)) {
            result = win;
        }
    }
    return result;
};

Dueler.prototype.addWin = function (win) {
    if (this.moves.contains(win.winner) && this.moves.contains(win.loser)) {
        this.wins.push(win);
    } else {
        throw "Error, Win must contain valid moves";
    }
};

Dueler.prototype.attack = function (left, right) {
    return this.variations[left][right];
};

function Win(winner, loser, message) {
    this.winner = winner;
    this.loser = loser;
    this.message = message;
}

if (exports != undefined) {
    exports.Win = Win;
    exports.Dueler = Dueler;
}
