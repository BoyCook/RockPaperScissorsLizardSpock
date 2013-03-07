/**
 * @groupId 	>= org.cccs.jsLibs
 * @artefactId 	>= jquery.hintbox
 * @version   	>= 1.0
 *
 * @name 		>= jquery.hintbox
 * @description >= Adds hint text to a textbox
 * @vcs			>= git
 * @website		>= https://github.com/BoyCook/JSLibs
 * @since     	>= 2010-07-01
 * @copyright 	>= Copyright (c) 2010 CCCS Ltd. http://craigcook.co.uk
 * @author    	>= Craig Cook
 * @requires  	>= jQuery 1.4.2           http://jquery.com
 */

(function($) {
    var methods = {
        hintOverlay: function(element, text) {
            var el = $(element);
            el.parent().addClass('hintbox-container');
            el.after("<label for=\"" + element.id + "\" class=\"placeholder\">" + text + "</label>");
            var label = $('#' + element.id + ' + label');
            methods.setupEvents(el, label, false, 'placeholder-hide');
        },
        hint: function(el, text) {
            methods.setupEvents(el, el, true, 'hint', text)
        },
        setupEvents: function(el1, el2, status, css, text) {
            el1.focus(function() {
                methods.toggle(el2, !status, css, text);
            });
            el1.blur(function() {
                if (el1.val().length == 0) {
                    methods.toggle(el2, status, css, text);
                }
            });
            methods.toggle(el2, status, css, text);
        },
        toggle: function(el, on, css, text) {
            if (on) {
                el.addClass(css);
                if (text) {
                    el.val(text);
                }
            } else {
                if (el.hasClass(css)) {
                    el.val('');
                }
                el.removeClass(css);
            }
        },
        isDefined: function(val) {
            return !methods.isUndefined(val);
        },
        isUndefined: function(val) {
            if (typeof val === "undefined") {
                return true;
            } else {
                return false;
            }
        },
        getText: function(config) {
            if (methods.isDefined(config) && methods.isDefined(config.text)) {
                return config.text
            }
            return 'Type...';
        }
    };
    $.fn.hintBox = function(config) {
        var text = methods.getText(config);

        if (methods.isDefined(config) && methods.isDefined(config.overlay)) {
            return this.each(function() {
                methods.hintOverlay(this, text);
            });
        } else {
            return this.each(function() {
                methods.hint($(this), text);
            });
        }
    };
})(jQuery);
