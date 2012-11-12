/*
 Default setup JS
 */
var Router = Backbone.Router.extend({
    initialized:true,
    routes:{
        "play-remote":"playRemote",
        "play-local":"playLocal",
        "play-computer":"playComputer",
        "rules":"rules",
        "about":"about",
        "accept/:key":"accept",
        "search/:type/:mode/:id":"search"   // #search/service/108
    },
    playRemote:function () {
        if (app.session == undefined) {
            alert('You must login to play remotely')
        } else {
            $('.module').hide();
            $('.game-remote').show();
            $('.select-opponent, .challenges').show();
        }
    },
    playLocal:function () {
        $('.module').hide();
        $('.game-local').show();
    },
    playComputer:function () {
        $('.module').hide();
        $('.game-computer').show();
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
        app.accept(key);
    }
});

var RulesView = Backbone.View.extend({
    initialize:function () {
        this.render();
    },
    render:function () {
        var template = _.template($('#rules_template').html(), {rules: app.wins});
        this.$el.html(template);
    }
});

var MovesView = Backbone.View.extend({
    initialize:function () {
        this.render();
    },
    render:function () {
        var template = _.template($('#dd_template').html(), {items: app.moves});
        this.$el.append(template);
    }
});

var UsersListView = Backbone.View.extend({
    initialize:function () {
    },
    render:function (users) {
        var template = _.template($('#dd_template').html(), {items: users});
        this.$el.append(template);
    }
});

var ChallengesView = Backbone.View.extend({
    initialize:function () {
    },
    render:function (challenges) {
        var template = _.template($('#challenges_template').html(), {challenges: challenges});
        this.$el.html(template);
    }
});

var app = undefined;
var usersListDD = undefined;
var challengesList = undefined;

$(document).ready(function () {
    app = new ClientApp();
    app.setup(function () {
        new Router();
        new RulesView({ el:$('.rules-list') });
        new MovesView({ el:$('.user-moves-dd')});
        new MovesView({ el:$('.left-dd')});
        new MovesView({ el:$('.right-dd')});
        usersListDD = new UsersListView({ el:$('.users-dd')});
        challengesList = new ChallengesView({ el:$('.challenges')});
        Backbone.history.start();
        $('.module, .user-move').hide();
        $('.rules').show();
    });
});
