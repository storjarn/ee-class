/* jshint newcap: false */
(function(root, factory) {
    'use strict';

    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['../dist/Class.min'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('../dist/Class.min'));
    } else {
        // Browser globals (root is window)
        root.Float = factory(root.Class);
    }
}(global, function(Class) {
    'use strict';

    var Float = new Class({
        inherits: Number,
        init: function constructor(value) {
            var self = this;
            value = value || 0;
            if (typeof value !== 'number') {
                value = parseFloat(value);
            }
            constructor.super.call(self, value);
        },
        's': {
            value: function() {
                return this.toString();
            }
        },
        'n': function(fixedDecimals) {
            return !!fixedDecimals ? parseFloat(this.toFixed(fixedDecimals)) : this.valueOf();
        }
    });

    /* private */


    return Float;

}));
