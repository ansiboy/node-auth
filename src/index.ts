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

interface Arguments {
    port: number,
    db: ConnectionConfig,
    permissions?: PermissionConfig,
    proxy?: MVCConfig["proxy"],
    headers?: MVCConfig["headers"],
    actionFilters?: MVCConfig["actionFilters"]
}

export function start(args: Arguments) {
    let { server: serviceServer } = startService({
        port: 0, db: args.db
    })
    let servicePort = (serviceServer.address() as AddressInfo).port;

    let authServiceURL = `http://127.0.0.1:${servicePort}`
    let { server: adminServer } = startAdmin({ port: 0, authServiceURL })

    let adminPort = (adminServer.address() as AddressInfo).port;
    console.log(`${adminPort} ${servicePort}`)

    let proxy = Object.assign(args.proxy || {}, {
        "/admin(\\S*)": { targetUrl: `http://127.0.0.1:${adminPort}$1`, headers: proxyHeaders },
        "/auth(\\S*)": { targetUrl: `${authServiceURL}$1`, headers: proxyHeaders }
    } as MVCConfig["proxy"])

    startServer({
        port: args.port, proxy,
        headers: args.headers,
        authenticate: (req, res) => authenticate(req, res, args.permissions),
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
            },
            ...(args.actionFilters || [])
        ]
    })
}

async function proxyHeaders(req) {
    let cookies = new Cookies(req, null);
    let header = {};
    let tokenText: string = req.headers['token'] || cookies.get("token");
    if (tokenText) {
        //============================================
        // token text 多了两个 "，要去除掉
        tokenText = tokenText.replace(/"/g, "");
        //============================================
        try {
            let token = await TokenManager.parse(tokenText);
            if (token != null) {
                var obj = JSON.parse(token.content);
                header = obj;
            }
        }
        catch (err) {
            console.error(err);
        }
    }
    return header;
}