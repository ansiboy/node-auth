import { startServer, Config } from 'maishu-node-mvc';
import path = require('path');
import { setConnection } from './settings';
import { ConnectionConfig } from "mysql";
import { initDatabase } from './dataContext';
import { checkPath } from './filters/checkPath';
import { TokenManager } from './token';


//===========================================
// 目标主机，服务所在的主机
const target_host = '127.0.0.1';
//===========================================

let config = {
    port: 2857,
    db: {
        host: "127.0.0.1",
        port: 3306,
        user: "root",
        password: "81263",
        database: "shop_auth"
    },
    // proxy: {
    //     '/AdminSite/(\\S+)': { targetUrl: `http://${target_host}:9000/Admin/$1`, headers: proxyHeader },
    //     '/AdminStock/(\\S+)': { targetUrl: `http://${target_host}:9005/Admin/$1`, headers: proxyHeader },
    //     '/AdminShop/(\\S+)': { targetUrl: `http://${target_host}:9010/Admin/$1`, headers: proxyHeader },
    //     '/AdminMember/(\\S+)': { targetUrl: `http://${target_host}:9020/Admin/$1`, headers: proxyHeader },
    //     '/AdminWeiXin/(\\S+)': { targetUrl: `http://${target_host}:9030/Admin/$1`, headers: proxyHeader },
    //     '/AdminAccount/(\\S+)': { targetUrl: `http://${target_host}:9035/Admin/$1`, headers: proxyHeader },
    //     '/UserSite/(\\S+)': { targetUrl: `http://${target_host}:9000/User/$1`, headers: proxyHeader },
    //     '/UserStock/(\\S+)': { targetUrl: `http://${target_host}:9005/User/$1`, headers: proxyHeader },
    //     '/UserShop/(\\S+)': { targetUrl: `http://${target_host}:9010/User/$1`, headers: proxyHeader },
    //     '/UserMember/(\\S+)': { targetUrl: `http://${target_host}:9020/User/$1`, headers: proxyHeader },
    //     '/UserWeiXin/(\\S+)': { targetUrl: `http://${target_host}:9030/User/$1`, headers: proxyHeader },
    //     '/UserAccount/(\\S+)': { targetUrl: `http://${target_host}:9035/User/$1`, headers: proxyHeader }
    // }
};

(async function start() {

    setConnection(config.db);

    await initDatabase();

    startServer({
        port: config.port,
        controllerDirectory: path.join(__dirname, 'controllers'),
        staticRootDirectory: path.join(__dirname, 'static'),
        virtualPaths: {
            node_modules: path.join(__dirname, "../node_modules")
        },
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*'
        },
        // actionFilters: [
        //     checkPath
        // ]
    })
})();



/**
 * 
 * @param {http.IncomingMessage} req 
 */
async function proxyHeader(req) {
    let header = {} as any;
    let tokenText = req.headers['token'];
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
        header['SellerId'] = header.user_id;
        header['UserId'] = header.user_id;
    }

    return header
}