import { startServer, Config } from 'maishu-node-mvc';
import path = require('path');
import { setConnection } from './settings';
import { ConnectionConfig } from 'mysql';
import { authenticate } from './filters/authenticate';
import { errors } from './errors';
import { AuthDataContext, getDataContext } from './data-context';

interface Options {
    port: number,
    db: ConnectionConfig,
    bindIP?: string,
    proxy?: Config['proxy'],
    /** 控制器所在文件夹 */
    controllersDirectory?: string,
    /** 实体类所在文件夹 */
    entitiesDirectory?: string,
    /** 用于初始化数据库数据 */
    initDatabase?: (dc: AuthDataContext) => Promise<any>
}

export type StartOptions = Options;

export async function start(options: Options) {

    if (!options)
        throw errors.argumentNull("options");

    if (!options.db)
        throw errors.argumentFieldNull("db", "options");

    if (!options.port)
        throw errors.argumentFieldNull("port", "options");

    setConnection(options.db);

    if (options.initDatabase) {
        let dc = await getDataContext(true, options.entitiesDirectory);
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
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*'
        },
        proxy: options.proxy,
        authenticate: (req, res) => authenticate(req, res)
    })
}

