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
                'test/index.js',
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

    //Tests
    grunt.loadNpmTasks('grunt-bower-requirejs');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-force-task');

    grunt.loadTasks('tasks');

    grunt.registerTask('test', '', function() {
        grunt.task.run(['clean', 'jshint:all', 'build', 'cliTest', 'browserTest']);
    });

    grunt.registerTask('ci', 'Runs the test functions in a CI environment, i.e. used to generate report dumps for process management', function() {
        grunt.task.run(['clean', 'force:jshint:ci', 'jshint:all', 'build', 'cliTest']);
    });

    grunt.registerTask('default', ['cliTest', 'build']);

    grunt.registerTask('mocha', ['clean', 'mocha_istanbul']);

    grunt.registerTask('cliTest', ['mocha', 'jasmine']);
    grunt.registerTask('browserTest', '', function() {
        console.log("Test server can be found at:", "localhost:" + 8010 + "/test/");
        grunt.task.run(['connect:test:keepalive']);
    });

    grunt.registerTask('build', ['bower', 'copy', 'concat', 'uglify']);

};
