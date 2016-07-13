module.exports = function(grunt) {
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        clean: {
            clean: [
                "dist",
                "src/jasmine",
                "src/tbMin",
                "src/tb",
                "src/tbTest.js"
            ]
        },

        copy: {
            before: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/tb',
                        src: '*.js',
                        dest: 'dist/tb'
                    }
                ]
            },
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/tb',
                        src: '*.js',
                        dest: 'dist/tb'
                    },
                    {
                        expand: true,
                        cwd: 'src/tbMin',
                        src: '*.js',
                        dest: 'dist/tb'
                    },
                    {
                        expand: true,
                        cwd: 'src/tbMin',
                        src: '*.js.map',
                        dest: 'dist/tb'
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/jasmine-core/lib/jasmine-core',
                        src: [ '*.js', '*.css' ],
                        dest: 'src/jasmine'
                    }
                ]
            }
        },

        concat: {
            options: {
                separator: '\n;\n',
                //stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n\n'
            },
            dist: {
                files: {
                    'src/tb/tb.js': [
                        'src/tbSource/tb.core.js',
                        'src/tbSource/tb.dom.js',
                        'src/tbSource/tb.utils.js',
                        'src/tbSource/tb.Model.js',
                        'src/tbSource/tb.Require.js'
                    ],
                    'src/tbTest.js': [
                        'src/tbJasmine/jasmine.js',
                        'src/tbJasmine/jasmine-html.js',
                        'src/tbTest/tbJasmineBoot.js',
                        'src/tbTest/tb.core.test.js',
                        'src/tbTest/tb.dom.test.js',
                        'src/tbTest/tb.Model.test.js',
                        'src/tbTest/tb.Require.test.js',
                        'src/tbTest/tb.utils.test.js'
                    ]
                },
                nonull: true
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
                        'src/tbMin/tb.min.js': [
                            'src/tb/tb.js'
                        ]
                    }
                ]
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
                version: 'v<%= pkg.version%>',
                url: 'http://www.tb-core.org',
                options: {
                    linkNatives: "true",
                    paths: 'src/tb',
                    outdir: 'src/tbDocs/'
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

    // Default task(s).
    grunt.registerTask(
        'default', [
            'jshint',
            'clean',
            'copy:before',
            'concat',
            'uglify',
            'copy:main',
            'yuidoc'
        ]
    );

};
