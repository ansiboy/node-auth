import { startServer, Config } from 'maishu-node-mvc';
import path = require('path');
import { setConnection } from './settings';
import { ConnectionConfig } from 'mysql';
import { authenticate } from './filters/authenticate';
import { errors } from './errors';
import { AuthDataContext, getDataContext } from './dataContext';

interface Options {
    port: number,
    db: ConnectionConfig,
    proxy?: Config['proxy'],
    backendControllers?: string,
}

interface InitArguments {
    dc: AuthDataContext,
}

export type StartOptions = Options;

export async function start(options: Options, initFunc?: (args: InitArguments) => Promise<any>) {

    if (!options)
        throw errors.argumentNull("options");

    if (!options.db)
        throw errors.argumentFieldNull("db", "options");

    if (!options.port)
        throw errors.argumentFieldNull("port", "options");

    setConnection(options.db);

    if (initFunc) {
        let dc = await getDataContext();
        await initFunc({ dc });
    }

    let ctrl_dir = [path.join(__dirname, 'controllers')];
    if (options.backendControllers)
        ctrl_dir.push(options.backendControllers);

    startServer({
        port: options.port, rootPath: __dirname,
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

