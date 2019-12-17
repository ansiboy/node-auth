import { start as startAdmin } from "maishu-chitu-admin";
import path = require("path");
import { stationPath, permissions } from "./website-config";

export type Settings = {
    port: number,
    gateway: string,
    indexPage?: string,
}

export function start(settings: Settings) {

    startAdmin({
        port: settings.port,
        rootDirectory: __dirname,
        virtualPaths: {
            node_modules: path.join(__dirname, "../node_modules"),
        },
        station: {
            gateway: settings.gateway,
            path: stationPath,
            permissions
        },
        serverContextData: {
            indexPage: settings.indexPage
        } as ServerContextData
    })
}

