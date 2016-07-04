module.exports = function(grunt) {
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        clean: {
            clean: [
                "dist"
            ]
        },

        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/tb',
                        src: '*.js',
                        dest: 'dist/tb'
                    }
                ]
            }
        },

        uglify: {
            options: {
                mangle: {
                    //except:	['jQuery']
                }
            },
            my_target: {
                options: {
                    mangle: false
                },
                files: [
                    {
                        expand: true,
                        cwd: 'src/tb/tb',
                        src: '*.js',
                        dest: 'src/tb/min'
                    },
                    {
                        'src/tb/tb.min.js': [
                            'src/tb/min/tb.core.js'
                        ]
                    }
                ]
            }
        },

        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [
                    'src/tb/tb//**.*.js'
                ],
                dest: 'src/tb/tb.js'
            }
        },

        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                node: true
            },
            globals: {
                exports: true,
                module: false
            }
        },

        yuidoc: {
            compile: {
                name: 'twoBirds',
                description: 'twoBirds WebComponent Framework',
                version: '7.0.3',
                url: 'http://www.tb-core.org',
                options: {
                    paths: 'dist/',
                    outdir: 'dist/docs/'
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.loadNpmTasks('grunt-min');

    // Default task(s).
    grunt.registerTask(
        'default', [
            'jshint',
            'clean',
            'concat',
            'uglify',
            'copy',
            'yuidoc'
        ]
    );

};
