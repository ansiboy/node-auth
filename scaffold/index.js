const { default: config } = require('./config.js')

function startServiceSide() {

    const { start } = require("maishu-node-auth");

    start({
        port: config["node-auth-server"].port,
        db: config["node-auth-server"].db,
    })
}

function startClientSide() {
    const path = require("path");
    const { start } = require('maishu-admin')
    start({
        port: 4210,
        staticRootDirectory: path.join(__dirname, "out/public"),
        gateway: `127.0.0.1:${config["node-auth-server"].port}`
    })
}

startServiceSide();
startClientSide();