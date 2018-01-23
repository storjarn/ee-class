# <a name="top"> </a>Class.js

A fork of [eventEmitter](https://github.com/eventEmitter/ee-class)'s fast prototype based Javascript Class implementation.

[![Build Status](https://jenkins.bf.lab.charter.com/buildStatus/icon?job=NodePackages/Class.js)](https://jenkins.bf.lab.charter.com/job/NodePackages/job/Class.js/)

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/1200px-Npm-logo.svg.png" width="40" title="NPM-enabled" border="0" />
<img src="https://gruntjs.com/img/og.png" width="32" title="Grunt-enabled" border="0" />

##### Features:

&#10003; modern `browser` support

&#10003; `Node.js` support

&#10003; [ES6](https://github.com/lukehoban/es6features) compatible-ish

- &#10003; inheritance (`native` included)
- &#10003; parent method calls (overridden methods)
- &#10003; read-only/constant + non-enumerable properties (property descriptors)
- &#10003; `abstract` classing

&#10003; static utilities

&#10003; Namespacing (`Namespace`)

&#10003; Generic Model (`ReferenceObject`)

---

## Installation

    npm set registry http://dnvrco-vm-coed0018.conops.timewarnercable.com:4873
    npm install --save rig-class.js

## Testing

### Run the tests for CI

```
grunt ci  # Jenkinsfile runs this one
```

### Run the tests in the terminal and in the browser

```
grunt test
```

## Tools

```
grunt beautify

grunt todos
```

---

* [Class](#class)
	* [Constructor](#classconstructor)
	* [Class definition](#classdef)
	* [functions / overriding / (super) calls](#classfunctions)
	* [Abstract classes](#abstractclasses)
	* [Property Descriptors](#classpropertydescriptors)
	* [Inheritance](#classinheritance)
	* [Static Helpers](#classstaticmethods)
* [EventEmitter](#eventEmitter)
* [Namespace](#namespace)


# <a name="class"> </a>Class

## API

The Class implementation is built on top of javascript [prototype-based inheritance](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain) and [ECMAScript 5 property descriptors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)..........

> Although these constructs look like those familiar to developers of class-based languages, they are not the same. JavaScript remains prototype-based.

<a href="#top">Top</a>

### <a name="classconstructor"> </a>Constructor

Classes can be created using the `Class` function. The function expects exactly one argument, the `class definition`.

    var MyClass = new Class([classDefinition]);

<a href="#top">Top</a>

### <a name="classdef"> </a>Class Definition

#### `inherits` property

Objects & Functions on this property are handled as the prototype for the prototype of the class you are creating.

```
    var MyClass = new Class({
        inherits: Array
    });

    // { // MyClass instance
    //      __proto__: { // MyClass protoype (where your items from the classdefinition are placed)
    //         __proto__: { // the Array prototype
    //              __proto__: {} // the prototype of the array prototype (`[Object object]`)
    //          }
    //      }
    // }
```

<a href="#top">Top</a>

#### <a name="classfunctions"> </a>`function type` properties / overridden methods / parent method calls

Functions will be placed on the Class's prototype object, they are by default not configurable,
not writeable and enumerable (except for properties starting with an `_`. If the property has
the name `init` it is treated as the classes constructor.

```
    var MyClass = new Class({
    	inherits: Date,
        init: function constructor(){
            console.log('im executed when the class is instantiated');
            constructor.super.apply(this, arguments);
        },
        helloworld: function helloworld() {
        	console.dir(this); // {init: [Function], helloworld: [Function]} -> the init and helloworld functions are placed on the instances
                           // prototype
    		console.log(this.init); // { [Function: init] super: [Function] }

    		console.dir(helloworld.super); // null (no parent method, no super....)

    		console.log(this instanceof MyClass); // true
    		console.log(this instanceof Object); // true
    		console.log(this instanceof Date); // false
        }
    });

    var instance = new MyClass(); // im executed when the class is instantiated

    instance.helloworld();

```

Note the `super` properties on the `init` (scope-named `constructor`) and `helloworld` functions: either can be used to call the parent class method of the same name.  In this case, it calls the internal constructor of `Date`.  An Error will be thrown if a parent class does not have that method, i.e. `super` is null.

```
    var MyClass2 = new Class({
    	inherits: MyClass,  /* from above */
        init: function constructor(){
            constructor.super.apply(this, arguments);  //im executed when the class is instantiated
            this.helloworld();
        },
        helloworld: function helloworld() {
        	helloworld.super.apply(this, arguments);  // Call parent method, NOW with any arguments!
        	console.log("Hey!!!");
        },
        test: true
    });

    var instance = new MyClass2();
    /*
    	im executed when the class is instantiated
    	{init: [Function], helloworld: [Function], test: true}
    	...
    	Hey!!!
    */

```

<a href="#top">Top</a>

#### <a name="abstractclasses"> </a>`abstract` Classes

Classes can be declared `abstract` by using the class definition property of `isAbstract : true`.  This allows the Class to still be inherited but will throw an exception if instantiated directly using the `new` keyword.

```
    var MyClass = new Class({
        isAbstract: true,
        init: function(){
            console.log('i'll never get executed when the class is instantiated when using the new keyword directly, but will when called from another Class\' constructor by inheritance.');
        }
    });

    var MyChildClass = new Class({
        inherits: MyClass,
        init: function constructor(){
            constructor.super.call(this);
            console.log('i'm executed too');
        }
    });

    var instance = new MyClass(); // ERROR!!!
    var instance2 = new MyChildClass(); // i'll never get executed when the class is instantiated when using the new keyword directly, but will when called from another Class\' constructor by inheritance.  i'm executed too
```

<a href="#top">Top</a>

#### <a name="classpropertydescriptors"> </a>Property Descriptors

The Class definition may contain property descriptor objects. You are able to create
configure each of the properties exactly as you like. You can create getters and setters
and configure the configurability, the writability and the enumerability.

```
    var Person = new Class({
        init: function(options){
            if (options && options.name !== undefined)  this.name = options.name;
            if (options && options.age !== undefined)   this.age = options.age;
        }

        // the private storage for the age value
        , _storage: {
            value: {
                age: null
            }
        }

        , name: '' // enumerable, writable, not configurable

        , age: {
              get: function(){ return this._storage.age; }
            , set: function(value) {
                if (value < 0) throw new Error('Please provide an age >= 0!');
                else if (value > 150) throw new Error('You are too old, sorry!');
                else this._storage.age = value;
            }
            , enumerable: true
            /* , configurable: false */ // defaults to false
            /* , writable: false */ // defaults to false
        }

        , sayHelloTo: {
            value: function(name){
                console.log('Hello %s, my name is %s and im %s years old :)'
                    , name, this.name, this.age);
            }
        }
    });

    var instance = new Person({name: 'Michael', age: 30});
    instance.sayHelloTo('Tobias'); // Hello Tobias, my name is Michael and im 30
                                   // years old :)

    // Object keys hets all enumerable keys from the instance but not its
    // prototypes
    console.log(Object.keys(instance)); // [ 'name' ]

    // Class.keys() gets all enumerable keys from the instance and all its
    // prototypes
    // Class.keys -> for (var key in instance) keys.push(key);
    console.log(Class.keys(instance)); // [ 'name', 'init', 'age' ]


    // internal structure of the Person instance
    {
          name: 'Michael'   // this was set from inside the constructor function
        , __proto__: {      // the Person prototype
              init: function(){ ... }
            , _storage: {
                age: 30     // set by the constructor, ATTENTION: this is shared
                            // across all `Person` instances
            }
            , name: ''      // deafult wont be changed anytime
            , age: [Getter / Setter]
            , sayHelloTo: function(){ ... }
            , __proto__: {} // default prototype
        }
    }
```


The example above has one problem. All instances of the `Person` class are going to share the `_storage` property.
This is because it's a property which will not be set on the instance itself but only once on the prototype.
A Better solution would be the follwoing:

```
     var Person = new Class({
        init: function(options){
            Object.defineProperty(this, '_storage', {value: {}});
            Class.define(this, '_storage', {value: {}}); // alternative syntax
            Class.define(this, '_storage', Class({})) // alternative syntax

           ....
        }

        ...
    });
```

<a href="#top">Top</a>

### <a name="classinheritance"> </a>Inheritance

Any class may inherit from any other class or built-in types.

```
    var LifeForm = new Class({
        init: function(isAlive) {
            Class.define(this, 'isAlive', Class(isAlive).Enumerable().Writable());
        }

        , isAlive: Class(false).Enumerable().Writable()
        , die: function(){}
    });


    var Person = new Class({
        inherits: LifeForm

        , talk: function(){
            console.log('Hi my name is %s, i\'m '+(this.isAlive ? 'alive :)'
                : 'dead :('), this.name);
        }

        , sing: function() {}
    });


    var Boy = new Class({
        inherits: Person

        , init: function constructor(name, alive) {
            // you need to give the function a name in order to be able to call
            // its super. you must `call` or `apply` the super function to give
            // it the correct context
            constructor.super.call(this, alive);

            this.name = Class.define(this, 'name', Class(name).Enumerable());
        }


        , run: function(){}
        , jump: function(){}
    });


    var dylan = new Boy('Dylan', true);
    dylan.talk(); // Hi my name is Dylan, i'm alive :)


    // internal structure of the `dylan` Boy instanc
    {
          isAlive: true            // defined by the LifeForm Class constructor
        , name: 'Dylan'                     // defined by the Boy constructor
        , __proto__: {                      // Boy prototype
            init: function init(){ ... }
            , __proto__: {                  // Person prototype
                __proto__: {                // LifeForm prototype
                    isAlive: false     // property defined on the LifeForm class
                    , init: function(){ ... }
                    , __proto__: {}         // defualt object prototype
                }
            }
        }
    }



    console.log(dylan instanceof Boy);       // true
    console.log(dylan instanceof Person);    // true
    console.log(dylan instanceof LifeForm);  // true
    console.log(dylan instanceof Object);    // true
    console.log(dylan instanceof Array);     // false

```

<a href="#top">Top</a>

### <a name="classstaticmethods"> </a>Static Methods

#### Class()

if the Class constructor is called without the new Keyword it doesnt create an instance of the class, it does instead return
a class property definition which can be used by the Class.define or Object.defineProperty method.

```
    Class(234) // {value: 234}
    Class(true).enumerable() // {value: true, enumerable: true}
    Class('yeah').writable() // {value: 'yeah', writable: true}
    Class(new Error('nope')).configurable() // {value: Error, configurable: true}
    Class(234).enumerable().writable().configurable() // {value: 234, enumerable: true, writable: true, configurable: true}
```

#### Class.define()

This can be used oin playe of the Object.defineProperty method.

```
    Class.define({}, 'property_name', {value:3});
```

#### Class.proto()

Returns the prototype of a class instance

```
    var prototype = Class.proto(instance);
```

#### Class.keys()

Returns all enumerable properties of a class instance and of all its prototypes. Object.keys does the same for only the class instance.

```
    var keys = Class.keys(instance);
```

#### Class.implement()

Implements methods and properties from a classinstance on another object.

```
    var myObject = {};

    var MyClass = new Class({
        test: function(){

        }
    });

    Class.implement(new MyClass(), myObject);

    console.log(myObject); // {test: function(){}}
```

#### Class.inspect()

Inspects the internal structure of the class, returns it. Is helpful for debugging.

```
    // inspecting the class instance created in the inheritnace example above
    var description = Class.inspect(dylan);

    log(description);

    // { isAlive: true,
    //  name: 'Dylan',
    //  super:
    //   { init: [Function],
    //     jump: [Function],
    //     run: [Function],
    //     super:
    //      { sing: [Function],
    //        talk: [Function],
    //        super:
    //         { die: [Function],
    //           init: [Function],
    //           isAlive: false,
    //           super:
    //            { super:
    //               { __defineGetter__: [Function],
    //                 __defineSetter__: [Function],
    //                 __lookupGetter__: [Function],
    //                 __lookupSetter__: [Function],
    //                 constructor: [Function],
    //                 hasOwnProperty: [Function],
    //                 isPrototypeOf: [Function],
    //                 propertyIsEnumerable: [Function],
    //                 toLocaleString: [Function],
    //                 toString: [Function],
    //                 valueOf: [Function] } } } } } }
```

<a href="#top">Top</a>

# <a name="eventEmitter"> </a>EventEmitter

## API

```
    var EventEmitter = require( "ee-event-emitter" );
    var eventEmitter = new EventEmitter();

    // attach listener
    eventEmitter.on( "eventName", cb );

    // attach listsner which is called once
    eventEmitter.once( "eventName", cb );

    // remove all listeners for all events
    eventEmitter.off();

    // remove listeners for specific event
    eventEmitter.off( "eventName" );

    // remove a single listener
    eventEmitter.off( "eventName", listener );

    // emit an event
    eventEmitter.emit( "eventName", arg, arg, .... );

    // get all listeners
    eventEmitter.listener();

    // get lsisteners for a specific event
    eventEmitter.listsner( "eventName" );

    // event which is emitted when an event listener is added
    eventEmitter.on( "listener", function( eventName, listener ){} );

    // event which is emitted when an event listener is removed
    eventEmitter.on( "removeListener", function( eventName, listener ){} );
```

## usage

```
    var   Class             = require( "rig-class.js" )
        , EventEmitter      = require( "rig-class.js/dist/EventEmitter.min.js" );


    var Human = new Class( {
        inherits: EventEmitter
        , name: ""
        , age: 29

        , init: function( options ){
            this.name = options.name;
        }


        , sayHello: function( to ){
            this.emit( "startHello" );
            console.log( "Hi %s, my name is %s, i'm %s years old.", to, this.name, this.age );
            this.emit( "endHello" );
        }
    } );



    var Boy = new Class( {
        inherits: Human
        , age: 12
    } );


    var fabian = new Boy( {
        name: "Fabian"
        , on: {
              startHello: function(){ console.log( "starting console output:" ); }
            , endHello: function(){ console.log( "finished console output!" ); }
        }
    } );


    fabian.sayHello( "michael" );  // starting console output:
                        // Hi my name is Fabian and i'm 12 years old.
                        // finished console output!
```

<a href="#top">Top</a>

# <a name="namespace"> </a>Namespace

## API

### Functions

#### Namespace#addNamespace(namespace:Namespace)

adds and returns namespace:Namespace

#### Namespace#addClass([className:String], klass:Class, [namespaceProperties:Object])

adds and returns klass:Class with new Namespace-based properties.  Requires a *className* or klass.TypeName:String

#### Namespace#getFullyQualifiedName() *(Also for **Class**)*

returns fully qualified namespace name:String

### Properties

#### Namespace#Name

returns the namespace name:String

#### Namespace#ParentNamespace *(Also for **Class**)*

returns fully qualified namespace name:String

#### Namespace#Type *(Also for **Class**)*

returns the Class type.  For namespaces in all cases, it's *Namespace* constructor.  For classes, it's the specific class constructor

#### Namespace#TypeName</strong> *(Also for **Class**)*

returns the instance type's name:String


## usage

```
    var Namespace = require( "rig-class.js/dist/Namespace.min.js" );
    var namespace = new Namespace("Test", null, {hello: function(){ console.log("I'm a namespace!")}});
    console.log(namespace.hello());  // "I'm a namespace!"
    console.log(namespace.Name);  // "Test"

    // add child namespace
    var ChildNamespace = namespace.addNamespace(new Namespace("ChildNamespace"));
    ChildNamespace.foo = true;

    // add class
    var TestClass = ChildNamespace.addClass("TestClass", new Class({test:true}));

    // access class
    var myClassInstance = new ChildNamespace.TestClass();
    console.log(myClassInstance.test);  // true
    console.log(myClassInstance.Type === TestClass === ChildNamespace.TestClass);  // true

    // access child namespace
    console.log(namespace.ChildNamespace.foo);  // true

    // access parents
    console.log(myClassInstance.Type.ParentNamespace.getFullyQualifiedName());  // 'Test.ChildNamespace'
    console.log(myClassInstance.Type.getFullyQualifiedName());  // 'Test.ChildNamespace.TestClass'
```

<a href="#top">Top</a>

--------------------
