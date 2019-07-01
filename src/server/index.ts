import { startServer, Config } from 'maishu-node-mvc'
import path = require('path')
import { setConnection } from './settings';
import { ConnectionConfig } from 'mysql';

interface Options {
    port: number,
    db: ConnectionConfig,
    proxy: Config['proxy']
}

export function start(options: Options) {
    startServer({
        port: options.port, rootPath: __dirname,
        controllerDirectory: path.join(__dirname, 'controllers'),
        staticRootDirectory: path.join(__dirname, '../../out/client'),
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*'
        },
    })

    setConnection(options.db)
}