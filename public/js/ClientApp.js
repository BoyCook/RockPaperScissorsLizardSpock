/*
 Rock Paper Scissors Lizard Spock :-)
 */
function ClientApp() {
    this.game = new RPSLS();
    this.session = undefined;
    this.users = undefined;
    this.challengeKey = undefined;
    this.cPid = undefined
}

ClientApp.prototype.play = function (left, right) {
    var result = this.game.play(left, right);
    $('.result').text(result.message);
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
        contentType:'application/x-www-form-urlencoded'
    });
};

ClientApp.prototype.checkForChallenges = function () {
    var context = this;
    this.cPid = setInterval(function () {
        if (context.session != undefined && context.session.user.username != undefined) {
            context.getChallenges();
        }
    }, 5000);
};

ClientApp.prototype.getChallenges = function () {
    $.getJSON('/user/' + this.session.user.username + '/challenges/', function (data) {
        challengesList.render(data != undefined ? data : []);
    });
};

ClientApp.prototype.checkResult = function (key) {
    var context = this;
    var pid = setInterval(function(){
        context.getResult(key, function (result) {
            var p1 = result.challenger;
            var p2 = result.challengee;
            if (result[p1] != undefined && result[p2] != undefined) {
                $('.result-remote').text(JSON.stringify(result));
                clearInterval(pid);
            }
        })
    }, 1000);
};

ClientApp.prototype.getResult = function (key, success) {
    $.getJSON('/challenge/' + key, success);
};

ClientApp.prototype.getSession = function (fn) {
    var context = this;
    $.getJSON('/session', function (data) {
        context.session = data;
        if (fn) {
            fn()
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
            alert('Failed to authenticate user');
        },
        success:function (data) {
            context.session = data;
            $('.login').hide();
        }
    });
};

ClientApp.prototype.signup = function (user) {
    $.ajax({
        url:'/signup/',
        type:'PUT',
        contentType:'application/json',
        dataType:'json',
        data:JSON.stringify(user),
        complete:function () {
            $('.sign-up').hide();
            $('.modules').show();
        }
    });
};

ClientApp.prototype.loadUsers = function (render) {
    var context = this;
    $.getJSON('/user', function (data) {
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

    $('#play-local').click(function () {
        context.play($('.left-dd').val(), $('.right-dd').val());
    });
    $('#play-remote').click(function () {
        context.playRemote($('.user-moves-dd').val());
    });
    $('#challenge').click(function () {
        context.challenge($('.users-dd').val());
    });
    $('.show-login').click(function () {
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
        context.login($('.username').val(), $('.password').val());
    });
    $('#signUp').click(function () {
        //TODO: validate input + passwords match
        var user = {
            username:$('.new-username').val(),
            firstName:$('.new-first-name').val(),
            lastName:$('.new-last-name').val(),
            password:$('.new-password').val(),
            email:$('.new-email').val()
        };
        context.signup(user);
    });
    $('#cancelSignUp').click(function () {
        $('.sign-up').hide();
        $('.modules').show();
    });
    this.loadUsers(true);
    this.getSession();
    this.checkForChallenges();

    if (fn) {
        fn()
    }
};
