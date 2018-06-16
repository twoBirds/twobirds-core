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
                        cwd: 'src/app',
                        src: '*.*',
                        dest: 'dist/app'
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/jasmine-core/lib/jasmine-core',
                        src: [ '*.js', '*.css' ],
                        dest: 'src/jasmine'
                    },
                    {
                        expand: true,
                        cwd: 'src/tbJasmine',
                        src: '*.css',
                        dest: 'dist/jasmine'
                    },
                    {
                        expand: true,
                        cwd: 'src/test',
                        src: [ '**/*.css', '**/*.html', '**/*.json' ],
                        dest: 'dist/test'
                    },
                    {
                        expand: true,
                        cwd: 'src',
                        src: [ 'test-min.html', 'repo.js', 'repo-min.js', 'test.json', 'twoBirds.svg' ],
                        dest: 'dist'
                    },
                    {
                        expand: true,
                        cwd: 'src',
                        src: [ 'twoBirds.svg' ],
                        dest: 'src/tbDocs'
                    },
                    {
                        expand: true,
                        cwd: 'dist/tb',
                        src: '*.js',
                        dest: 'src/tbDocs'
                    }
                ]
            }
        },

        concat: {
            options: {
                separator: '\n\n',
                //stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n\n'
            },
            dist: {
                files: {
                    'src/tb/tb.js': [
                        'src/tbSource/tb.core.js',
                        'src/tbSource/tb.dom.js',
                        'src/tbSource/tb.utils.js',
                        'src/tbSource/tb.CRUD.js',
                        'src/tbSource/tb.es6.js'
                    ],
                    'dist/tb/tb.js': [
                        'node_modules/@webcomponents/custom-elements/custom-elements.min.js',
                        'src/tb/tb.js'
                    ],
                    'src/tbTest.js': [
                        'src/tbJasmine/jasmine.js',
                        'src/tbJasmine/jasmine-html.js',
                        'src/tbTest/tbJasmineBoot.js',
                        'src/tbTest/tb.core.test.js',
                        'src/tbTest/tb.dom.test.js',
                        'src/tbTest/tb.CRUD.test.js',
                        'src/tbTest/tb.utils.test.js'
                    ],
                    'src/repo.js': [
                        'src/test/global.js',
                        'src/test/GrandParent.js',
                        'src/test/TestForm.js',
                        'src/test/Parent.js',
                        'src/test/Child.js',
                        'src/test/GrandChild.js',
                        'src/test/GreatGrandChild.js'
                    ]
                },
                nonull: true
            }
        },

        uglify: {
            options: {
                mangle: {
                    except:	['node_modules/@webcomponents/custom-elements/custom-elements.min.js']
                }
            },
            my_target: {
                options: {
                    mangle: true
                },
                files: [
                    {
                        'dist/tb/tb-min.js': [
                            'node_modules/@webcomponents/custom-elements/custom-elements.min.js',
                            'src/tb/tb.js'
                        ]
                    },
                    {
                        'src/repo-min.js': [
                            'src/repo.js'
                        ]
                    },
                    {
                        'dist/tbTest.js': [
                            'src/tbTest.js'
                        ]
                    }
                ]
            }
        },

        jshint: {
            options: {
                esversion: 6,
                force: true,
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: false,
                newcap: false,
                noarg: false,
                sub: true,
                undef: true,
                boss: true,
                debug: true,
                eqnull: true,
                node: true,
                laxbreak: true,
                laxcomma: true,
                globals: {
                    exports: true,
                    module: false,
                    tb: true,
                    "window": false,
                    "document": false,
                    "HTMLElement": false,
                    "Element": false,
                    "HTMLCollection": false,
                    "NodeList": false,
                    "XMLHttpRequest": false,
                    "ActiveXObject": false
                }
            },
            all: [
                'src/tbSource/*.js'
            ]
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
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task(s).
    grunt.registerTask(
        'default', [
            'clean',
            'copy:before',
            'concat',
            'yuidoc',
            'uglify',
            'jshint',
            'copy:main'
        ]
    );

};
