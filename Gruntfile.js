
var release = 'release';
module.exports = function (grunt) {
    var config = {
        ts: {
            server: {
                src: ['src/server/**/*.ts'],
                dest: `${release}/temp/server`,
                options: {
                    target: 'es6',
                    //module: 'commonjs',
                    removeComments: true,
                    declaration: false,
                    sourceMap: false,
                    references: [
                        "src/server/**/*.ts"
                    ],
                }
            },
            client: {
                src: ['src/client/**/*.ts'],
                dest: `${release}/client`,
                options: {
                    target: 'es5',
                    module: 'amd',
                    removeComments: true,
                    declaration: false,
                    sourceMap: false,
                    references: [
                        "src/client/**/*.ts"
                    ],
                }
            },
            test: {
                src: ['src/test/**/*.ts'],
                dest: `${release}/test`,
                options: {
                    target: 'es5',
                    module: 'commonjs',
                    removeComments: true,
                    declaration: false,
                    sourceMap: false,
                    references: [
                        "src/test/**/*.ts"
                    ],
                }
            }
        },
        babel: {
            options: {
                sourceMap: false,
                presets: ['node6']
            },
            dist: {
                files: [
                    {
                        expand: true, cwd: `${release}/temp/server`,
                        src: "**/*.js", dest: `${release}/server`
                    }
                ]
            }
        },
        stylus: {
            app: {
                options: {
                    compress: false,
                },
                files: [{
                    expand: true,
                    cwd: release + '/content',
                    src: ['**/*.styl'],
                    dest: dest_root + '/content',
                    ext: '.css'
                }]
            },
            // bootstrap: {
            //     files: [{
            //         src: [src_root + '/css/bootstrap-3.3.5/bootstrap.less'],
            //         dest: dest_root + '/css/bootstrap.css'
            //     }]
            // },
            // chitu: {
            //     files: [{
            //         src: [src_root + '/css/chitu.less'],
            //         dest: dest_root + '/css/chitu.css'
            //     }]
            // }
        },
        copy: {
            client: {
                files: [
                    {
                        expand: true, cwd: 'src/client',
                        src: ['**/*.html', '**/*.js', '**/*.css', 'font/*.*'],
                        dest: `${release}/client`
                    },
                ]
            }
        }
    };




    grunt.initConfig(config);

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-ts');

    grunt.registerTask('default', ['ts', 'copy', 'babel']);

};