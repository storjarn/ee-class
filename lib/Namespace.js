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
        root.Namespace = factory(root.Class);
    }
}(this, function(Class) {
    'use strict';

    /* @private */

    var assertClass = function(klass, error) {
        if (!klass || (typeof klass !== "function")) {
            throw new Error(error || "You need to provide a valid class. ");
        }
    };

    /* @private */

    var assertNamespace = function(namespace, error) {
        if (!namespace || !(namespace instanceof Namespace)) {
            throw new Error(error || "You need to provide a valid namespace.");
        }
    };

    /* @private */

    var registerClass = function(nameSpace, className, klass) {
        assertNamespace(nameSpace);
        if (!className) {
            throw new Error("You need to provide a class name as the second argument");
        }
        assertClass(klass);

        Class.define(klass, 'ParentNamespace', Class(nameSpace).Enumerable());
        Class.define(nameSpace, className, Class(klass).Enumerable());

        if (!klass.hasOwnProperty('getFullyQualifiedName')) {
            Class.define(klass, 'getFullyQualifiedName', Class(function() {
                return nameSpace.getFullyQualifiedName() + "." + className;
            }));

            Class.define(klass, 'toString', Class(function() {
                return "[Class " + klass.getFullyQualifiedName() + "]";
            }));
        }

        if (!klass.hasOwnProperty('TypeName') || !klass.prototype.hasOwnProperty('Type')) {
            Class.define(klass, 'TypeName', Class(className));
            Class.define(klass.prototype, 'Type', Class(klass));
        }

        return klass;
    };

    /* @public */
    /* jshint latedef:false */
    var Namespace = new Class({
        init: function(name, parentNamespace, properties) {
            var self = this;
            properties = properties || {};

            Class.define(self, 'Name', Class(name));
            Class.define(self, 'TypeName', Class("Namespace"));
            Class.define(self, 'Type', Class(Namespace));

            Object.keys(properties).forEach(function(key) {
                Class.define(self, key, Class(properties[key]).Enumerable().Writable());
            });

            Class.define(self, 'addClass', Class(function(className, klass) {
                if (arguments.length === 1) {
                    klass = className;
                    className = klass.TypeName;
                }
                if (!className) {
                    throw new Error("Adding a class to a namespace requires a class name");
                }

                if (self[className]) {
                    throw new Error("This class ('" + className + "') already exists in this namespace ('" + self.getFullyQualifiedName() + "')");
                }

                registerClass(self, className, klass);

                return klass;
            }));

            Class.define(self, 'addNamespace', Class(function(namespace) {
                assertNamespace(namespace);
                if (self[namespace.Name]) {
                    throw new Error("The indicated namespace '" + namespace.Name + "' already exists in this namespace: '" + self.getFullyQualifiedName() + "'");
                }

                Class.define(self, namespace.Name, Class(namespace).Enumerable());
                Class.define(namespace, 'ParentNamespace', Class(self).Enumerable());

                return namespace;
            }));

            Class.define(self, 'getFullyQualifiedName', Class(function() {
                return (self.ParentNamespace ? self.ParentNamespace.getFullyQualifiedName() + "." : "") + name;
            }));

            Class.define(self, 'toString', Class(function() {
                return self.getFullyQualifiedName();
            }));

            if (parentNamespace) {
                Class.define(self, 'ParentNamespace', Class(parentNamespace).Enumerable());
                Class.define(parentNamespace, self.Name, Class(self).Enumerable());
            }

            return self;
        },
        ParentNamespace: null

    });

    return Namespace;

}));
