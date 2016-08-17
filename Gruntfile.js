
var release_dir = 'release';
module.exports = function (grunt) {
    var config = {
        ts: {
            server: {
                src: ['src/server/**/*.ts'],
                dest: release_dir + '/server',
                options: {
                    target: 'es6',
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
                dest: release_dir + '/client',
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
            }
        },
        copy: {
            client: {
                files: [
                    {
                        expand: true, cwd: 'src/client',
                        src: ['**/*.html', '**/*.js', '**/*.css', 'font/*.*'],
                        dest: release_dir + '/client'
                    },
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

    grunt.registerTask('default', ['ts', 'copy']);

};