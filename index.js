const config = require('./config.json')
const path = require('path')
const http = require('http')
const { start, constants, TokenManager } = require('./out/index')
const Cookies = require("cookies")
//===========================================
// 目标主机，服务所在的主机
const target_host = '127.0.0.1';
//===========================================

start({
    port: config.port,
    // bindIP: "127.0.0.1",
    
    db: {
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        database: config.db.name
    },
    virtualPaths: {
        node_modules: path.join(__dirname, "node_modules"),
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
        '/UserAccount/(\\S+)': { targetUrl: `http://${target_host}:9035/User/$1`, headers: proxyHeader },
        "^/Images/Editor/(\\S+)": "http://web.alinq.cn/store2/Images/Editor/$1",
        "/merchant(\\S*)": `http://127.0.0.1:65271/$1`,
        "/image/(\\S*)": `http://127.0.0.1:48628/$1`
    },
    async initDatabase() {
        // await dc.initDatabase("18502146746", "b6d767d2f8ed5d21a44b0e5886680cb9")
    },
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*'
    },
    permissions: {
        "*.js": { roleIds: [constants.anonymousRoleId] },
        "*.html": { roleIds: [constants.anonymousRoleId] },
        "*.css": { roleIds: [constants.anonymousRoleId] },
        "*.less": { roleIds: [constants.anonymousRoleId] },
        "*.jpg": { roleIds: [constants.anonymousRoleId] },
        "*.png": { roleIds: [constants.anonymousRoleId] },
        "*.woff": { roleIds: [constants.anonymousRoleId] },
        "*.map": { roleIds: [constants.anonymousRoleId] },

        // "/admin/(*)": { roleIds: [constants.anonymousRoleId] },
        // "/user/*": { roleIds: [constants.anonymousRoleId] },
        // "/designer/*": { roleIds: [constants.anonymousRoleId] },
        // "/shop/*": { roleIds: [constants.anonymousRoleId] },
        // "/chitu-admin/*": { roleIds: [constants.anonymousRoleId] },
        // "/auth/*": { roleIds: [constants.anonymousRoleId] },
        // "/UserMember/*": { roleIds: [constants.anonymousRoleId] },
        // "/UserShop/*": { roleIds: [constants.anonymousRoleId] },
        // "/Images/*": { roleIds: [constants.anonymousRoleId] },
        // "/merchant*": { roleIds: [constants.anonymousRoleId] },
        "/favicon.ico": { roleIds: [constants.anonymousRoleId] },
        "/auth/user/login": { roleIds: [constants.anonymousRoleId] },

        "/auth/station/list": { roleIds: [constants.anonymousRoleId] },
        "/auth/station/register": { roleIds: [constants.anonymousRoleId] },

        "/AdminMember/*": { roleIds: [constants.adminRoleId] },
        "/UserMember/*": { roleIds: [constants.adminRoleId] }
    }
})


/**
 * 
 * @param {http.IncomingMessage} req 
 */
async function proxyHeader(req) {
    let cookies = new Cookies(req);
    let header = {}
    let tokenText = req.headers['token'] || cookies.get("token");
    if (tokenText) {
        try {
            let token = await TokenManager.parse(tokenText);
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

