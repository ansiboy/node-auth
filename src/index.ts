import { start as startAdmin } from "./admin";
import { start as startService, constants } from "./service";
import { ConnectionConfig } from "mysql";
import { startServer } from "maishu-node-mvc";
import { AddressInfo } from "net";
import { authenticate, PermissionConfig } from "./service/filters/authenticate";

interface Config {
    port: number,
    db: ConnectionConfig,
    permissions?: PermissionConfig
}

export function start(config: Config) {
    let { server: serviceServer } = startService({ port: 0, db: config.db })
    let servicePort = (serviceServer.address() as AddressInfo).port;

    let authServiceURL = `http://127.0.0.1:${servicePort}`
    let { server: adminServer } = startAdmin({ port: 0, authServiceURL })

    let adminPort = (adminServer.address() as AddressInfo).port;
    console.log(`${adminPort} ${servicePort}`)
    startServer({
        port: config.port,
        proxy: {
            "/admin(\\S*)": `http://127.0.0.1:${adminPort}$1`,
            "/auth(\\S*)": `${authServiceURL}$1`
        },
        authenticate: (req, res) => authenticate(req, res, config.permissions),
    })
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
