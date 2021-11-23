import path = require("path");
import { ServerContextData, Settings } from "./types";
import { settings as globalSettings, stationPath, } from "./global";
import { roleIds } from "../gateway";
import { startServer as startAdmin } from "maishu-node-mvc";
import { registerStation, StationInfo } from "./station";
import { getVirtualPaths } from "maishu-admin-scaffold";

export { Settings } from "./types";
export { roleIds } from "./global";

export async function start(settings: Settings) {
    Object.assign(globalSettings, settings)

    // let permissions: any = {};
    // permissions[`${stationPath}*`] = {
    //     roleIds: [roleIds.admin, roleIds.anonymous],
    // };

    // let station: StationInfo = {
    //     path: stationPath,
    //     ip: "127.0.0.1",
    //     port: settings.port
    // }
    // registerStation(settings.gateway, station, permissions);
    let contextData: ServerContextData = { db: settings.db };
    let virtualPaths = getVirtualPaths("static", path.join(__dirname, "static"));
    virtualPaths = Object.assign(virtualPaths, settings.virtualPaths || {});
    return startAdmin({
        port: settings.port,
        virtualPaths: virtualPaths,
        websiteDirectory: __dirname,
        contextData
    })
}

