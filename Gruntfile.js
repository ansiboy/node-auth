module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        shell: {
            root: {
                command: "tsc -p ./"
            },
            start: {
                command: "node index"
            }
        }
    });

    grunt.registerTask("build", ["shell:root"]);
    grunt.registerTask("start", ["start"])
}