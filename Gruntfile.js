module.exports = function(grunt) {

    // Project configuration.
    var config = {
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            lib: {
                files: [{
                    expand: true,
                    src: ['./lib/*'],
                    dest: 'dist/',
                    filter: 'isFile',
                    flatten: true
                }]
            }
        },
        concat: {
            options: {
                separator: ';\n',
            }
        },
        mochaTest: { //Node.js tests
            test: {
                options: {
                    reporter: 'spec',
                    captureFile: 'results.txt', // Optionally capture the reporter output to a file
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
                },
                src: ['test/index.js']
            }
        },
        connect: {
            test: {
                options: {
                    port: 8010,
                    keepAlive: true
                }
            }
        },
        bower: { //Update requirejs with bower components
            target: {
                rjsConfig: './test/requirejs-config.js'
            },
            options: {
                baseUrl: './',
                transitive: true,
                'exclude-dev': true
            }
        },

        paths: {
            lib: [
                'lib/**/*.js'
            ],
            test: [
                'test/**/*.js',
            ],
            utility: [
                'Gruntfile.js',
                'tasks/*.js'
            ]
        }
    };

    // Build config
    config.paths.all = config.paths.lib
        .concat(config.paths.test)
        .concat(config.paths.utility);

    // Project configuration.
    grunt.initConfig(config);


    //Build
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-bower-requirejs');
    //Tests
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-force-task');

    grunt.loadTasks('tasks');

    grunt.registerTask('test', '', function() {
        grunt.task.run(['jshint:all', 'mochaTest']);
    });

    grunt.registerTask('ci', 'Runs the test functions in a CI environment, i.e. used to generate report dumps for process management', function() {
        grunt.task.run(['force:jshint:ci', 'jshint:all', 'mochaTest']);
    });

    grunt.registerTask('default', ['cliTest', 'build']);

    grunt.registerTask('mocha', ['mochaTest']);

    grunt.registerTask('cliTest', ['jasmine', 'mochaTest']);
    grunt.registerTask('browserTest', '', function() {
        console.log("Test server can be found at:", "localhost:" + 8010 + "/test/");
        grunt.task.run(['connect:test:keepalive']);
    });

    grunt.registerTask('build', ['bower', 'copy', 'concat', 'uglify']);

};


