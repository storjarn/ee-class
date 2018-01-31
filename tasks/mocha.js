//Browser tests
module.exports = function(grunt) {
    var config = {};
    var configName = 'mochaTest';

    var coverageThresholds = {
        lines: 40,
        statements: 40,
        branches: 50,
        functions: 40
    };

    config = { //Node.js tests
        test: {
            options: {
                reporter: 'spec',
                captureFile: 'results.txt', // Optionally capture the reporter output to a file
                quiet: false, // Optionally suppress output to standard out (defaults to false)
                clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
            },
            src: ['<%= paths.test %>']
        }
    };

    grunt.config.set(configName, config);

    grunt.loadNpmTasks('grunt-mocha-test');

    configName = 'mocha_istanbul';

    config = {
        coverage: {
            src: ['<%= paths.test %>'],
            options: {
                // mask: '*.spec.js'.
                coverageFolder: 'coverageMocha',
                check: coverageThresholds,
                reportFormats: ['cobertura', 'lcovonly', 'html']
            }
        }
    };

    grunt.config.set(configName, config);

    grunt.loadNpmTasks('grunt-mocha-istanbul');

    configName = 'istanbul_check_coverage';

    config = {
        default: {
            options: {
                coverageFolder: 'coverage*', // will check both coverage folders and merge the coverage results
                check: coverageThresholds
            }
        }
    };

    grunt.config.set(configName, config);
};
