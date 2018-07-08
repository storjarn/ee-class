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
        root.ReferenceObject = factory(root.Class);
    }
}(global, function(Class) {
    'use strict';

    var ReferenceObject = new Class({
        init: function(name, props) {
            for (var key in props) {
                this[key] = props[key];
            }
            this.Name = name;
        },
        toData: function() {
            var ret = {};
            for (var key in this) {
                if (this.hasOwnProperty(key)) {
                    ret[key] = this[key];
                }
            }
            return ret;
        },
        valueOf: function() {
            return this.toData();
        },
        toJSON: function() {
            return this.toData();
        }
    });

    /* private */


    return ReferenceObject;

}));
