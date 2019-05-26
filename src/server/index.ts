import { startServer } from 'maishu-node-mvc'
import path = require('path')

export type DatabaseConfig = {
    username: string,
    password: string,
    name: string,
    host: string,
    port: number
}

interface Options {
    port: number
    dbConfig: DatabaseConfig
}

export function start(options: Options) {
    startServer({
        port: options.port, rootPath: __dirname,
        controllerDirectory: path.join(__dirname, 'controllers')
    })
}