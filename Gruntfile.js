
var release = 'release';
module.exports = function (grunt) {
    var config = {
        ts: {
            server: {
                src: ['src/server/**/*.ts'],
                dest: `${release}/server`,
                options: {
                    target: 'es6',
                    module: 'commonjs',
                    removeComments: true,
                    declaration: false,
                    sourceMap: true,
                    references: [
                        "src/server/**/*.ts",
                    ],
                }
            },
            client: {
                src: ['src/client/**/*.ts','src/client/**/*.tsx'],
                dest: `${release}/client`,
                options: {
                    target: 'es6',
                    module: 'amd',
                    removeComments: true,
                    declaration: false,
                    sourceMap: false,
                    jsx: 'react',
                    references: [
                        "src/client/**/*.ts"
                    ],
                }
            },
            test: {
                src: ['src/test/**/*.ts'],
                dest: `${release}`,
                options: {
                    target: 'es6',
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
        stylus: {
            app: {
                options: {
                    compress: false,
                },
                files: [{
                    expand: true,
                    cwd: 'src/client/css/',
                    src: ['**/*.styl'],
                    dest: 'release/client/css',
                    ext: '.css'
                }]
            },
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

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-ts');

    grunt.registerTask('default', ['ts', 'stylus',  'copy']);

};