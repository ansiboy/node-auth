import { startServer } from 'maishu-node-mvc';
import path = require('path');
import { errors } from './errors';
import { g, Settings } from './global';

export { TokenManager, getToken } from "./token";

export { constants } from './common';
export function start(settings: Settings) {

    if (!settings)
        throw errors.argumentNull("options");

    if (!settings.db)
        throw errors.argumentFieldNull("db", "options");

    g.authConn = settings.db;
    let ctrl_dir = [path.join(__dirname, 'controllers')];



    let r = startServer({
        // port: settings.port,
        controllerDirectory: ctrl_dir,
    })

    r.server.listen(settings.port);

    return r;
}

