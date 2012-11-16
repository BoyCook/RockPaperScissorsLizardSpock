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

ClientApp.prototype.play = function (left, right) {
    var result = this.game.play(left, right);
    resultDisplay.render('.result-local', {move:result, message:result.message});
    $('.result-local').show();
};

ClientApp.prototype.playRemote = function (move) {
    var context = this;
    $.ajax({
        url:'/challenge/' + this.challengeKey + '/' + this.session.user.username + '/' + move,
        type:'PUT',
        contentType:'application/x-www-form-urlencoded',
        success:function () {
            context.checkResult(context.challengeKey);
        }
    });
};

ClientApp.prototype.accept = function (key) {
    app.challengeKey = key;
    clearInterval(this.cPid);
};

ClientApp.prototype.challenge = function (challengee) {
    $.ajax({
        url:'/user/' + this.session.user.username + '/challenges/' + challengee,
        type:'PUT',
        contentType:'application/x-www-form-urlencoded',
        error:function () {
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
        $.getJSON('/user/' + this.session.user.username + '/challenges/', function (data) {
            challengesList.render(data != undefined ? data : []);
        });
    }
};

ClientApp.prototype.checkResult = function (key) {
    var context = this;
    var pid = setInterval(function () {
        context.getChallenge(key, function (challenge) {
            var p1 = challenge.challenger;
            var p2 = challenge.challengee;
            var m1 = challenge[p1];
            var m2 = challenge[p2];
            if (isNotEmpty(m1) && isNotEmpty(m2)) {
                var result = context.game.play(m1, m2);
                var message = (challenge[context.username] == result.winner ? 'Winner' : 'Loser') + ' - ' + result.message;
                $('.result-waiting').hide();
                $('.result-remote').show();
                resultDisplay.render('.result-remote', {move:result, message:message});
                clearInterval(pid);
                context.checkForChallenges();
            }
        })
    }, 1000);
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
    $.ajax({
        url:'/logout',
        type:'GET',
        contentType:'application/x-www-form-urlencoded',
        success:function () {
            clearInterval(this.cPid);
            $('.show-user').replaceWith($('#login_menu_template').html());
        }
    });
};

ClientApp.prototype.login = function (username, password) {
    var context = this;
    $.ajax({
        url:'/login/?username=' + username + '&password=' + password,
        type:'POST',
        contentType:'application/x-www-form-urlencoded',
        error:function () {
            alert('Failed to authenticate user [' + username + ']');
        },
        success:function (data) {
            context.getSession(function(){
                $('.login').hide();
            });
        }
    });
};

ClientApp.prototype.getSession = function (fn) {
    var context = this;
    $.getJSON('/session', function (data) {
        context.session = data;
        context.username = data.user.username;
        context.loadUsers(true);
        context.checkForChallenges();
        userMenu.render(data.user);
        if (fn) {
            fn()
        }
    });
};

ClientApp.prototype.signup = function (user) {
    var context = this;
    $.ajax({
        url:'/signup/',
        type:'PUT',
        contentType:'application/json',
        dataType:'json',
        data:JSON.stringify(user),
        complete:function () {
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

ClientApp.prototype.setup = function (fn) {
    var context = this;

    $('#username').hintBox('Username');
    //TODO: use label overlay for password txt
    $('#password').hintBox('Password');
    $('#play-local').click(function () {
        if ($('#game-local').validate()) {
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
    $('#challenge').click(function () {
        if ($('#select-opponent').validate()) {
            context.challenge($('.users-dd').val());
        }
    });
    $('.show-login').live('click', function () {
        //This is hacky - need to sort with CSS later
        $('.login').toggle();
        var newLeft = $('.show-login').position().left + 10;
        $('.login').offset({top:50, left:newLeft});
    });
    $('.show-sign-up').click(function () {
        //This is hacky - need to sort with CSS later
        $('.login, .modules').hide();
        $('.sign-up').show();
        var newLeft = $('.menu-bar li:eq(0)').position().left;
        $('.sign-up').offset({top:50, left:newLeft});
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
                username:$('.new-username').val(),
                firstName:$('.new-first-name').val(),
                lastName:$('.new-last-name').val(),
                password:$('.new-password').val(),
                email:$('.new-email').val()
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
