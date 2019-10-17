import { start as startAdmin } from "./admin";
import { start as startServiceServer, constants } from "./service";
import { ConnectionConfig } from "mysql";
import { startServer, Config as MVCConfig } from "maishu-node-mvc";
import { AddressInfo } from "net";
import { authenticate, PermissionConfig } from "./service/filters/authenticate";
import { getToken } from "./service/index";

export { TokenManager, constants, getToken } from "./service/index";
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
    let { server: serviceServer } = startServiceServer({
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
            ...(args.actionFilters || [])
        ],
        
    })
}

async function proxyHeaders(req) {
    let header = {};
    let token = await getToken(req);
    if (token != null) {
        var obj = JSON.parse(token.content);
        header = obj;
    }

    return header;
}