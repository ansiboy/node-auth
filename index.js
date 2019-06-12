const { startServer } = require('maishu-node-mvc')
const config = require('./config.json')
const path = require('path')
const http = require('http')
const { tokenConttent } = require('./out/server/user-variable')
const { Token } = require('./out/server/token');

//===========================================
// 目标主机，服务所在的主机
const target_host = '127.0.0.1';
//===========================================

startServer({
    port: config.port,
    db: config.db,
    rootPath: __dirname,
    controllerDirectory: path.join(__dirname, './out/server/controllers'),
    staticRootDirectory: path.join(__dirname, './out/client/'),
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*'
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
        }
        catch (err) {
            console.error(err)
        }
    }

    if (header.user_id) {
        header['SellerId'] = header.user_id
        header['UserId'] = header.user_id
    }

    return header
}

