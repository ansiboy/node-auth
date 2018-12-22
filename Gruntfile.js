
// let build = 'build';
let release = 'release';
let debug = 'debug';
module.exports = function (grunt) {
    // var config = {
    //     shell: {
    //         client: {
    //             command: 'tsc -p ./src/client',
    //             options: {
    //                 failOnError: false
    //             }
    //         },
    //         server: {
    //             command: 'tsc -p ./src/server',
    //             options: {
    //                 failOnError: false
    //             }
    //         }
    //     }
    // };


    // grunt.initConfig(config);

    // grunt.loadNpmTasks('grunt-contrib-copy');
    // grunt.loadNpmTasks('grunt-contrib-less');
    // grunt.loadNpmTasks('grunt-shell');

    // grunt.registerTask('default', ['shell', 'stylus', 'copy']);

    require('load-grunt-tasks')(grunt);

    let node_modules = "../../node_modules"
    let excludes = ['react', 'react-dom', 'maishu-chitu', 'maishu-chitu-react', 'maishu-chitu-admin', 'maishu-dilu', 'maishu-ui-toolkit']
    grunt.initConfig({
        browserify: {
            dist: {
                files: {
                    "out/client/bundle.js": "out/client/application.js"
                },
                options: {
                    transform: ['brfs'],
                    browserifyOptions: {
                        standalone: 'maishu_node_auth',
                    },
                    external: excludes
                }
            }
        },
        concat: {
            lib_es6: {
                src: ['out/client/modules.js', 'out/client/bundle.js'],
                dest: `dist/client/index.js`
            },
            declare: {
                src: ['src/client/declare.d.ts'],
                dest: `dist/client/index.d.ts`
            }
        },
        requirejs: {
            client: {
                options: {
                    baseUrl: 'out/client',
                    paths: {
                        "react": `${node_modules}/react/umd/react.development`,
                        "react-dom": `${node_modules}/react-dom/umd/react-dom.development`,
                        "maishu-chitu": `${node_modules}/maishu-chitu/dist/chitu`,
                        "maishu-chitu-admin": `${node_modules}/maishu-chitu-admin/dist/chitu_admin`,
                        "maishu-chitu-react": `${node_modules}/maishu-chitu-react/out/index`,
                        "maishu-dilu": `${node_modules}/maishu-dilu/dist/dilu`,
                        "maishu-ui-toolkit": `${node_modules}/maishu-ui-toolkit/dist/index`
                    },
                    include: [
                        `modules/forget-password`,
                        `modules/login`,
                        `modules/register`,
                    ],
                    exclude: excludes,
                    out: 'out/client/modules.js',
                    optimize: 'none',
                }
            }
        },
        shell: {
            client: {
                command: 'tsc -p ./src/client',
                options: {
                    failOnError: false
                }
            },
            server: {
                command: 'tsc -p ./src/server',
                options: {
                    failOnError: false
                }
            }
        }
    })

    grunt.registerTask('default', ['shell', 'requirejs', 'browserify', 'concat'])
};