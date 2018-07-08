//Browser tests
module.exports = function(grunt) {
    var config = {};
    var configName = 'jasmine';

    config.test = {
        src: '<%= paths.lib %>',
        options: {
            banner: '<a href="/coverage/">Coverage</a>\n',
            specs: 'test/index.js',
            helpers: 'spec/*Helper.js',
            template: require('grunt-template-jasmine-istanbul'),
            templateOptions: {
                coverage: 'coverage/coverage.json',
                report: [{
                    type: 'html',
                    options: {
                        dir: 'coverage'
                    }
                }, {
                    type: 'lcov',
                    options: {
                        dir: 'coverage/lcov-report'
                    }
                }, {
                    type: 'cobertura',
                    options: {
                        dir: 'coverage/cobertura'
                    }
                }, {
                    type: 'text-summary'
                }],
                thresholds: {
                    lines: 40,
                    statements: 40,
                    branches: 50,
                    functions: 45
                }
            }
        }
    };

    grunt.config.set(configName, config);

    grunt.loadNpmTasks('grunt-contrib-jasmine');
};
