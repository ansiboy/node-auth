import { startServer, Config, ActionResult } from 'maishu-node-mvc';
import path = require('path');
import { ConnectionConfig } from 'mysql';
import { authenticate, PermissionConfig } from './filters/authenticate';
import { errors } from './errors';
import { AuthDataContext, createDataContext } from './data-context';
import { createConnection, ConnectionOptions } from 'typeorm';
import { constants } from './common';
// import { setConnection } from './settings';
import * as http from "http";
import { g } from './global';

export { TokenManager, getToken } from "./token";

interface Options {
    port: number,
    db: ConnectionConfig,
    // bindIP?: string,
    // proxy?: Config['proxy'],
    /** 控制器所在文件夹 */
    // controllersDirectory?: string,
    /** 实体类所在文件夹 */
    // entitiesDirectory?: string,
    permissions?: PermissionConfig,
    /** 用于初始化数据库数据 */
    initDatabase?: (dc: AuthDataContext) => Promise<any>,
    actionFilters?: ((req: http.IncomingMessage, res: http.ServerResponse) => Promise<ActionResult | null>)[];
    headers?: { [name: string]: string; },
    virtualPaths?: Config["virtualPaths"],
    logLevel?: (typeof g)["logLevel"],
}

export type StartOptions = Options;
export { constants } from './common';
export function start(options: Options) {

    if (!options)
        throw errors.argumentNull("options");

    if (!options.db)
        throw errors.argumentFieldNull("db", "options");

    g.authConn = options.db;
    let ctrl_dir = [path.join(__dirname, 'controllers')];

    return startServer({
        port: options.port,
        // bindIP: "127.0.0.1",
        controllerDirectory: ctrl_dir,

    })
}

