/* jshint newcap: false */
;(function (root, factory) {
    'use strict';

    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['require'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(
            null,
            require('../dist/Class.min'),
            require('../dist/Float.min')
        );
    } else {
        // Browser globals (root is window)
        root.Integer = factory(null, root.Class, root.Float);
    }
}(this, function (require, Class, Float) {
    'use strict';

    if (require) {
        Class = require('../dist/Class.min.js');
        Float = require('../dist/Float.min.js');
    }

    var Integer = new Class({
        inherits: Float,
        init: function constructor(value){
            var self = this;
            constructor.super.call(self, parseInt(value.toString()));
        },
        'n': function() {
            return this.valueOf();
        }
    });

    /* private */


    return Integer;

}));
