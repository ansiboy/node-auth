
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
        },
        babel: {
            options: {
                sourceMap: false,
                presets: ['es2015']
            },
            dist: {
                files: [
                    {
                        expand: true, cwd: `${release}/temp/server`,
                        src: "**/*.js", dest: `${release}/server`
                    }
                ]
            }
        }
    };




    grunt.initConfig(config);

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-babel');

    grunt.registerTask('default', ['ts', 'copy', 'babel']);

};