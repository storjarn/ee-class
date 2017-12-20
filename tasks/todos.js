/* globals IS_CI */

module.exports = function(grunt) {

    var config = {
        options: {
            verbose: false
        },
        TODOS : ['globals.js', 'index.js', '<%= paths.lib %>', '<%= paths.utility %>', '<%= paths.test %>', '!tasks/todos.js']
    };

    grunt.config.set('todos', config);

    grunt.loadNpmTasks('grunt-todos');
};
