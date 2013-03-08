/*
 Core Dueler capability
 */
function Dueler(wins) {
    this.moves = [];
    this.wins = [];
    this.variations = {};
    for (var i = 0; i < wins.length; i++) {
        var win = wins[i];
        this.addWin(win);
    }
    if ((this.moves.length * 2) != wins.length) {
        throw "Two wins and losses must be defined for every move - Moves[" + this.moves.length + "] - Wins[" + wins.length + "]";
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
            this.variations[xMove][yMove] = this.getWinner(xMove, yMove);
        }
    }
};

//Finds the winner between two moves
Dueler.prototype.getWinner = function (left, right) {
    var result = undefined;

    if (left === right) {
        result = { message: "It's a draw"};
        result[left] = 0;
    } else {
        for (var i = 0; i < this.wins.length; i++) {
            var win = this.wins[i];
            if ((win.winner == left || win.winner == right) &&
                (win.loser == left || win.loser == right)) {
                result = win;
                result[win.winner] = 1;
                result[win.loser] = -1;
            }
        }
    }

    return result;
};

//Check that the moves exist
Dueler.prototype.addWin = function (win) {
    if (this.moves.indexOf(win.winner) == -1) {
        this.moves.push(win.winner);
    }
    if (this.moves.indexOf(win.loser) == -1) {
        this.moves.push(win.loser);
    }
    this.wins.push(win);
};

Dueler.prototype.attack = function (left, right) {
    return this.variations[left][right];
};

function Win(winner, loser, message) {
    this.winner = winner;
    this.loser = loser;
    this.message = message;
}

if (!(typeof exports === "undefined")) {
    exports.Win = Win;
    exports.Dueler = Dueler;
}
