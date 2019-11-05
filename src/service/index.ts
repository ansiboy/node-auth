import { startServer, Config, ActionResult } from 'maishu-node-mvc';
import path = require('path');
import { ConnectionConfig } from 'mysql';
import { PermissionConfig } from './filters/authenticate';
import { errors } from './errors';
import { AuthDataContext } from './data-context';
import * as http from "http";
import { g } from './global';

export { TokenManager, getToken } from "./token";

export interface Settings {
    port: number,
    db: ConnectionConfig,
    permissions?: PermissionConfig,
    /** 用于初始化数据库数据 */
    initDatabase?: (dc: AuthDataContext) => Promise<any>,
    actionFilters?: ((req: http.IncomingMessage, res: http.ServerResponse) => Promise<ActionResult | null>)[];
    headers?: { [name: string]: string; },
    virtualPaths?: Config["virtualPaths"],
    logLevel?: (typeof g)["logLevel"],
}

export { constants } from './common';
export function start(settings: Settings) {

    if (!settings)
        throw errors.argumentNull("options");

    if (!settings.db)
        throw errors.argumentFieldNull("db", "options");

    g.authConn = settings.db;
    let ctrl_dir = [path.join(__dirname, 'controllers')];

    return startServer({
        port: settings.port,
        controllerDirectory: ctrl_dir,
    })
}

