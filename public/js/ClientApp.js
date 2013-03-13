/*
 Rock Paper Scissors Lizard Spock :-)
 */
function ClientApp() {
    this.game = new RPSLS();
    this.session = undefined;
    this.username = undefined;
    this.users = undefined;
    this.challengeKey = undefined;
    this.remoteOpponent = undefined;
}

ClientApp.prototype.playFlash = function (fn) {
    $('.play-flash').show();
    var set = function (items, cnt) {
        if (cnt < items.length) {
            $('.flash-image').image({src: 'images/moves/' + items[cnt] + '.png', title: items[cnt]});
            $('.flash-text').text(items[cnt]);
            setTimeout(function () {
                set(items, (cnt + 1));
            }, 300)
        } else if (cnt == items.length) {
            $('.play-flash').hide();
            if (fn) {
                fn();
            }
        }
    };
    set(["Rock", "Paper", "Lizard", "Scissors", "Spock"], 0);
};

ClientApp.prototype.play = function (left, right) {
    var result = this.game.play(left, right);
    resultDisplay.render('.result-local', {move: result, message: result.message, css: 'draw-text'});
    this.playFlash(function () {
        $('.result-local').show();
    });
};

ClientApp.prototype.playRemote = function (move) {
    $.ajax({
        url: '/challenge/' + this.challengeKey + '/' + this.session.user.username + '/' + move,
        type: 'PUT',
        contentType: 'application/x-www-form-urlencoded'
    });
};

ClientApp.prototype.playComputer = function (move) {
    var context = this;
    var cnt = app.game.moves.length;
    var index = Math.floor(Math.random() * cnt);
    var compMove = app.game.moves[index];
    var result = this.game.play(move, compMove);
    var msg = context.getStatus(move, result) + ' - ' + result.message;
    this.playFlash(function () {
        resultDisplay.render('.result-computer', {move: result, message: msg, css: context.getCSS(move, result)});
        $('.result-computer').show();
    });
};

ClientApp.prototype.accept = function (key, opponent) {
    this.remoteOpponent = opponent;
    this.challengeKey = key;
    this.loadOpponentHistory(opponent);
};

ClientApp.prototype.challenge = function (challengee) {
    $.ajax({
        url: '/user/' + this.session.user.username + '/challenges/' + challengee,
        type: 'PUT',
        contentType: 'application/x-www-form-urlencoded',
        error: function () {
            alert('Challenge against [' + challengee + '] is already open - select it from the list below');
        }
    });
};

ClientApp.prototype.getChallenges = function () {
    if (this.session != undefined && this.session.user.username != undefined) {
        $.getJSON('/user/' + this.session.user.username + '/challenges?active=true', function (data) {
            challengesList.render(data != undefined ? data : []);
        });
    }
};

ClientApp.prototype.loadUserHistory = function () {
    if (this.session != undefined && this.session.user.username != undefined) {
        var emptyMessage = 'No previous challenges';
        $.getJSON('/user/' + this.session.user.username + '/challenges?active=false', function (data) {
            userHistory.render('.user-history', data != undefined ? data : [], emptyMessage);
        });
    }
};

ClientApp.prototype.loadOpponentHistory = function (opponent) {
    if (this.session != undefined && this.session.user.username != undefined) {
        $.getJSON('/challenge/between/' + this.session.user.username + '/and/' + opponent + '?active=false', function (data) {
            userHistory.render('.opponent-history', data != undefined ? data : []);
            $('.opponent-history').show();
        });
    }
};

ClientApp.prototype.showResult = function (user, opponent, challenge) {
    var context = this;
    if (this.matchesUsers(user, opponent, challenge) && this.isChallengeComplete(challenge)) {
        var m1 = this.getChallengerMove(challenge);
        var m2 = this.getChallengeeMove(challenge);
        var userMove = challenge[context.username];
        var result = context.game.play(m1, m2);
        var msg = context.getStatus(userMove, result) + ' - ' + result.message;
        $('.result-waiting').hide();
        $('.result-remote').show();
        this.playFlash(function () {
            resultDisplay.render('.result-remote', { move: result, message: msg, css: context.getCSS(userMove, result) });
        });
    }
};

ClientApp.prototype.getResult = function (user, opponent, data) {
    var result = undefined;
    for (var i = 0, len = data.length; i < len; i++) {
        var item = data[i];
        if (matchesUsers(user, opponent, item)) {
            result = item;
            break;
        }
    }
    return result;
};

ClientApp.prototype.matchesUsers = function(user1, user2, object) {
    var p1 = object.challengee;
    var p2 = object.challenger;
    return (user1 == p1 || user1 == p2) &&
        (user2 == p1 || user2 == p2);
};

ClientApp.prototype.isChallengeComplete = function (challenge) {
    var m1 = this.getChallengerMove(challenge);
    var m2 = this.getChallengeeMove(challenge);
    return isNotEmpty(m1) && isNotEmpty(m2);
};

ClientApp.prototype.getChallengerMove = function (challenge) {
    return challenge[challenge.challenger];
};

ClientApp.prototype.getChallengeeMove = function (challenge) {
    return challenge[challenge.challengee];
};

ClientApp.prototype.getChallenge = function (key, success) {
    $.getJSON('/challenge/' + key, success);
};

ClientApp.prototype.setupSockets = function () {
    var context = this;
    var challenges = io.connect('http://localhost/challenges')
        , results = io.connect('http://localhost/results');

    challenges.on(this.username, function (data) {
        challengesList.render(data != undefined ? data : []);
    });

    results.on(this.username, function (data) {
        if (isDefined(context.username) && isDefined(context.remoteOpponent)) {
            context.showResult(context.username, context.remoteOpponent, data);
        }
    });
};

ClientApp.prototype.loginForm = function () {
    if ($('#login-box').validate()) {
        this.login($('.username').val(), $('.password').val());
    }
};

ClientApp.prototype.logout = function () {
    var context = this;
    $.ajax({
        url: '/logout',
        type: 'GET',
        contentType: 'application/x-www-form-urlencoded',
        success: function () {
            document.location = '#rules';
            context.session = undefined;
            context.username = undefined;
            $('.show-user').replaceWith($('#login_menu_template').html());
        }
    });
};

ClientApp.prototype.login = function (username, password) {
    var context = this;
    $.ajax({
        url: '/login/?username=' + username + '&password=' + password,
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        error: function () {
            alert('Failed to authenticate user [' + username + ']');
        },
        success: function (data) {
            //TODO: return session upon login rather than getSession call
            context.getSession(function () {
                $('.login').hide();
            });
        }
    });
};

ClientApp.prototype.getSession = function (fn) {
    var context = this;
    $.getJSON('/session', function (data) {
        //TODO: move this to hasSession callback
        context.session = data;
        context.username = data.user.username;
        context.loadUsers(true);
        context.getChallenges();
        context.loadUserHistory();
        context.setupSockets();
        userMenu.render(data.user);
        if (fn) {
            fn()
        }
    });
};

ClientApp.prototype.signup = function (user) {
    var context = this;
    $.ajax({
        url: '/signup/',
        type: 'PUT',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(user),
        complete: function () {
            context.session = {
                user: user
            };
            context.username = user.username;
            $('.sign-up').hide();
            $('.modules').show();
        }
    });
};

ClientApp.prototype.loadUsers = function (render) {
    var context = this;
    $.getJSON('/user', function (data) {
        data.splice(data.indexOf(context.username), 1);
        context.users = data;
        if (render) {
            context.renderUsers();
        }
    });
};

ClientApp.prototype.renderUsers = function () {
    usersListDD.render(this.users);
};

ClientApp.prototype.getCSS = function (move, result) {
    if (result[move] == 1) {
        return 'win-text';
    } else if (result[move] == 0) {
        return 'draw-text';
    } else if (result[move] == -1) {
        return 'lose-text';
    }
};

ClientApp.prototype.getStatus = function (move, result) {
    if (result[move] == 1) {
        return 'Winner';
    } else if (result[move] == 0) {
        return 'Draw';
    } else if (result[move] == -1) {
        return 'Loser';
    }
};

ClientApp.prototype.setup = function (fn) {
    var context = this;

    $().image('setup', { srcs: [
        'images/moves/Rock.png',
        'images/moves/Paper.png',
        'images/moves/Scissors.png',
        'images/moves/Lizard.png',
        'images/moves/Spock.png']
    });

    $('#username').hintBox({text: 'Username', overlay: true});
    $('#password').hintBox({text: 'Password', overlay: true});
    $('#new-username').hintBox({text: 'Username', overlay: true});
    $('#new-password').hintBox({text: 'Password', overlay: true});
    $('#new-password-confirm').hintBox({text: 'Confirm password', overlay: true});
    $('#new-first-name').hintBox({text: 'First name', overlay: true});
    $('#new-last-name').hintBox({text: 'Last name', overlay: true});
    $('#new-email').hintBox({text: 'Email', overlay: true});

    $('#play-local').click(function () {
        if ($('#game-local').validate()) {
            $('.result-local').hide();
            context.play($('.left-dd').val(), $('.right-dd').val());
        }
    });
    $('#play-remote').click(function () {
        if ($('#user-move').validate()) {
            context.playRemote($('.user-moves-dd').val());
            $('.result-waiting').show();
            $('#user-move').hide();
        }
    });
    $('#play-computer').click(function () {
        if ($('#game-computer').validate()) {
            context.playComputer($('.local-move').val());
            $('.result-computer').hide();
        }
    });
    $('#challenge').click(function () {
        if ($('#select-opponent').validate()) {
            context.challenge($('.users-dd').val());
        }
    });
    $('.show-login').live('click', function () {
        //This is hacky - need to sort with CSS later
        $('.login').toggle();
        var newLeft = $('.show-login').position().left + 10;
        $('.login').offset({top: 50, left: newLeft});
    });
    $('.show-sign-up').click(function () {
        //This is hacky - need to sort with CSS later
        $('.login, .modules').hide();
        $('.sign-up').show();
        var newLeft = $('.menu-bar li:eq(0)').position().left;
        $('.sign-up').offset({top: 50, left: newLeft});
    });
    $('#users-dd').live('change', function () {
        var val = $('.users-dd').val();
    });
    $('#login').click(function () {
        context.loginForm();
    });
    $('#signUp').click(function () {
        //TODO: validate input + passwords match
        if ($('#sign-up-box').validate()) {
            var user = {
                username: $('#new-username').val(),
                firstName: $('#new-first-name').val(),
                lastName: $('#new-last-name').val(),
                password: $('#new-password').val(),
                email: $('#new-email').val()
            };
            context.signup(user);
        }
    });
    $('#cancelSignUp').click(function () {
        $('.sign-up').hide();
        $('.modules').show();
    });
    $('.password, .username').keyup(function (e) {
        if (e.keyCode == 13) {
            context.loginForm();
        }
    });

    this.getSession();

    if (fn) {
        fn()
    }
};

function isDefined(val) {
    return !isUndefined(val);
}

function isUndefined(val) {
    return typeof val === "undefined";
}

function isNotEmpty(val) {
    return (val != null && val.length > 0);
}

function isEmpty(val) {
    return !isNotEmpty(val);
}

//Used in user_history_template
function getOpponent(challenge) {
    var p1 = challenge.challenger;
    var p2 = challenge.challengee;

    if (p1 == app.username) {
        return p2;
    } else if (p2 == app.username) {
        return p1;
    }
    throw "No match to user";
}

function extractOpponent(key, user) {
    var items = key.split(':');
    if (items[0] == user) {
        return items[1];
    } else if (items[1] == user) {
        return items[0];
    }
    throw "No match to user";
}

