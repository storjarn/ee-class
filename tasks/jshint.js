/* globals IS_CI */

module.exports = function(grunt) {

    var config = {
        lib: {
            src: '<%= paths.lib %>'
        },
        test: {
            src: '<%= paths.test %>'
        },
        utility: {
            src: '<%= paths.utility %>'
        },
        all: {
            src: '<%= paths.all %>'
        },
        ci: {
            src: '<%= paths.all %>',
            options: {
                jshintrc: '.jshintrc',
                reporter: 'checkstyle',
                reporterOutput: 'jshint.xml'
            }
        },
        options: {
            jshintrc: '.jshintrc'
        }
    };

    grunt.config.set('jshint', config);

    grunt.loadNpmTasks('grunt-contrib-jshint');
};
