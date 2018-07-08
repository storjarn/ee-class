module.exports = function(grunt) {
    var config = {};
    var configName = 'jsbeautifier';

    config = {
        files: ['<%= paths.lib %>', '<%= paths.test %>', '<%= paths.utility %>'],
        options: {
            js: {
                braceStyle: "collapse",
                breakChainedMethods: false,
                e4x: false,
                evalCode: false,
                indentChar: " ",
                indentLevel: 0,
                indentSize: 4,
                indentWithTabs: false,
                jslintHappy: false,
                keepArrayIndentation: false,
                keepFunctionIndentation: false,
                maxPreserveNewlines: 10,
                preserveNewlines: true,
                spaceBeforeConditional: true,
                spaceInParen: false,
                unescapeStrings: false,
                wrapLineLength: 0,
                endWithNewline: true
            }
        }
    };

    grunt.config.set(configName, config);

    grunt.registerTask('beautify', '', function() {
        grunt.task.run(['jsbeautifier']);
    });

    grunt.loadNpmTasks("grunt-jsbeautifier");
};
