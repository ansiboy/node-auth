import { start as startAdmin } from "./admin";
import { start as startService } from "./service";
import { ConnectionConfig } from "mysql";
import { startServer } from "maishu-node-mvc";
import { AddressInfo } from "net";

interface Config {
    port: number,
    db: ConnectionConfig
}
export function start(config: Config) {
    let { server: adminServer } = startAdmin({ port: 0 })
    let { server: serviceServer } = startService({ port: 0, db: config.db })

    let adminPort = (adminServer.address() as AddressInfo).port;
    let servicePort = (serviceServer.address() as AddressInfo).port;

    startServer({
        port: config.port,
        proxy: {
            "/admin(\\S*)": `http://127.0.0.1:${adminPort}$1`,
            "/auth(\\S*)": `http://127.0.0.1:${servicePort}$1`
        }
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
    }
});
