/* globals Class, EventEmitter, assert */
/* jshint newcap: false */
(function(root, factory) {
    'use strict';
    var assert;

    if (typeof define === 'function' && define.amd) {
        define(['../dist/Class.min', '../dist/EventEmitter.min', '../dist/Namespace.min'], factory);
    } else if (typeof exports === 'object') {
        (function() {
            var Class = require('../dist/Class.min');
            var EventEmitter = require('../dist/EventEmitter.min');
            var Namespace = require('../dist/Namespace.min');
            assert = require('assert');

            factory(Class, EventEmitter, Namespace, assert);
        })();
    } else {
        factory(Class, EventEmitter, Namespace, assert);
    }
}(this, function(Class, EventEmitter, Namespace, assert) {
    'use strict';

    var instance = null;
    var instance2 = null;

    assert = !!assert ? assert : false;

    describe('[Classdefinition] A Class', function() {
        it('can have enumerable properties of all types', function() {

            var properties = {
                number: 5,
                string: 'not empty',
                bool: true,
                nil: null,
                regexp: /nope/gi,
                date: new Date(0),
                err: new Error('fail'),
                // , buf           : new Buffer('buffering')
                fn: function() {
                    return 42;
                },
                obj: {
                    im: 'notEmpty'
                },
                arr: [1, 3, 3, 7]
            };

            var TestClass = new Class(properties),
                instance = new TestClass();

            Object.keys(properties).forEach(function(name) {
                if (assert) {
                    assert.equal(instance[name], properties[name]);
                } else {
                    expect(instance[name]).toBe(properties[name]);
                }
            });
        });


        it('should be able to return its __proto__', function() {
            var Test = new Class({
                me: 'michael'
            });
            instance = new Test();

            if (assert) {
                assert.deepEqual(Class.proto(instance), {
                    me: 'michael'
                });
            } else {
                expect(JSON.stringify(Class.proto(instance))).toBe('{"me":"michael"}');
            }
        });


        it('should be able to accept property definitions', function() {
            var Test = new Class({
                me: {
                    value: 'michael'
                }
            });
            instance = new Test();

            if (assert) {
                assert.deepEqual(instance.me, 'michael');
            } else {
                expect(instance.me).toBe("michael");
            }
        });


        it('should respect the configuration of property definers', function() {
            var Test = new Class({
                me: {
                    value: 'michael'
                }
            });
            var Test2 = new Class({
                me: {
                    value: 'michael',
                    enumerable: true
                }
            });
            instance = new Test();
            instance2 = new Test2();

            if (assert) {
                assert.deepEqual(Class.keys(instance), []);
                assert.deepEqual(Class.keys(instance2), ['me']);
            } else {
                expect(JSON.stringify(Class.keys(instance))).toBe('[]');
                expect(JSON.stringify(Class.keys(instance2))).toBe('["me"]');
            }
        });


        it('should execute the constructor function', function() {
            var Test = new Class({
                init: function() {
                    this.name = 'michael';
                }
            });
            instance = new Test();

            if (assert) {
                assert.deepEqual(instance, {
                    name: 'michael'
                });
            } else {
                expect(JSON.stringify(instance)).toBe('{"name":"michael"}');
            }
        });


        it('should accept generated property definers', function() {
            var Test, instance;

            Test = new Class({
                default: Class('default'),
                enumerable: Class('enumerable').Enumerable(),
                writable: Class('writable').Writable(),
                configurable: Class('configurable').Configurable(),
                all: Class('all').Configurable().Enumerable().Writable()
            });

            instance = new Test();

            if (assert) {
                assert.deepEqual(instance, {});
                assert.deepEqual(Class.keys(instance), ['enumerable', 'all']);
            } else {
                expect(JSON.stringify(instance)).toBe('{}');
                expect(JSON.stringify(Class.keys(instance))).toBe('["enumerable","all"]');
            }
        });



        it('should set the correct scope in getters / setters', function() {
            var Test, instance;

            Test = new Class({
                init: function() {
                    Class.define(this, "test", {
                        get: function() {
                            return true;
                        }
                    });
                },
                age: 16,
                length: {
                    get: function() {
                        return this.age;
                    }
                }
            });

            instance = new Test();
            if (assert) {
                assert.equal(16, instance.length);
                assert.equal(true, instance.test);
            } else {
                expect(16).toBe(instance.length);
                expect(true).toBe(instance.test);
            }
        });
    });


    describe('[Inheritance] A Class', function() {
        it('should be able to inherit from another class', function() {
            var Test = new Class({
                init: function() {
                    return 2;
                }
            });
            var Test2 = new Class({
                inherits: Test,
                init: function init() {
                    this.number = init.super.call(this);
                }
            });
            instance = new Test2();

            if (assert) {
                assert.equal(instance.number, 2);
            } else {
                expect(2).toBe(instance.number);
            }
        });


        it('should be able to inherit from a class chain', function() {
            var Test = new Class({
                init: function() {
                    return 2;
                }
            });
            var Test2 = new Class({
                inherits: Test,
                init: function init() {
                    return init.super.call(this);
                }
            });
            var Test3 = new Class({
                inherits: Test2,
                init: function init() {
                    this.number = init.super.call(this);
                }
            });
            instance = new Test3();

            if (assert) {
                assert.equal(instance.number, 2);
            } else {
                expect(2).toBe(instance.number);
            }
        });


        it('should be able to inherit from a class chain and skip prototypes when calling super methods', function() {
            var Test = new Class({
                init: function() {
                    return 2;
                }
            });
            var Test2 = new Class({
                inherits: Test
            });
            var Test3 = new Class({
                inherits: Test2,
                init: function init() {
                    this.number = init.super.call(this);
                }
            });
            instance = new Test3();

            if (assert) {
                assert.equal(instance.number, 2);
            } else {
                expect(2).toBe(instance.number);
            }
        });


        it('should be able to inherit from a native JS type', function() {
            var Test = new Class({
                inherits: Array,
                toJSON: Class(function() {
                    return Array.prototype.slice.call(this);
                }),
                count: {
                    get: function() {
                        return this.length;
                    }
                }
            });
            instance = new Test();

            instance.push('hi');
            instance.push('my');
            instance.push('name');
            instance.push('is');
            instance.push('michael');

            if (assert) {
                assert.equal(instance.count, 5);
                assert.deepEqual(instance.toJSON(), ['hi', 'my', 'name', 'is', 'michael']);
            } else {
                expect(5).toBe(instance.count);
                expect(JSON.stringify(instance.toJSON())).toBe('["hi","my","name","is","michael"]');
            }
        });


        it('should be an instance of its constructor and its prototype constructors', function() {
            var Test = new Class({
                inherits: Array,
                toJSON: Class(function() {
                    return Array.prototype.slice.call(this);
                }),
                count: {
                    get: function() {
                        return this.length;
                    }
                }
            });
            instance = new Test();

            if (assert) {
                assert.ok(instance instanceof Test);
                assert.ok(instance instanceof Array);
                assert.ok(instance instanceof Object);
                assert.ok(!(instance instanceof Date));
            } else {
                expect(instance instanceof Test).toBeTruthy();
                expect(instance instanceof Array).toBeTruthy();
                expect(instance instanceof Object).toBeTruthy();
                expect(instance instanceof Date).toBeFalsy();
            }
        });
    });


    describe('[Contructor]', function() {
        it('A class should be able to return an object as its instance', function() {
            var Test, instance;

            Test = new Class({
                init: function() {
                    return {
                        id: 'obj'
                    };
                }
            });

            instance = new Test();

            if (assert) {
                assert.equal(instance.id, 'obj');
            } else {
                expect('obj').toBe(instance.id);
            }
        });
    });


    describe('[Generic Tests]', function() {
        it('A Class should throw an error when instantiated without the new keyword', function() {
            var a = new Class({
                init: function() {
                    return 2;
                }
            });

            if (assert) {
                assert.throws(
                    function() {
                        a();
                    }
                );
            } else {
                expect(function() {
                    a();
                }).toThrow();
            }
        });

        it('An abstract Class should throw an error when instantiated with the new keyword', function() {
            var a = new Class({
                init: function() {
                    return 2;
                },
                isAbstract: true
            });

            if (assert) {
                assert.throws(
                    function() {
                        a();
                    }
                );
            } else {
                expect(function() {
                    a();
                }).toThrow();
            }
        });


        it('#1 - properties', function() {
            var Person = new Class({
                init: function(options) {
                    if (options && options.name !== undefined) {
                        this.name = options.name;
                    }
                    if (options && options.age !== undefined) {
                        this.age = options.age;
                    }
                },

                // the private storage for the age value
                _storage: {
                    value: {
                        age: null
                    }
                },

                name: '', // enumerable, writable, not configurable

                age: {
                    get: function() {
                        return this._storage.age;
                    },
                    set: function(value) {
                        if (value < 0) {
                            throw new Error('Please provide an age >= 0!');
                        } else if (value > 150) {
                            throw new Error('You are too old to be processed by this system, sorry!');
                        } else {
                            this._storage.age = value;
                        }
                    },
                    enumerable: true
                    /* , configurable: false */ // defaults to false
                    /* , writable: false */ // defaults to false
                },

                sayHelloTo: {
                    value: function(name) {
                        console.log('Hello %s, my name is %s and im %s years old :)', name, this.name, this.age);
                    }
                }
            });

            instance = new Person({
                name: 'Michael',
                age: 30
            });

            // Object keys hets all enumerable keys from the instance but not its prototypes
            if (assert) {
                assert.equal(Object.keys(instance).length, 1);
                assert.equal(Class.keys(instance).length, 3);
            } else {
                expect(Object.keys(instance).length).toBe(1);
                expect(Class.keys(instance).length).toBe(3);
            }
        });


        it('#2 - inheritance', function() {
            var LifeForm = new Class({
                init: function(isAlive) {
                    Class.define(this, 'isAlive', Class(isAlive).Enumerable().Writable());
                },
                isAlive: Class(false).Enumerable().Writable()
            });


            var Person = new Class({
                inherits: LifeForm,
                talk: function() {
                    console.log('Hi my name is %s, i\'m ' + (this.isAlive ? 'alive :)' : 'dead :('), this.name);
                }
            });


            var Boy = new Class({
                inherits: Person,
                init: function constructor(name, alive) {
                    // you need to give the function a name in order to be able to call its super
                    // you must «call» or «apply» the super function to give it the correct context
                    constructor.super.call(this, alive);

                    Class.define(this, 'name', Class(name).Enumerable().Writable());
                }
            });


            instance = new Boy('Dylan', true);

            if (assert) {
                assert.equal(instance.isAlive, true);
                assert.equal(instance.name, 'Dylan');

                assert.ok(instance instanceof Boy);
                assert.ok(instance instanceof Person);
                assert.ok(instance instanceof LifeForm);
                assert.ok(instance instanceof Object);
                assert.ok(!(instance instanceof Array));
            } else {
                expect(instance.isAlive).toBe(true);
                expect(instance.name).toBe('Dylan');

                expect(instance instanceof Boy).toBeTruthy();
                expect(instance instanceof Person).toBeTruthy();
                expect(instance instanceof LifeForm).toBeTruthy();
                expect(instance instanceof Object).toBeTruthy();
                expect(instance instanceof Array).toBeFalsy();
            }
        });
    });


    describe('[Static methods]', function() {
        it('The static «Class.proto» method should return the class proto', function() {
            var Person = new Class({
                init: function(options) {
                    if (options && options.name !== undefined) {
                        this.name = options.name;
                    }
                    if (options && options.age !== undefined) {
                        this.age = options.age;
                    }
                },

                // the private storage for the age value
                _storage: {
                    value: {
                        age: null
                    }
                },

                name: '', // enumerable, writable, not configurable

                age: {
                    get: function() {
                        return this._storage.age;
                    },
                    set: function(value) {
                        if (value < 0) {
                            throw new Error('Please provide an age >= 0!');
                        } else if (value > 150) {
                            throw new Error('You are too old to be processed by this system, sorry!');
                        } else {
                            this._storage.age = value;
                        }
                    },
                    enumerable: true
                    /* , configurable: false */ // defaults to false
                    /* , writable: false */ // defaults to false
                },

                sayHelloTo: {
                    value: function(name) {
                        console.log('Hello %s, my name is %s and im %s years old :)', name, this.name, this.age);
                    }
                }
            });


            instance = new Person({
                name: 'Michael',
                age: 30
            });
            if (assert) {
                assert.equal('{"name":"","age":30}', JSON.stringify(Class.proto(instance)));
            } else {
                expect('{"name":"","age":30}').toBe(JSON.stringify(Class.proto(instance)));
            }
        });



        it('Describe the classes methods', function() {
            var LifeForm = new Class({
                init: function(isAlive) {
                    Class.define(this, 'isAlive', Class(isAlive).Enumerable().Writable());
                },
                isAlive: Class(false).Enumerable().Writable(),
                die: function() {}
            });


            var Person = new Class({
                inherits: LifeForm,
                talk: function() {
                    console.log('Hi my name is %s, i\'m ' + (this.isAlive ? 'alive :)' : 'dead :('), this.name);
                },
                sing: function() {}
            });


            var Boy = new Class({
                inherits: Person,
                init: function constructor(name, alive) {
                    // you need to give the function a name in order to be able to call its super
                    // you must «call» or «apply» the super function to give it the correct context
                    constructor.super.call(this, alive);

                    this.name = Class.define(this, 'name', Class(name).Enumerable().Writable());
                },
                run: function() {},
                jump: function() {}
            });

            instance = new Boy('Dylan', true);
            var description = Class.inspect(instance);

            if (assert) {
                assert.ok(description.super.jump);
                assert.ok(description.super.super.sing);
                assert.ok(description.super.super.super.die);
            } else {
                expect(description.super.jump).toBeDefined();
                expect(description.super.super.sing).toBeDefined();
                expect(description.super.super.super.die).toBeDefined();
            }

            /*console.log(JSON.stringify(util.inspect(Class.inspect(instance), {
                depth: 10
            })));*/
        });


        it('The static «Class.implement» method should implement a class on another object', function() {
            var Person = new Class({
                init: function(options) {
                    if (options && options.name !== undefined) {
                        this.name = options.name;
                    }
                    if (options && options.age !== undefined) {
                        this.age = options.age;
                    }
                },

                // the private storage for the age value
                _storage: {
                    value: {
                        age: null
                    }
                },

                name: '', // enumerable, writable, not configurable

                age: {
                    get: function() {
                        return this._storage.age;
                    },
                    set: function(value) {
                        if (value < 0) {
                            throw new Error('Please provide an age >= 0!');
                        } else if (value > 150) {
                            throw new Error('You are too old to be processed by this system, sorry!');
                        } else {
                            this._storage.age = value;
                        }
                    },
                    enumerable: true
                    /* , configurable: false */ // defaults to false
                    /* , writable: false */ // defaults to false
                },
                sayHelloTo: {
                    value: function(name) {
                        console.log('Hello %s, my name is %s and im %s years old :)', name, this.name, this.age);
                    }
                }
            });


            instance = new Person({
                name: 'Michael',
                age: 30
            });
            var obj = Class.implement(instance, {});

            if (assert) {
                assert.equal('{"name":"Michael","age":30}', JSON.stringify(obj));
            } else {
                expect('{"name":"Michael","age":30}').toBe(JSON.stringify(obj));
            }
        });
    });


    describe('[Namespace] A Namespace', function() {
        var namespace, namespace2, klass, klass2;

        beforeEach(function() {
            klass = new Class({
                test: true,
                id: 'obj'
            });
            klass2 = new Class({
                test: true
            });
            klass2.TypeName = 'Test2';
            namespace = new Namespace("TestNamespace", null, {
                id: 'obj'
            });
            namespace2 = new Namespace("TestNamespace2", null, {
                id: 'literal'
            });
        });

        afterEach(function() {
            klass = klass2 = namespace = namespace2 = null;
        });

        it('should be able to return an object as its instance', function() {
            if (assert) {
                assert.equal(new klass().id, 'obj');
            } else {
                expect('obj').toBe(new klass().id);
            }
        });

        it('should be able to get a namespace\'s type', function() {
            if (assert) {
                assert.deepEqual(namespace.Type, Namespace);
            } else {
                expect(namespace.Type).toBe(Namespace);
            }
        });

        it('should be able to add a class to itself', function() {
            namespace.addClass("Test", klass);

            if (assert) {
                assert.deepEqual(namespace.Test, klass);
                assert.deepEqual(klass.ParentNamespace, namespace);
                assert.equal(new namespace.Test().test, new klass().test);
            } else {
                expect(namespace.Test).toBe(klass);
                expect(namespace).toBe(klass.ParentNamespace);
                expect(new namespace.Test().test).toBe(new klass().test);
            }
        });

        it('should be able to get a class\' fully qualified name', function() {
            namespace.addClass("Test", klass);

            if (assert) {
                assert.equal(klass.getFullyQualifiedName(), 'TestNamespace.Test');
            } else {
                expect('TestNamespace.Test').toBe(klass.getFullyQualifiedName());
            }
        });

        it('should throw an error when adding a class without a classname', function() {
            if (assert) {
                assert.throws(
                    function() {
                        namespace.addClass(klass);
                    }
                );
            } else {
                expect(function() {
                    namespace.addClass(klass);
                }).toThrow();
            }
        });

        it('should throw an error when adding a class with a class name that is already a property on the namespace', function() {
            namespace.addClass("Test", klass);

            if (assert) {
                assert.throws(
                    function() {
                        namespace.addClass(klass);
                    }
                );
            } else {
                expect(function() {
                    namespace.addClass(klass);
                }).toThrow();
            }
        });

        it('should be able to get a class instance\'s type', function() {
            namespace.addClass("Test", klass);

            if (assert) {
                assert.equal(new klass().Type, klass);
            } else {
                expect(new klass().Type).toBe(klass);
            }
        });

        it('should be able to get a class instance\'s type name', function() {
            namespace.addClass("Test", klass);
            namespace.addClass(klass2);

            if (assert) {
                assert.equal(klass.TypeName, "Test");
                assert.equal(klass2.TypeName, "Test2");
            } else {
                expect(klass.TypeName).toBe("Test");
                expect(klass2.TypeName).toBe("Test2");
            }
        });

        it('should be able to add another namespace to itself', function() {
            namespace.addNamespace(namespace2);

            if (assert) {
                assert.deepEqual(namespace.TestNamespace2, namespace2);
                assert.deepEqual(namespace, namespace2.ParentNamespace);
            } else {
                expect(namespace.TestNamespace2).toBe(namespace2);
                expect(namespace2.ParentNamespace).toBe(namespace);
            }
        });

        it('should throw an error when adding a child namespace that is already on the parent namespace', function() {
            namespace.addNamespace(namespace2);

            if (assert) {
                assert.throws(
                    function() {
                        namespace.addNamespace(namespace2);
                    }
                );
            } else {
                expect(function() {
                    namespace.addNamespace(namespace2);
                }).toThrow();
            }
        });

        it('should be able to get a child namespace\'s fully qualified name', function() {
            namespace.addNamespace(namespace2);

            if (assert) {
                assert.equal(namespace2.getFullyQualifiedName(), 'TestNamespace.TestNamespace2');
            } else {
                expect('TestNamespace.TestNamespace2').toBe(namespace2.getFullyQualifiedName());
            }
        });
    });

}));
