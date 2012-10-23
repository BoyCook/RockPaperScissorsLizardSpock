describe('Dueler', function(){
    var dueler;
    var wins;
    var moves = ['Rock', 'Paper', 'Scissors', 'Lizard', 'Spock'];

    beforeEach(function(){
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

    it('should have the correct moves', function(){
        expect(dueler.moves).toEqual(moves);
    });

    it('should have the correct wins', function(){
        expect(dueler.wins).toEqual(wins);
    });
});
