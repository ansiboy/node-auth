import { start as startAdminServer } from "./admin";
import { start as startServiceServer, constants } from "./service";
import { ConnectionConfig } from "mysql";
import { startServer, Config as MVCConfig } from "maishu-node-mvc";
import { authenticate } from "./service/filters/authenticate";
import { getToken } from "./service/index";
import { g, Settings } from "./service/global";
import { IncomingMessage } from "http";
import { PermissionConfig } from "maishu-chitu-admin";

export { TokenManager, constants, getToken } from "./service/index";
export { createDataContext, AuthDataContext } from "./service/data-context";
export * from "./service/entities";



export function start(settings: Settings) {

    console.assert(settings.port != null);

    g.settings = settings;
    let servicePort = settings.port + 100;
    let adminPort = settings.port + 200;
    let authServiceURL = `http://127.0.0.1:${servicePort}`

    startServiceServer({ port: servicePort, db: settings.db })
    startAdminServer({ port: adminPort, authServiceURL })

    let proxy = Object.assign(settings.proxy || {}, {
        "/admin/(\\S*)": { targetUrl: `http://127.0.0.1:${adminPort}/$1`, headers: proxyHeaders },
        "/auth/(\\S*)": { targetUrl: `${authServiceURL}/$1`, headers: proxyHeaders }
    } as MVCConfig["proxy"]);

    settings.permissions = settings.permissions || {};

    startServer({
        port: settings.port, proxy,
        headers: settings.headers,
        authenticate: (req, res) => authenticate(req, res, settings.permissions),
        actionFilters: [
            ...(settings.actionFilters || [])
        ],
    })

    g.stationInfos.add(stations => {
        for (let i = 0; i < stations.length; i++) {
            let key = `${stations[i].path}(\\S*)`;
            let targetUrl = `http://${stations[i].ip}:${stations[i].port}/$1`;
            if (!proxy[key]) {
                proxy[key] = targetUrl;
            }

            if (stations[i].permissions) {
                Object.assign(settings.permissions, stations[i].permissions);
            }
        }
    })
}

async function proxyHeaders(req: IncomingMessage) {
    let header = {};
    let token = await getToken(req);
    if (token != null) {
        var obj = JSON.parse(token.content);
        header = obj;
    }

    return header;
}