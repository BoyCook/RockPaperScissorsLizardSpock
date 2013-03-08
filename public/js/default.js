/*
 Default setup JS
 */
var Router = Backbone.Router.extend({
    initialized:true,
    routes:{
        "play/remote":"playRemote",
        "play/local":"playLocal",
        "play/computer":"playComputer",
        "user/history": "userHistory",
        "user/view": "userDetails",
        "rules":"rules",
        "about":"about",
        "logout":"logout",
        "accept/:key":"accept",
        '*path':  'rules',
        "search/:type/:mode/:id":"search"   // #search/service/108
    },
    playRemote:function () {
        if (app.session == undefined) {
            document.location = '#';
            alert('You must login to play remotely')
        } else {
            $('.module, .result-remote, .result-waiting, .opponent-history, #user-move').hide();
            $('.game-remote, .select-opponent, .challenges').show();
        }
    },
    playLocal:function () {
        $('.module, .result-local').hide();
        $('.game-local').show();
    },
    playComputer:function () {
        $('.module').hide();
        $('.game-computer').show();
    },
    userHistory:function () {
        $('.module').hide();
        $('.user-history').show();
        app.loadUserHistory();
    },
    userDetails:function () {
        $('.module').hide();
        $('.user-details').show();
    },
    rules:function () {
        $('.module').hide();
        $('.rules').show();
    },
    about:function () {
        $('.module').hide();
        $('.about').show();
    },
    accept:function (key) {
        $('.select-opponent, .challenges').hide();
        $('.user-move').show();
        app.accept(key, extractOpponent(key, app.username));
    },
    logout: function(){
        app.logout();
    }
});

var RulesView = Backbone.View.extend({
    initialize:function () {
        this.render();
    },
    render:function () {
        var template = _.template($('#rules_template').html(), {rules:app.game.wins});
        this.$el.html(template);
    }
});

var MovesView = Backbone.View.extend({
    initialize:function () {
        this.render();
    },
    render:function () {
        var template = _.template($('#dd_template').html(), {items:app.game.moves});
        this.$el.append(template);
    }
});

var ResultView = Backbone.View.extend({
    initialize:function () {
    },
    render:function (selector, result) {
        var template = _.template($('#result_template').html(), {result:result});
        $(selector).html(template);
    }
});

var UsersListView = Backbone.View.extend({
    initialize:function () {
    },
    render:function (users) {
        var template = _.template($('#dd_template').html(), {items:users});
        this.$el.append(template);
    }
});

var ChallengesView = Backbone.View.extend({
    initialize:function () {
    },
    render:function (challenges) {
        var template = _.template($('#challenges_template').html(), {challenges:challenges});
        this.$el.html(template);
    }
});

var UserMenuView = Backbone.View.extend({
    initialize:function () {
    },
    render:function (user) {
        var template = _.template($('#user_menu_template').html(), {user:user});
        $(this.$el.selector).replaceWith(template);
    }
});

var UserHistoryView = Backbone.View.extend({
    initialize:function () {
    },
    render:function (selector, challenges, emptyMessage) {
        var template = _.template($('#user_history_template').html(), {challenges:challenges, emptyMessage: emptyMessage});
        $(selector).html(template);
    }
});

var app = undefined;
var usersListDD = undefined;
var challengesList = undefined;
var resultDisplay = undefined;
var userMenu = undefined;
var userHistory = undefined;

$(document).ready(function () {
    app = new ClientApp();
    new RulesView({ el:$('.rules-list') });
    new MovesView({ el:$('.user-moves-dd')});
    new MovesView({ el:$('.left-dd')});
    new MovesView({ el:$('.right-dd')});
    new MovesView({ el:$('.local-move')});
    resultDisplay = new ResultView();
    userHistory = new UserHistoryView();
    usersListDD = new UsersListView({ el:$('.users-dd')});
    challengesList = new ChallengesView({ el:$('.challenges')});
    userMenu = new UserMenuView({ el:$('.show-login')});

    app.setup(function () {
        $('.module, .user-move').hide();
        new Router();
        Backbone.history.start();
    });
});
