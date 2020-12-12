import { Settings as GatewaySettings, roleIds } from "./gateway";
import { Settings as PermissionSettings } from "./user";
import { start } from "./index";
import path = require("path");
import config from "./config";
//===========================================
// 目标主机，服务所在的主机
// const target_host = '127.0.0.1';
const gatewayPort = 2857;
// const gateway = `127.0.0.1:${gatewayPort}`;
const permissionStationPort = gatewayPort + 100;

//===========================================
let gatewayStationSettings: GatewaySettings = {
    port: gatewayPort,
    db: config.db.gateway,
    logLevel: "all",
    proxy: {
    },
    headers: {
    },
    permissions: {
        "*.js": { roleIds: [roleIds.anonymous] },
        "*.html": { roleIds: [roleIds.anonymous] },
        "*.css": { roleIds: [roleIds.anonymous] },
        "*.less": { roleIds: [roleIds.anonymous] },
        "*.jpg": { roleIds: [roleIds.anonymous] },
        "*.png": { roleIds: [roleIds.anonymous] },
        "*.woff": { roleIds: [roleIds.anonymous] },
        "*.map": { roleIds: [roleIds.anonymous] },
    },
    virtualPaths: {
        "node_modules": path.join(__dirname, "../node_modules"),
    }
}

let permissionStationSettings: PermissionSettings = {
    port: permissionStationPort,
    gateway: `127.0.0.1:${gatewayPort}`,
    db: config.db.permission,
    virtualPaths: {
        "node_modules": path.join(__dirname, "../node_modules"),
    }
}


start({
    gatewaySettings: gatewayStationSettings,
    userSettings: permissionStationSettings,
})
