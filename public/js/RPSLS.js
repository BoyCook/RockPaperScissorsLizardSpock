/*
 Rock Paper Scissors Lizard Spock :-)
 */
function RPSLS() {
    this.moves = ['Rock', 'Paper', 'Scissors', 'Lizard', 'Spock'];
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
    this.dueler = new Dueler(this.moves, this.wins);
    this.users = undefined;
}

RPSLS.prototype.play = function (left, right) {
    var result = this.dueler.attack(left, right);
    $('.result').text(result.message);
};

RPSLS.prototype.setup = function () {
    var context = this;
    var movesDirective = {
        "option.value":{
            "move <- moves":{
                ".":"move",
                "@value":"move"
            }
        }
    };
    var rulesDirective = {
        "li":{
            "rule <- rules":{
                ".": "rule.message"
            }
        }
    };

    $('.moves-dd').render({moves: this.moves}, movesDirective);
    $('.rules-list').render({rules: this.wins}, rulesDirective);

    $('#play-local').click(function() {
        context.play($('.left-dd').val(), $('.right-dd').val());
    });
    $('#play-remote').click(function() {
        context.play($('.left-dd').val(), $('.right-dd').val());
    });
    $('#users-dd').live('change', function() {
        var val = $('.users-dd').val();
        console.log('Playing: ' + val);
        $('.user-move').show();
    });
    $('#addUser').click(function() {
        $.ajax({
            url: '/user/' + $('#user-name').val(),
            type: 'PUT',
            contentType: 'application/x-www-form-urlencoded',
            dataType: 'json',
            complete: function() {
                context.loadUsers(true);
            }
        });
    });

//    this.loadUsers(true);
};

RPSLS.prototype.loadUsers = function (render) {
    var context = this;
    $.getJSON('/user', function (data) {
        context.users = data;
        if (render) {
            context.renderUsers();
        }
    });
};

RPSLS.prototype.renderUsers = function () {
    var usersDirective = {
        "option.value":{
            "user <- users":{
                ".":"user",
                "@value":"user"
            }
        }
    };
    $('.users-dd').render({users: this.users}, usersDirective);
};
