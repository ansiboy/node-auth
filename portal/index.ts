import { start as startAdmin, PermissionConfig } from "maishu-chitu-admin";
import path = require("path");
import websiteConfig from "./website-config";
import { roleIds } from "../gateway";

export type Settings = {
    port: number,
    gateway: string,
}

export function start(settings: Settings) {

    let permissions: PermissionConfig = {};
    permissions[`${websiteConfig.stationPath}*`] = { roleIds: [roleIds.anonymous] };

    startAdmin({
        port: settings.port,
        rootDirectory: __dirname,
        virtualPaths: {
            node_modules: path.join(__dirname, "../node_modules"),
        },
        station: {
            gateway: settings.gateway,
            path: websiteConfig.stationPath,
            permissions
        }
    })
}

