import { start as startAdmin } from "maishu-chitu-admin";
import path = require("path");
import { stationPath, permissions, ServerContextData } from "./website-config";

export type Settings = {
    port: number,
    gateway: string,
    indexPage?: string,
    virtualPaths?: { [path: string]: string }
}

export function start(settings: Settings) {

    startAdmin({
        port: settings.port,
        rootDirectory: __dirname,
        virtualPaths: settings.virtualPaths,
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


