import path = require("path");
import { Settings } from "./types";
import { settings as globalSettings, stationPath, } from "./global";
import { roleIds } from "../gateway";
import { VirtualDirectory, startServer as startAdmin } from "maishu-node-mvc";
import { registerStation } from "./station";
import { getVirtualPaths } from "maishu-admin-scaffold";

export { Settings } from "./types";
// export { createDataContext } from "./data-context";
export { roleIds } from "./global";

export async function start(settings: Settings) {
    Object.assign(globalSettings, settings)

    // await createDatabaseIfNotExists(settings.db, initDatabase);

    let permissions: any = {};
    permissions[`${stationPath}*`] = {
        roleIds: [roleIds.admin, roleIds.anonymous],
    };

    let station: any = {
        path: stationPath,
        ip: "127.0.0.1",
        port: settings.port
        // gateway: settings.gateway,
        // permissions
    }
    registerStation(settings.gateway, station, permissions);
    let virtualPaths = getVirtualPaths("static", path.join(__dirname, "static"));
    virtualPaths = Object.assign(virtualPaths, settings.virtualPaths || {});
    return startAdmin({
        port: settings.port,
        // rootDirectory: __dirname,
        // rootDirectory: new VirtualDirectory(__dirname),
        virtualPaths: virtualPaths,
        websiteDirectory: __dirname,
        // station: {
        //     path: stationPath,
        //     gateway: settings.gateway,
        //     permissions
        // }
    })
}

