import { start as startAdmin, PermissionConfig } from "maishu-chitu-admin";
import path = require("path");
import { Settings } from "./types";
import { settings as globalSettings, stationPath, } from "./global";
import { roleIds } from "../gateway";
import websiteConfig from "./website-config";

export { Settings } from "./types";
// export { createDataContext } from "./data-context";
export { roleIds } from "./global";

export async function start(settings: Settings) {
    Object.assign(globalSettings, settings)

    // await createDatabaseIfNotExists(settings.db, initDatabase);

    let permissions: PermissionConfig = {};
    permissions[`${stationPath}*`] = {
        roleIds: [roleIds.admin, roleIds.anonymous],
    };
    return startAdmin({
        port: settings.port,
        // rootDirectory: __dirname,
        rootPhysicalPath: __dirname,
        virtualPaths: settings.virtualPaths,
        station: {
            path: stationPath,
            gateway: settings.gateway,
            permissions
        },
        websiteConfig: Object.assign(websiteConfig, settings.websiteConfig || {})
    })
}