import { startServer, Config, ActionResult } from 'maishu-node-mvc';
import path = require('path');
import { ConnectionConfig } from 'mysql';
import { authenticate } from './filters/authenticate';
import { errors } from './errors';
import { AuthDataContext, createDataContext } from './data-context';
import { createConnection, ConnectionOptions } from 'typeorm';
import { constants } from './common';
import { setConnection } from './settings';
import * as http from "http";

interface Options {
    port: number,
    db: ConnectionConfig,
    bindIP?: string,
    proxy?: Config['proxy'],
    /** 控制器所在文件夹 */
    controllersDirectory?: string,
    /** 实体类所在文件夹 */
    entitiesDirectory?: string,
    permissions?: { [path: string]: string[] }
    /** 用于初始化数据库数据 */
    initDatabase?: (dc: AuthDataContext) => Promise<any>,
    actionFilters?: ((req: http.IncomingMessage, res: http.ServerResponse) => Promise<ActionResult | null>)[];
    headers?: { [name: string]: string; }
}

export type StartOptions = Options;
export { constants } from './common';
export async function start(options: Options) {

    if (!options)
        throw errors.argumentNull("options");

    if (!options.db)
        throw errors.argumentFieldNull("db", "options");

    if (!options.port)
        throw errors.argumentFieldNull("port", "options");

    setConnection(options.db);
    let entities: string[] = [path.join(__dirname, "entities.js")]
    if (options.entitiesDirectory) {
        entities.push(path.join(options.entitiesDirectory, "*.js"));
    }

    let dbOptions: ConnectionOptions = {
        type: "mysql",
        host: options.db.host,
        port: options.db.port,
        username: options.db.user,
        password: options.db.password,
        database: options.db.database,
        synchronize: true,
        logging: false,
        connectTimeout: 3000,
        entities,
        name: constants.dbName
    }

    await createConnection(dbOptions)

    if (options.initDatabase) {
        let dc = await createDataContext();
        await options.initDatabase(dc);
    }

    let ctrl_dir = [path.join(__dirname, 'controllers')];
    if (options.controllersDirectory)
        ctrl_dir.push(options.controllersDirectory);

    startServer({
        port: options.port,
        bindIP: options.bindIP,
        controllerDirectory: ctrl_dir,
        staticRootDirectory: path.join(__dirname, '../../out/client'),
        headers: options.headers,
        proxy: options.proxy,
        authenticate: (req, res) => authenticate(req, res, options.permissions),
        actionFilters: options.actionFilters
    })
}

