import { Settings as GatewaySettings, roleIds } from "./gateway";
import { Settings as PermissionSettings } from "./user";
import { start } from "./index";
import path = require("path");
import { ConnectionOptions } from "maishu-node-data";
import config from "./config";
//===========================================
// 目标主机，服务所在的主机
const target_host = '127.0.0.1';
const gatewayPort = 2857;
const gateway = `127.0.0.1:${gatewayPort}`;
const permissionStationPort = gatewayPort + 100;

// const gatewayDB: ConnectionOptions = {
//     type: "mysql",
//     username: "root",
//     password: "81263",
//     database: "node_auth_gateway",
//     host: "localhost",
//     port: 3306
// };

// const permissionDB: ConnectionOptions = {
//     type: "mysql",
//     username: "root",
//     password: "81263",
//     database: "node_auth_permission",
//     host: "localhost",
//     port: 3306
// }

// const gatewayDB: ConnectionOptions = {
//     type: "sqlite",
//     database: "node_auth_gateway.db",
// };

// const permissionDB: ConnectionOptions = {
//     type: "sqlite",
//     database: "node_auth_permission.db",
// }


//===========================================
let gatewayStationSettings: GatewaySettings = {
    port: gatewayPort,
    db: config.db.gateway,
    logLevel: "all",
    proxy: {
        '/AdminSite/(\\S+)': `http://${target_host}:9000/Admin/$1`,
        '/AdminStock/(\\S+)': `http://${target_host}:9005/Admin/$1`,
        '/AdminShop/(\\S+)': `http://${target_host}:9010/Admin/$1`,
        '/AdminMember/(\\S+)': `http://${target_host}:9020/Admin/$1`,
        '/AdminWeiXin/(\\S+)': `http://${target_host}:9030/Admin/$1`,
        '/AdminAccount/(\\S+)': `http://${target_host}:9035/Admin/$1`,
        '/UserSite/(\\S+)': `http://${target_host}:9000/User/$1`,
        '/UserStock/(\\S+)': `http://${target_host}:9005/User/$1`,
        '/UserShop/(\\S+)': `http://${target_host}:9010/User/$1`,
        '/UserMember/(\\S+)': `http://${target_host}:9020/User/$1`,
        '/UserWeiXin/(\\S+)': `http://${target_host}:9030/User/$1`,
        '/UserAccount/(\\S+)': `http://${target_host}:9035/User/$1`,
        "^/Images/Editor/(\\S+)": "http://web.alinq.cn/store2/Images/Editor/$1",
        "/image/(\\S*)": `http://127.0.0.1:48628/$1`,
    },
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*'
    },
    permissions: {
        "/": { roleIds: [roleIds.anonymous] },
        "/socket.io/*": { roleIds: [roleIds.anonymous] },
        "/socket*": { roleIds: [roleIds.anonymous] },
        "*.js": { roleIds: [roleIds.anonymous] },
        "*.html": { roleIds: [roleIds.anonymous] },
        "*.css": { roleIds: [roleIds.anonymous] },
        "*.less": { roleIds: [roleIds.anonymous] },
        "*.jpg": { roleIds: [roleIds.anonymous] },
        "*.png": { roleIds: [roleIds.anonymous] },
        "*.woff": { roleIds: [roleIds.anonymous] },
        "*.map": { roleIds: [roleIds.anonymous] },

        "/favicon.ico": { roleIds: [roleIds.anonymous] },
        "/auth/user/login": { roleIds: [roleIds.anonymous] },

        "/auth/station/list": { roleIds: [roleIds.anonymous] },
        "/auth/station/register": { roleIds: [roleIds.anonymous] },

        "/AdminMember/*": { roleIds: [roleIds.anonymous] },
        "/UserMember/*": { roleIds: [roleIds.anonymous] },
        "/websiteConfig": { roleIds: [roleIds.anonymous] },
        "/clientFiles": { roleIds: [roleIds.anonymous] }
    },
    virtualPaths: {
        "node_modules": path.join(__dirname, "../node_modules")
    }
}

let permissionStationSettings: PermissionSettings = {
    port: permissionStationPort,
    gateway,
    db: config.db.permission,
    virtualPaths: {
        "node_modules": path.join(__dirname, "../node_modules")
    }
}


start({
    gatewaySettings: gatewayStationSettings,
    userSettings: permissionStationSettings,
})
