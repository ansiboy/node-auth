const config = require('./config.json')

function startServiceSide() {

    const config = require('./config.json');
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
        roleId: '535e89a2-5b17-4e65-fecb-0259015b1a9b',
        // controllerPath: path.join(__dirname, 'out/server/controllers'),
        staticRootDirectory: path.join(__dirname, "out/public"),
        gateway: '127.0.0.1:2857'
    })
}

startServiceSide();
startClientSide();