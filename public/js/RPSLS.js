/*
 Rock Paper Scissors Lizard Spock :-)
 */

function RPSLS() {
    if (!(typeof exports === "undefined")) {
        Win = require('./dueler').Win;
        Dueler = require('./dueler').Dueler;
        Array = require('./Array').Array;
    }

    this.wins = new Array();
    this.wins.push(new Win('Scissors', 'Paper', 'Scissors cuts paper'));
    this.wins.push(new Win('Paper', 'Rock', 'Paper covers rock'));
    this.wins.push(new Win('Rock', 'Lizard', 'Rock crushes lizard'));
    this.wins.push(new Win('Lizard', 'Spock', 'Lizard poisons Spock'));
    this.wins.push(new Win('Spock', 'Scissors', 'Spock smashes scissors'));
    this.wins.push(new Win('Scissors', 'Lizard', 'Scissors decapitates lizard'));
    this.wins.push(new Win('Lizard', 'Paper', 'Lizard eats paper'));
    this.wins.push(new Win('Paper', 'Spock', 'Paper disproves Spock'));
    this.wins.push(new Win('Spock', 'Rock', 'Spock vaporizes rock'));
    this.wins.push(new Win('Rock', 'Scissors', 'As it always has, rock crushes scissors'));
    this.dueler = new Dueler(this.wins);
    this.moves = this.dueler.moves;
}

RPSLS.prototype.play = function (left, right) {
    return this.dueler.attack(left, right);
};

if (!(typeof exports === "undefined")) {
    exports.RPSLS = RPSLS;
    exports.newGame = new RPSLS();
}
