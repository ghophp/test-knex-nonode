module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        
        data_path: 'data/',
        server_path: 'mock-app/',

        recess: {
            options: {
                compile: true,
                banner: '<%= banner %>'
            },
            theme: {
                options: {
                    compress: true
                },
                src: ['<%= data_path %>less/style.less'],
                dest: '<%= data_path %>css/style.min.css'
            }
        },

        uglify: {
            options: {
                mangle: false,
                banner: '<%= banner %>'
            },
            script: {
                files: {
                    '<%= data_path %>js/script.min.js': [
                        'data/js/script.js'
                    ]
                }
            }
        },
        
        watch: {
            data: {
                files: '<%= data_path %>**/*',
                tasks: ['build']
            },
            server: {
                files: [
                    '<%= server_path %>**/*.py'
                ],
                tasks: ['notify:server']
            }
        },

        notify: {
            build: {
                options: {
                    title: 'Test Knex',
                    message: 'Build completed!'
                }
            },
            server: {
                options: {
                    title: 'Test Knex',
                    message: 'Please, restart the server!'
                }
            }
        },

    });
        
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
        
    /////////////////////////
        
    // Development build
    grunt.registerTask('build', ['recess', 'uglify', 'notify:build']);

    // Default deloyment
    grunt.registerTask('default', ['build']);

};
