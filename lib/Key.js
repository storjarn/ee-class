/* jshint newcap: false */
;(function(root, factory) {
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
        root.Key = factory(null, root.Class);
    }
}(this, function(require, Class) {
    'use strict';

    if (require) {
        Class = require('../dist/Class.min.js');
    }

    var Key = new Class({
        inherits: String,
        init: function constructor(value) {
            var self = this;
            constructor.super.call(self, value);

            // self.substr(self.length);
            // self.concat(value || "");
        },
        's': {
            value: function() {
                return this.toString();
            }
        },
    });

    /* private */


    return Key;

}));
