module.exports = function(grunt) {
    var config = {};
    var configName = 'clean';

    config = {
        tests: ['coverage']
    };

    grunt.config.set(configName, config);

    grunt.loadNpmTasks('grunt-contrib-clean');
};
