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
    this.session = undefined;
    this.users = undefined;
    this.challengeKey = undefined;
}

RPSLS.prototype.play = function (left, right) {
    var result = this.dueler.attack(left, right);
    $('.result').text(result.message);
};

RPSLS.prototype.playRemote = function (move) {
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

RPSLS.prototype.challenge = function (challengee) {
    $.ajax({
        url:'/user/' + this.session.user.username + '/challenges/' + challengee,
        type:'PUT',
        contentType:'application/x-www-form-urlencoded'
    });
};

RPSLS.prototype.checkForChallenges = function () {
    var context = this;
    var pid = setInterval(function () {
        if (context.session != undefined && context.session.user.username != undefined) {
            context.getChallenges();
        }
    }, 5000);
};

RPSLS.prototype.getChallenges = function () {
    $.getJSON('/user/' + this.session.user.username + '/challenges/', function (data) {
        challengesList.render(data != undefined ? data : []);
    });
};

RPSLS.prototype.checkResult = function (key) {
    var context = this;
    var pid = setInterval(function(){
        context.getResult(key, function (result) {
            $('.result-remote').text(JSON.stringify(result));
            clearInterval(pid);
        })
    }, 1000);
};

RPSLS.prototype.getResult = function (key, success) {
    $.getJSON('/challenge/' + key, success);
};

RPSLS.prototype.getSession = function (fn) {
    var context = this;
    $.getJSON('/session', function (data) {
        context.session = data;
        if (fn) {
            fn()
        }
    });
};

RPSLS.prototype.login = function (username, password) {
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

RPSLS.prototype.signup = function (user) {
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
    usersListDD.render(this.users);
};

RPSLS.prototype.setup = function (fn) {
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
