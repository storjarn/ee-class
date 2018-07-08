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
        module.exports = factory(require('../lib/Class'));
    } else {
        // Browser globals (root is window)
        root.Enum = factory(root.Class);
    }
}(global, function(Class) {
    'use strict';

    /* @private */


    /* @public */
    /* jshint latedef:false */
    var Enum = new Class({
        init: function(values, name) {
            var self = this;
            values = values || {};
            name = name || ['Enum Instance' + new Date().getTime()];

            Class.define(Object.getPrototypeOf(self), 'Name', Class(name));
            Class.define(Object.getPrototypeOf(self), 'TypeName', Class("Enum"));
            Class.define(Object.getPrototypeOf(self), 'Type', Class(Enum));

            Object.keys(values).forEach(function(key) {
                Class.define(Object.getPrototypeOf(self), key, Class(values[key]).Enumerable());
            });

            Object.freeze(self);

            return self;
        },

        toString: Class(function() {
            return [this.TypeName, this.Name].join('::');
        })
    });

    return Enum;

}));
