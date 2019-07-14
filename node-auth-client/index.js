const { start } = require('./out/server/index')
const path = require('path')
start({
    port: 4210,
    roleId: '535e89a2-5b17-4e65-fecb-0259015b1a9b',
    // modulesPath: path.join(__dirname, 'demo/public/modules'),
    controllerPath: path.join(__dirname, 'demo/server/controllers'),
    staticRootDirectory: path.join(__dirname, "demo/public"),
    gateway: '127.0.0.1:2857'
})