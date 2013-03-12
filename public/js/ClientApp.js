/*
 Rock Paper Scissors Lizard Spock :-)
 */
function ClientApp() {
    this.game = new RPSLS();
    this.session = undefined;
    this.username = undefined;
    this.users = undefined;
    this.challengeKey = undefined;
    this.cPid = undefined
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
    var context = this;
    $.ajax({
        url: '/challenge/' + this.challengeKey + '/' + this.session.user.username + '/' + move,
        type: 'PUT',
        contentType: 'application/x-www-form-urlencoded',
        success: function () {
            context.checkResult(context.challengeKey);
        }
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
    this.challengeKey = key;
    clearInterval(this.cPid);
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

ClientApp.prototype.checkForChallenges = function () {
    var context = this;
    context.getChallenges();
    this.cPid = setInterval(function () {
        context.getChallenges();
    }, 5000);
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

ClientApp.prototype.checkResult = function (key) {
    var context = this;
    var success = function (challenge) {
        var m1 = this.getChallengerMove(challenge);
        var m2 = this.getChallengeeMove(challenge);
        var userMove = challenge[context.username];
        var result = context.game.play(m1, m2);
        var msg = context.getStatus(userMove, result) + ' - ' + result.message;
        $('.result-waiting').hide();
        $('.result-remote').show();
        resultDisplay.render('.result-remote', { move: result, message: msg, css: context.getCSS(userMove, result) });
        context.checkForChallenges();
    };

    var noResult = function () {
        setTimeout(function () {
            context.playFlash(function () {
                context.getResult(key, noResult, success);
            });
        }, 1000);
    };

    this.playFlash(function () {
        context.getResult(key, noResult, success);
    });
};

ClientApp.prototype.getResult = function (key, noResult, success) {
    var context = this;
    this.getChallenge(key, function (challenge) {
        if (context.isChallengeComplete(challenge)) {
            success(challenge);
        } else {
            noResult();
        }
    });
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
            clearInterval(this.cPid);
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
            //TODO: return session upon login
            context.getSession(function () {
                $('.login').hide();
            });
        }
    });
};

ClientApp.prototype.setupSocket = function () {
    //checkResult - checkForChallenges
    //Setup socket listening for user
    var socket = io.connect('http://localhost');

//    socket.emit(this.username, {});

    socket.on(this.username, function (data) {
        console.log(data);
//                    socket.emit('my other event', { my: 'data' });
    });
//    var chat = io.connect('http://localhost/chat')
//        , news = io.connect('http://localhost/news');
//
//    chat.on('connect', function () {
//        chat.emit('hi!');
//    });
//
//    news.on('news', function () {
//        news.emit('woot');
//    });
};

ClientApp.prototype.getSession = function (fn) {
    var context = this;
    $.getJSON('/session', function (data) {
        context.session = data;
        context.username = data.user.username;
        context.loadUsers(true);
        context.checkForChallenges();
        context.loadUserHistory();
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
        data.remove(context.username);
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
        console.log('Playing: ' + val);
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

