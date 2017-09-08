/* jshint newcap: false */
(function(root, factory) {
    'use strict';

    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['require'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(null, require('../dist/Class.min'));
    } else {
        // Browser globals (root is window)
        root.Collection = factory(null, root.Class);
    }
}(this, function(require, Class) {
    'use strict';

    if (require) {
        Class = require('../dist/Class.min.js');
    }

    var Collection = new Class({
        inherits: Array,
        init: function(items) {
            var self = this;
            var toString = {}.toString;
            items = items || [];

            function addItem(item) {
                self.push(item);
            }

            function addItems(items1) {
                for (var i = 0; i < items1.length; ++i) {
                    addItem(items1[i]);
                }
            }

            if (toString.call(items) === '[object Array]') {
                addItems(items);
            } else if (typeof items === 'function') {
                addItems(items(self));
            } else if (typeof items === 'object') {
                for (var key in items) {
                    addItem(items[key]);
                }
            }
        }
    });

    /* private */


    return Collection;

}));
