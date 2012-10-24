/*
 Default setup JS
 */
var Workspace = Backbone.Controller.extend({
    initialized: true,
    routes: {
        "play-remote": "playRemote",
        "play-local": "playLocal",
        "play-computer": "playComputer",
        "rules": "rules",
        "about": "about",
        "search/:type/:mode/:id":  "search"   // #search/service/108
    },
    playRemote: function() {
        $('.module').hide();
        $('.game-remote').show();
    },
    playLocal: function() {
        $('.module').hide();
        $('.game-local').show();
    },
    playComputer: function() {
        $('.module').hide();
        $('.game-computer').show();
    },
    rules: function() {
        $('.module').hide();
        $('.rules').show();
    },
    about: function() {
        $('.module').hide();
        $('.about').show();
    },
    search: function(type, id, version) {

    }
});

var app = new RPSLS();
$(document).ready(function () {
    app = new RPSLS();
    app.setup();
    new Workspace();
    Backbone.history.start();

    $('.module').hide();
    $('.rules').show();
});
