/* jshint newcap: false */ ;
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
        root.Hash = factory(null, root.Class);
    }
}(this, function(require, Class) {
    'use strict';

    if (require) {
        Class = require('../dist/Class.min.js');
    }

    var Hash = new Class({
        inherits: Object,
        init: function constructor(obj) {
            var self = this;
            obj = obj || {};
            constructor.super.call(self, obj);
            self.merge(obj);
        },
        's': {
            value: function() {
                return this.toString();
            }
        },
        'n': {
            value: function(fixedDecimals) {
                return !!fixedDecimals ? parseFloat(this.toFixed(fixedDecimals)) : this.valueOf();
            }
        },
        has: {
            value: function(key) {
                return this[key] !== undefined;
            }
        },
        each: {
            value: function(fn, context) {
                var self = this;
                for (var key in self) {
                    fn.call(context, self[key], key, self);
                }
                return self;
            }
        },
        keyOf: {
            value: function(item) {
                for (var key in this) {
                    if (this[key] === item) {
                        return key;
                    }
                }
                return null;
            }
        },
        hasValue: {
            value: function(value) {
                for (var key in this) {
                    if (this[key] === value) {
                        return true;
                    }
                }
                return false;
            }
        },
        merge: {
            value: function(obj) {
                obj = obj || {};
                for (var key in obj) {
                    this[key] = obj[key];
                }
                return this;
            }
        },
        combine: {
            value: function(obj) {
                obj = obj || {};
                for (var key in obj) {
                    if (!this.hasOwnProperty(key)) {
                        this[key] = obj[key];
                    }
                }
                return this;
            }
        },
        erase: {
            value: function(key) {
                if (!this.hasOwnProperty(key)) {
                    delete this[key];
                    return true;
                }
                return false;
            }
        },
        get: {
            value: function(key, defaultValue) {
                if (!this.hasOwnProperty(key)) {
                    return this[key];
                }
                return defaultValue || null;
            }
        },
        set: {
            value: function(key, value) {
                this[key] = value;
                return this;
            }
        },
        empty: {
            value: function() {
                for (var key in this) {
                    delete this[key];
                }
                return this;
            }
        },
        include: {
            value: function(key, value) {
                if (!this.hasOwnProperty(key)) {
                    this[key] = value;
                }
                return this;
            }
        },
        map: {
            value: function(fn, context) {
                var ret = {};
                for (var key in this) {
                    ret[key] = fn.call(context, this[key], key, this);
                }
                return ret;
            }
        },
        filter: {
            value: function(fn, context) {
                var ret = {};
                for (var key in this) {
                    if (fn.call(context, this[key], key, this) === true) {
                        ret[key] = this[key];
                    }
                }
                return ret;
            }
        },
        any: {
            value: function(fn, context) {
                for (var key in this) {
                    if (fn.call(context, this[key], key, this) === true) {
                        return true;
                    }
                }
                return false;
            }
        },
        toObject: {
            value: function() {
                var ret = {};
                for (var key in this) {
                    ret[key] = this[key];
                }
                return ret;
            }
        },
        getKeys: {
            value: function() {
                return Object.keys(this);
            }
        },
        getValues: {
            value: function() {
                return Object.values(this);
            }
        },
        getLength: {
            value: function() {
                var ret = 0;
                for (var key in this) {
                    ++ret;
                }
                return ret;
            }
        },
        toQueryString: {
            value: function() {
                var object = this;
                var string = [];
                var encode = function(str) {
                    return encodeURIComponent(str).replace(/%20/g, '+');
                };
                for (var parameter in object) {
                    if (object.hasOwnProperty(parameter)) {
                        if ({}.toString.call(object[parameter]) === "[object Array]") {
                            object[parameter].forEach(function(value) {
                                string.push(encode(parameter) + "=" + encode(value));
                            });
                        } else {
                            string.push(encode(parameter) + "=" + encode(object[parameter]));
                        }
                    }
                }
                return string.join("&");
            }
        },
        fromQueryString: {
            value: function(queryString) {
                queryString = queryString || '';
                var result = this;
                queryString.replace(
                    new RegExp("([^?=&]+)(=([^&]*))?", "g"),
                    function($0, $1, $2, $3) {
                        if (result[$1]) {
                            if ({}.toString.call(result[$1]) === "[object Array]") {
                                result[$1].push($3);
                            } else {
                                result[$1] = [result[$1], $3];
                            }
                        } else {
                            result[$1] = $3;
                        }
                    }
                );
                return result;
            }
        }
    });

    /* private */


    return Hash;

}));
