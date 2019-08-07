function startServiceSide() {

    const { config } = require('./config.js');
    const { start, constants } = require('../node-auth-server/out/index')

    start({
        port: config.port,
        db: config.db,
        async initDatabase(dc) {
            //==============================================================
            // 初始化数据库，只需要运行一次即可
            await dc.initDatabase(config.adminMobile, config.adminPassword);
            //==============================================================
        },
        permissions: {
            "/api/action/list": constants.anonymousRoleId
        }
    })

}

function startClientSide() {
    const path = require("path");
    const { start } = require('../node-auth-client/out/server/index');
    const { config } = require('./config.js');
    start({
        port: 4223,
        roleId: '535e89a2-5b17-4e65-fecb-0259015b1a9b',
        controllerPath: path.join(__dirname, '../node-auth-client/demo/server/controllers'),
        staticRootDirectory: path.join(__dirname, "../node-auth-client/demo/public"),
        gateway: `http://127.0.0.1:${config.port}/auth`,
        virtualPaths: {
            "node_modules": path.join(__dirname, "node_modules")
        },

    })
}

startServiceSide();
startClientSide();