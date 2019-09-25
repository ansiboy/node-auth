import { start as startAdmin } from "./admin";
import { start as startService, constants } from "./service";
import { ConnectionConfig } from "mysql";
import { startServer } from "maishu-node-mvc";
import { AddressInfo } from "net";
import { authenticate, PermissionConfig } from "./service/filters/authenticate";
import Cookies = require("cookies");
import { TokenManager } from "./service/index";

interface Config {
    port: number,
    db: ConnectionConfig,
    permissions?: PermissionConfig
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
    startServer({
        port: config.port,
        proxy: {
            "/admin(\\S*)": { targetUrl: `http://127.0.0.1:${adminPort}$1`, headers: proxyHeaders },
            "/auth(\\S*)": { targetUrl: `${authServiceURL}$1`, }
        },
        authenticate: (req, res) => authenticate(req, res, config.permissions),
    })
}

/**
 * 
 * @param {http.IncomingMessage} req 
 */
async function proxyHeaders(req) {
    let cookies = new Cookies(req, null);
    let headers = {}
    let tokenText = req.headers['token'] || cookies.get("token");
    if (tokenText) {
        try {
            let token = await TokenManager.parse(tokenText);
            var obj = JSON.parse(token.content);
            headers = obj
        } catch (err) {
            console.error(err)
        }
    }

    let userId = headers["user_id"] || headers["user-id"];
    if (userId) {
        headers['SellerId'] = userId;
        headers['UserId'] = userId;
        headers['user-id'] = userId;
    }

    return headers
}

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
        "/service(/*)": { roleIds: [constants.anonymousRoleId] }
    }
});


