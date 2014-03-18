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

        jshint: {
            options: {
                jshintrc: true,
                globals: {
                    jQuery: true
                }
            },
            all: ['<%= data_path %>js/script.js']
        },
        
        watch: {
            options: {
                // livereload: true
            },
            js: {
                files: '<%= data_path %>**/*.js',
                tasks: ['uglify']
            },
            less: {
                files: '<%= data_path %>**/*.less',
                tasks: ['recess']
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
    
    // Test
    grunt.registerTask('test', ['jshint']);
        
    // Development build
    grunt.registerTask('build', ['recess', 'uglify', 'notify:build']);

    // Default deloyment
    grunt.registerTask('default', ['test', 'build']);

};
