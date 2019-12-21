import { start as startAdmin, Settings as BaseSettings } from "maishu-chitu-admin";
import path = require("path");
import { stationPath, permissions, ServerContextData } from "./website-config";


type InnerSettings = Pick<BaseSettings, "rootDirectory" | "station" | "serverContextData">;
export type Settings = Pick<BaseSettings, Exclude<keyof BaseSettings, keyof InnerSettings>> & {
    port: number,
    gateway: string,
    indexPage?: string,
    virtualPaths?: { [path: string]: string },
    mode?: "development" | "production"
}

export function start(settings: Settings) {

    let serverContextData: ServerContextData = {
        indexPage: settings.indexPage
    }
    let innerSettings: InnerSettings = {
        rootDirectory: __dirname,
        station: {
            gateway: settings.gateway,
            path: stationPath,
            permissions
        },
        serverContextData
    }
    startAdmin(Object.assign(settings, innerSettings));
}


