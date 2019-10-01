import { start as startAdmin } from "./admin";
import { start as startService, constants } from "./service";
import { ConnectionConfig } from "mysql";
import { startServer, Config as MVCConfig } from "maishu-node-mvc";
import { AddressInfo } from "net";
import { authenticate, PermissionConfig } from "./service/filters/authenticate";
import Cookies = require("cookies");
import { TokenManager } from "./service/index";

export { TokenManager, constants } from "./service/index";
export { createDataContext, AuthDataContext } from "./service/data-context";
export * from "./service/entities";

interface Config {
    port: number,
    db: ConnectionConfig,
    permissions?: PermissionConfig,
    proxy?: MVCConfig["proxy"],
    headers?: MVCConfig["headers"],
    actionFilters?: MVCConfig["actionFilters"]
}

export function start(config: Config) {
    let { server: serviceServer } = startService({
        port: 0, db: config.db
    })
    let servicePort = (serviceServer.address() as AddressInfo).port;

    let authServiceURL = `http://127.0.0.1:${servicePort}`
    let { server: adminServer } = startAdmin({ port: 0, authServiceURL })

    let adminPort = (adminServer.address() as AddressInfo).port;
    console.log(`${adminPort} ${servicePort}`)

    let proxy = Object.assign(config.proxy || {}, {
        "/admin(\\S*)": { targetUrl: `http://127.0.0.1:${adminPort}$1` },
        "/auth(\\S*)": { targetUrl: `${authServiceURL}$1`, }
    })

    startServer({
        port: config.port, proxy,
        headers: config.headers,
        authenticate: (req, res) => authenticate(req, res, config.permissions),
        actionFilters: [
            async (req, res) => {
                let cookies = new Cookies(req, null);
                let headers = {} as any;
                let tokenText = req.headers['token'] as string || cookies.get("token");
                if (tokenText) {
                    try {
                        let token = await TokenManager.parse(tokenText);
                        if (token != null) {
                            var obj = JSON.parse(token.content);
                            headers = obj
                        }
                    } catch (err) {
                        console.error(err)
                    }
                }

                if (headers.user_id) {
                    headers['SellerId'] = headers.user_id
                    headers['UserId'] = headers.user_id
                }

                req.headers = Object.assign(req.headers, headers);
                return null;
            }
        ]
    })
}

//===========================================
// 目标主机，服务所在的主机
const target_host = '127.0.0.1';
//===========================================
start({
    port: 2857,
    db: {
        user: "root",
        password: "81263",
        database: "shop_auth",
        host: "127.0.0.1",
        port: 3306
    },
    permissions: {
        "/admin(/*)": { roleIds: [constants.anonymousRoleId] },
        "/service(/*)": { roleIds: [constants.anonymousRoleId] },
        "/merchant(/*)": { roleIds: [constants.anonymousRoleId] }
    },
    proxy: {
        '/AdminSite/(\\S+)': { targetUrl: `http://${target_host}:9000/Admin/$1`, headers: proxyHeaders },
        '/AdminStock/(\\S+)': { targetUrl: `http://${target_host}:9005/Admin/$1`, headers: proxyHeaders },
        '/AdminShop/(\\S+)': { targetUrl: `http://${target_host}:9010/Admin/$1`, headers: proxyHeaders },
        '/AdminMember/(\\S+)': { targetUrl: `http://${target_host}:9020/Admin/$1`, headers: proxyHeaders },
        '/AdminWeiXin/(\\S+)': { targetUrl: `http://${target_host}:9030/Admin/$1`, headers: proxyHeaders },
        '/AdminAccount/(\\S+)': { targetUrl: `http://${target_host}:9035/Admin/$1`, headers: proxyHeaders },
        '/UserSite/(\\S+)': { targetUrl: `http://${target_host}:9000/User/$1`, headers: proxyHeaders },
        '/UserStock/(\\S+)': { targetUrl: `http://${target_host}:9005/User/$1`, headers: proxyHeaders },
        '/UserShop/(\\S+)': { targetUrl: `http://${target_host}:9010/User/$1`, headers: proxyHeaders },
        '/UserMember/(\\S+)': { targetUrl: `http://${target_host}:9020/User/$1`, headers: proxyHeaders },
        '/UserWeiXin/(\\S+)': { targetUrl: `http://${target_host}:9030/User/$1`, headers: proxyHeaders },
        '/UserAccount/(\\S+)': { targetUrl: `http://${target_host}:9035/User/$1`, headers: proxyHeaders },
        "^/Images/Editor/(\\S+)": "http://web.alinq.cn/store2/Images/Editor/$1",
        "/merchant(\\S*)": `http://127.0.0.1:65271$1`,
        "/image(\\S*)": `http://127.0.0.1:48628$1`
    },
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*'
    }
});

async function proxyHeaders(req) {
    // let cookies = new Cookies(req, null);
    let header = {} as any;
    // let tokenText = req.headers['token'] || cookies.get("token");
    // if (tokenText) {
    //     try {
    //         let token = await TokenManager.parse(tokenText);
    //         var obj = JSON.parse(token.content);
    //         header = obj
    //     } catch (err) {
    //         console.error(err)
    //     }
    // }

    // if (header.user_id) {
    //     header['SellerId'] = header.user_id
    //     header['UserId'] = header.user_id
    // }

    return header
}

