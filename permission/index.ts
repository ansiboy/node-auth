import { start as startAdmin } from "maishu-chitu-admin";
import path = require("path");
import { Settings } from "./types";
import { settings as globalSettings, stationPath, gateway } from "./global";
import { roleIds, createDatabaseIfNotExists } from "../gateway";

export { Settings } from "./types";
export { createDataContext } from "./data-context";
export { roleIds } from "./global";

export async function start(settings: Settings) {
    Object.assign(globalSettings, settings)

    await createDatabaseIfNotExists(settings.db);

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
                "/permission/*": { roleIds: [roleIds.admin, roleIds.anonymous] }
            }
        }
    })
}