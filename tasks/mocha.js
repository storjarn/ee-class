//Browser tests
module.exports = function(grunt) {
    var config = {};
    var configName = 'mochaTest';

    config = { //Node.js tests
        test: {
            options: {
                reporter: 'spec',
                captureFile: 'results.txt', // Optionally capture the reporter output to a file
                quiet: false, // Optionally suppress output to standard out (defaults to false)
                clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
            },
            src: ['test/index.js']
        }
    };

    grunt.config.set(configName, config);

    grunt.loadNpmTasks('grunt-mocha-test');
};
