/* jshint newcap: false */
(function(root, factory) {
    'use strict';

    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['../dist/Class.min', '../dist/Float.min'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(
            require('../lib/Class'),
            require('../lib/Float')
        );
    } else {
        // Browser globals (root is window)
        root.Integer = factory(root.Class, root.Float);
    }
}(global, function(Class, Float) {
    'use strict';

    var Integer = new Class({
        inherits: Float,
        init: function constructor(value) {
            var self = this;
            constructor.super.call(self, parseInt(value.toString()));
            console.log(this);
        },
        'n': function() {
            return this.valueOf();
        }
    });

    /* private */


    return Integer;

}));
