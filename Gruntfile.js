module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
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
        }
    });

    //Build
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-bower-requirejs');
    //Tests
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.loadTasks('grunt');

    grunt.registerTask('default', ['build', 'cliTest']);

    grunt.registerTask('mocha', ['mochaTest']);

    grunt.registerTask('cliTest', ['mochaTest', 'jasmine']);
    grunt.registerTask('browserTest', '', function() {
        console.log("Test server can be found at:", "localhost:" + 8010 + "/test/");
        grunt.task.run(['connect:test:keepalive']);
    });

    grunt.registerTask('test', ['build', 'cliTest', 'browserTest']);
    grunt.registerTask('build', ['bower', 'copy', 'concat', 'uglify']);

};
