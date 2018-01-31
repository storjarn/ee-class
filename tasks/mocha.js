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

    configName = 'mocha_istanbul';

    config = {
        coverage: {
            src: ['test/index.js'],
            options: {
                // mask: '*.spec.js'.
                coverageFolder: 'coverageMocha',
                check: {
                    lines: 40,
                    statements: 40,
                    branches: 50,
                    functions: 45
                },
                reportFormats: ['cobertura','lcovonly', 'html']
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
                check: {
                    lines: 80,
                    statements: 80
                }
            }
        }
    };

    grunt.config.set(configName, config);
};
