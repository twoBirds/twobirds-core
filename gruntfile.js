module.exports = function(grunt) {
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        // Permission problem try to exec command "npm cache clean"
        watch: {
            scss: {
                files: [
                    'src/app/app/scss//{,*/}*.scss',
                    '/{,*/}*.js'
                ],
                tasks: [
                    'clean',
                    'scss'
                ]
            }
        },

        clean: {
            clean: [
                "dist"
            ]
        },

        scss: {
            production: {
                options: {
                    //relativeUrls: true,
                    paths: ["src/app/app/scss"],
                    cleancss: true,
                    modifyVars: {
                        //imgPath: '"http://"'
                    }
                },
                files: {
                    "dist/app/app/GrandParent.css": "src/app/app/scss/GrandParent.scss"
                }
            }
        },

        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/tb',
                        src: '**/*.js',
                        dest: 'dist/tb'
                    },
                    {
                        expand: true,
                        //dot: true,
                        cwd: 'src',
                        src: '**/*.scss',
                        dest: 'dist'
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
                        cwd: 'src/tb',
                        src: '**/*.js',
                        dest: 'dist/tb'
                    },
                    {
                        'dist/tb/tb.min.js': ['dist/tb/tb.min.js']
                    }
                ]
            }
        },

        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: [
                    'src/tb/tb.min.js'
                ],
                dest: 'dist/tb/tb.min.js'
            }
        },

        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                maxparams: 4,
                notypeof: true
            },
            all: ['src/tb/**/*.js']
        },

        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    paths: 'src/',
                    outdir: 'dist/docs/'
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task(s).
    grunt.registerTask('default', [
        //'jshint',
        'clean',
        'scss',
        'concat',
        'copy',
        'uglify'
    ]);

};
