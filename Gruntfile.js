module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        shell: {
            gateway: {
                command: "tsc -p gateway"
            },
            permission: {
                command: "tsc -p permission"
            },
            portal: {
                command: "tsc -p portal"
            },
        }
    });

    grunt.registerTask("build", ["shell"]);
}