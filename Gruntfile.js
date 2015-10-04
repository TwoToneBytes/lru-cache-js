module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        karma: {
            options: {
                configFile: 'karma.conf.js'
            },
            dev: {
                browsers: ['Chrome']
            }
        }
    });

    grunt.registerTask('test', ['karma:dev']);
};