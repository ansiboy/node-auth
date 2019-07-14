function startServiceSide() {

    const config = require('./config.json')
    const http = require('http')
    const { start } = require('../node-auth-server/out/index')

    //===========================================
    // 目标主机，服务所在的主机
    const target_host = '127.0.0.1';
    //===========================================

    start({
        port: config.port,
        db: {
            host: config.db.host,
            port: config.db.port,
            user: config.db.user,
            password: config.db.password,
            database: config.db.name
        },
        proxy: {
            '/AdminSite/(\\S+)': { targetUrl: `http://${target_host}:9000/Admin/$1`, headers: proxyHeader },
            '/AdminStock/(\\S+)': { targetUrl: `http://${target_host}:9005/Admin/$1`, headers: proxyHeader },
            '/AdminShop/(\\S+)': { targetUrl: `http://${target_host}:9010/Admin/$1`, headers: proxyHeader },
            '/AdminMember/(\\S+)': { targetUrl: `http://${target_host}:9020/Admin/$1`, headers: proxyHeader },
            '/AdminWeiXin/(\\S+)': { targetUrl: `http://${target_host}:9030/Admin/$1`, headers: proxyHeader },
            '/AdminAccount/(\\S+)': { targetUrl: `http://${target_host}:9035/Admin/$1`, headers: proxyHeader },
            '/UserSite/(\\S+)': { targetUrl: `http://${target_host}:9000/User/$1`, headers: proxyHeader },
            '/UserStock/(\\S+)': { targetUrl: `http://${target_host}:9005/User/$1`, headers: proxyHeader },
            '/UserShop/(\\S+)': { targetUrl: `http://${target_host}:9010/User/$1`, headers: proxyHeader },
            '/UserMember/(\\S+)': { targetUrl: `http://${target_host}:9020/User/$1`, headers: proxyHeader },
            '/UserWeiXin/(\\S+)': { targetUrl: `http://${target_host}:9030/User/$1`, headers: proxyHeader },
            '/UserAccount/(\\S+)': { targetUrl: `http://${target_host}:9035/User/$1`, headers: proxyHeader }
        }
    })


    /**
     * 
     * @param {http.IncomingMessage} req 
     */
    async function proxyHeader(req) {
        let header = {}
        let tokenText = req.headers['token']
        if (tokenText) {
            try {
                let token = await Token.parse(tokenText);
                var obj = JSON.parse(token.content);
                header = obj
            } catch (err) {
                console.error(err)
            }
        }

        if (header.user_id) {
            header['SellerId'] = header.user_id
            header['UserId'] = header.user_id
        }

        return header
    }
}

function startClientSide() {
    const path = require("path");
    const { start } = require('../node-auth-client/out/server/index')
    start({
        port: 4210,
        roleId: '535e89a2-5b17-4e65-fecb-0259015b1a9b',
        // modulesPath: path.join(__dirname, 'demo/public/modules'),
        controllerPath: path.join(__dirname, '../node-auth-client/demo/server/controllers'),
        staticRootDirectory: path.join(__dirname, "../node-auth-client/demo/public"),
        gateway: '127.0.0.1:2857'
    })
}

startServiceSide();
startClientSide();