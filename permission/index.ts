import { start as startAdmin } from "maishu-chitu-admin";
import path = require("path");
import { Settings } from "./types";
import { settings as globalSettings, stationPath, gateway } from "./global";
import { roleIds } from "../gateway";

export { Settings } from "./types";

export function start(settings: Settings) {
    Object.assign(globalSettings, settings)
    return startAdmin({
        port: settings.port,
        rootDirectory: __dirname,
        virtualPaths: {
            "node_modules": path.join(__dirname, "node_modules")
        },
        station: {
            path: stationPath,
            gateway: gateway,
            permissions: {
                "/permission/*": { roleIds: [roleIds.adminRoleId, roleIds.anonymousRoleId] }
            }
        }
    })
}