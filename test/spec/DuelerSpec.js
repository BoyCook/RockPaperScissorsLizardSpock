Win = require('../../public/js/dueler.js').Win;
Dueler = require('../../public/js/dueler.js').Dueler;
Array = require('../../public/js/Array.js').Array;

describe('Dueler', function () {
    var dueler;
    var wins;
    var moves = ['Rock', 'Paper', 'Scissors', 'Lizard', 'Spock'];

    beforeEach(function () {
        moves = ['Rock', 'Paper', 'Scissors', 'Lizard', 'Spock'];
        wins = new Array();
        wins.push(new Win('Scissors', 'Paper', 'Scissors cuts paper'));
        wins.push(new Win('Paper', 'Rock', 'Paper covers rock'));
        wins.push(new Win('Rock', 'Lizard', 'Rock crushes lizard'));
        wins.push(new Win('Lizard', 'Spock', 'Lizard poisons Spock'));
        wins.push(new Win('Spock', 'Scissors', 'Spock smashes scissors'));
        wins.push(new Win('Scissors', 'Lizard', 'Scissors decapitates lizard'));
        wins.push(new Win('Lizard', 'Paper', 'Lizard eats paper'));
        wins.push(new Win('Paper', 'Spock', 'Paper disproves Spock'));
        wins.push(new Win('Spock', 'Rock', 'Spock vaporizes rock'));
        wins.push(new Win('Rock', 'Scissors', 'As it always has, rock crushes scissors'));
        dueler = new Dueler(moves, wins);

        expect(moves).toBeDefined();
        expect(moves.length).toEqual(5);
        expect(wins).toBeDefined();
        expect(wins.length).toEqual(10);
        expect(dueler).toBeDefined();
    });

    it('should have the correct amount of moves', function () {
        expect(dueler.moves).toEqual(moves);
    });

    it('should have the correct amount of wins', function () {
        expect(dueler.wins).toEqual(wins);
    });

    it('Scissors should beat Paper', function () {
        var attack = dueler.attack('Scissors', 'Paper');
        expect(attack.winner).toEqual('Scissors');
        expect(attack.message).toEqual('Scissors cuts paper');
        expect(attack.Scissors).toEqual(1);
        expect(attack.Paper).toEqual(-1);
    });

    it('Paper should beat Rock', function () {
        var attack = dueler.attack('Paper', 'Rock');
        expect(attack.winner).toEqual('Paper');
        expect(attack.message).toEqual('Paper covers rock');
        expect(attack.Paper).toEqual(1);
        expect(attack.Rock).toEqual(-1);
    });

    it('Rock should beat Lizard', function () {
        var attack = dueler.attack('Rock', 'Lizard');
        expect(attack.winner).toEqual('Rock');
        expect(attack.message).toEqual('Rock crushes lizard');
        expect(attack.Rock).toEqual(1);
        expect(attack.Lizard).toEqual(-1);
    });

    it('Lizard should beat Spock', function () {
        var attack = dueler.attack('Lizard', 'Spock');
        expect(attack.winner).toEqual('Lizard');
        expect(attack.message).toEqual('Lizard poisons Spock');
        expect(attack.Lizard).toEqual(1);
        expect(attack.Spock).toEqual(-1);
    });

    it('Spock should beat Scissors', function () {
        var attack = dueler.attack('Spock', 'Scissors');
        expect(attack.winner).toEqual('Spock');
        expect(attack.message).toEqual('Spock smashes scissors');
        expect(attack.Spock).toEqual(1);
        expect(attack.Scissors).toEqual(-1);
    });

    it('Scissors should beat Lizard', function () {
        var attack = dueler.attack('Scissors', 'Lizard');
        expect(attack.winner).toEqual('Scissors');
        expect(attack.message).toEqual('Scissors decapitates lizard');
        expect(attack.Scissors).toEqual(1);
        expect(attack.Lizard).toEqual(-1);
    });

    it('Lizard should beat Paper', function () {
        var attack = dueler.attack('Lizard', 'Paper');
        expect(attack.winner).toEqual('Lizard');
        expect(attack.message).toEqual('Lizard eats paper');
        expect(attack.Lizard).toEqual(1);
        expect(attack.Paper).toEqual(-1);
    });

    it('Paper should beat Spock', function () {
        var attack = dueler.attack('Paper', 'Spock');
        expect(attack.winner).toEqual('Paper');
        expect(attack.message).toEqual('Paper disproves Spock');
        expect(attack.Paper).toEqual(1);
        expect(attack.Spock).toEqual(-1);
    });

    it('Spock should beat Rock', function () {
        var attack = dueler.attack('Spock', 'Rock');
        expect(attack.winner).toEqual('Spock');
        expect(attack.message).toEqual('Spock vaporizes rock');
        expect(attack.Spock).toEqual(1);
        expect(attack.Rock).toEqual(-1);
    });

    it('Rock should beat Scissors', function () {
        var attack = dueler.attack('Rock', 'Scissors');
        expect(attack.winner).toEqual('Rock');
        expect(attack.message).toEqual('As it always has, rock crushes scissors');
        expect(attack.Rock).toEqual(1);
        expect(attack.Scissors).toEqual(-1);
    });

    it('Rock should draw with Rock', function () {
        var attack = dueler.attack('Rock', 'Rock');
        expect(attack.winner).toBeUndefined();
        expect(attack.loser).toBeUndefined();
        expect(attack.message).toEqual("It's a draw");
        expect(attack.Rock).toEqual(0);
    });

    it('Paper should draw with Paper', function () {
        var attack = dueler.attack('Paper', 'Paper');
        expect(attack.winner).toBeUndefined();
        expect(attack.loser).toBeUndefined();
        expect(attack.message).toEqual("It's a draw");
        expect(attack.Paper).toEqual(0);
    });

    it('Scissors should draw with Scissors', function () {
        var attack = dueler.attack('Scissors', 'Scissors');
        expect(attack.winner).toBeUndefined();
        expect(attack.loser).toBeUndefined();
        expect(attack.message).toEqual("It's a draw");
        expect(attack.Scissors).toEqual(0);
    });

    it('Lizard should draw with Lizard', function () {
        var attack = dueler.attack('Lizard', 'Lizard');
        expect(attack.winner).toBeUndefined();
        expect(attack.loser).toBeUndefined();
        expect(attack.message).toEqual("It's a draw");
        expect(attack.Lizard).toEqual(0);
    });

    it('Spock should draw with Spock', function () {
        var attack = dueler.attack('Spock', 'Spock');
        expect(attack.winner).toBeUndefined();
        expect(attack.loser).toBeUndefined();
        expect(attack.message).toEqual("It's a draw");
        expect(attack.Spock).toEqual(0);
    });
});
