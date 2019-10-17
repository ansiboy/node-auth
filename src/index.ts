import { start as startAdminServer } from "./admin";
import { start as startServiceServer, constants } from "./service";
import { ConnectionConfig } from "mysql";
import { startServer, Config as MVCConfig } from "maishu-node-mvc";
import { authenticate, PermissionConfig } from "./service/filters/authenticate";
import { getToken } from "./service/index";

export { TokenManager, constants, getToken } from "./service/index";
export { createDataContext, AuthDataContext } from "./service/data-context";
export * from "./service/entities";

interface Settings {
    port: number,
    db: ConnectionConfig,
    permissions?: PermissionConfig,
    proxy?: MVCConfig["proxy"],
    headers?: MVCConfig["headers"],
    actionFilters?: MVCConfig["actionFilters"]
}

export function start(settings: Settings) {

    console.assert(settings.port != null);

    let servicePort = settings.port + 100;
    let adminPort = settings.port + 200;
    let authServiceURL = `http://127.0.0.1:${servicePort}`

    startServiceServer({ port: servicePort, db: settings.db })
    startAdminServer({ port: adminPort, authServiceURL })

    let proxy = Object.assign(settings.proxy || {}, {
        "/admin(\\S*)": { targetUrl: `http://127.0.0.1:${adminPort}$1`, headers: proxyHeaders },
        "/auth(\\S*)": { targetUrl: `${authServiceURL}$1`, headers: proxyHeaders }
    } as MVCConfig["proxy"])

    startServer({
        port: settings.port, proxy,
        headers: settings.headers,
        authenticate: (req, res) => authenticate(req, res, settings.permissions),
        actionFilters: [
            ...(settings.actionFilters || [])
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