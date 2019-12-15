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
            root: {
                command: "tsc -p ./"
            },
            start: {
                command: "node index"
            }
        }
    });

    grunt.registerTask("build", ["shell:gateway", "shell:permission", "shell:portal", "shell:root"]);
    grunt.registerTask("start", ["start"])
}