module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    let config = require("./config.json");
    
    grunt.initConfig({
        shell: {
            src: {
                command: "tsc -p ./"
            }
        },
        open: {
            browser: {
                path: `http://127.0.0.1:${config.port}/portal/#login`,
                app: 'Google Chrome'
            }
        }
    });

    grunt.registerTask("build", ["shell"]);
    grunt.registerTask("start", ["open"])
}