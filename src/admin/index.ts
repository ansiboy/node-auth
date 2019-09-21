import { start as startAdmin } from "maishu-chitu-admin";
import path = require("path");

export interface Config {
    port: number
}

export function start(config: Config) {
    return startAdmin({
        port: config.port,
        staticRootDirectory: path.join(__dirname, "static"),
        controllerPath: path.join(__dirname, "controllers"),
    })
}