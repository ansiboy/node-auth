function modifyVersion() {
    const package = require("./package.json");

    let version = package.version || "1.0.0";
    let arr = version.split(".");
    arr[arr.length - 1] = (Number.parseInt(arr[arr.length - 1]) + 1).toString();
    version = arr.join(".");
    package.version = version;

    const fs = require('fs');
    let data = JSON.stringify(package, null, 4);
    fs.writeFileSync("package.json", data, "utf8");
};
modifyVersion();

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    let config = require("./config.json");
    
    grunt.initConfig({
        shell: {
            src: {
                command: "tsc -p src"
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