require.config({
    shim: {

    },
    paths: {
        dist: '../dist',
        Class: '../dist/Class.min',
        EventEmitter: '../dist/EventEmitter.min',
        Namespace: '../dist/Namespace.min',
        'node-assert': 'bower_components/node-assert/assert',
        requirejs: 'bower_components/requirejs/require',
        jasmine: 'bower_components/jasmine/lib/jasmine-core',
        assert: 'bower_components/assert/index'
    },
    packages: [

    ]
});


require(
    [
        "../dist/Class.min", "../dist/EventEmitter.min", "../dist/Namespace.min"
    ],
    function(Class, EventEmitter, Namespace) {
        window.Class = Class;
        window.EventEmitter = EventEmitter;
        window.Namespace = Namespace;
        // console.log(window.Class, window.EventEmitter);

        // Set up the HTML reporter - this is reponsible for
        // aggregating the results reported by Jasmine as the
        // tests and suites are executed.

        require(["./index.js"], function() {
            // jasmine.getEnv().addReporter(
            //     new jasmine.HtmlReporter()
            // );
            // Run all the loaded test specs.
            jasmine.getEnv().execute();
        });

    }
);
