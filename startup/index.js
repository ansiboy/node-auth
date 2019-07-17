function startServiceSide() {

    const { config } = require('./config.js');
    const { start } = require('../node-auth-server/out/index')

    start(config, async (args) => {
        //==============================================================
        // 初始化数据库，只需要运行一次即可
        // return args.dc.initDatabase(config.adminMobile, config.adminPassword);
        //==============================================================
    })

}

function startClientSide() {
    const path = require("path");
    const { start } = require('../node-auth-client/out/server/index');
    const { config } = require('./config.js');
    start({
        port: 4210,
        roleId: '535e89a2-5b17-4e65-fecb-0259015b1a9b',
        controllerPath: path.join(__dirname, '../node-auth-client/demo/server/controllers'),
        staticRootDirectory: path.join(__dirname, "../node-auth-client/demo/public"),
        gateway: `127.0.0.1:${config.port}`
    })
}

startServiceSide();
startClientSide();