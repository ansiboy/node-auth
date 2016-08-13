
var release_dir = 'release';
module.exports = function (grunt) {
    var config = {
        ts: {
            base: {
                src: ['src/**/*.ts'],
                dest: release_dir,
                options: {
                    target: 'es6',
                    removeComments: true,
                    declaration: false,
                    references: [
                        "src/**/*.ts"
                    ],
                    sourceMap: false
                }
            }
        }
    };




    grunt.initConfig(config);

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['ts']);//,, 'clean'

};