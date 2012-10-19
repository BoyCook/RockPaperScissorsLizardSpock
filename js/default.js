/*
 Default setup JS
 */
var Workspace = Backbone.Controller.extend({
    initialized: true,
    routes: {
        "play": "play",
        "rules": "rules",
        "about": "about",
        "search/:type/:mode/:id":  "search"   // #search/service/108
    },
    play: function() {
        $('.module').hide();
        $('.game').show();
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
});
