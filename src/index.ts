import { startServer, Config } from 'maishu-node-mvc';
import path = require('path');
import { setConnection } from './settings';
import { ConnectionConfig } from "mysql";
import { initDatabase } from './dataContext';
import { checkPath } from './filters/checkPath';

interface Options {
    port: number,
    db: ConnectionConfig,
    proxy: Config['proxy']
}

export async function start(options: Options) {

    setConnection(options.db);

    await initDatabase();

    startServer({
        port: options.port, 
        controllerDirectory: path.join(__dirname, 'controllers'),
        staticRootDirectory: path.join(__dirname, 'static'),
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*'
        },
        actionFilters: [
            checkPath
        ]
    })
}

