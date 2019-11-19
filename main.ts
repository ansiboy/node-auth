import { Settings as GatewaySettings, roleIds } from "./gateway";
import { Settings as PermissionSettings } from "./permission";
import { Settings as PortalSettings } from "./portal";
import { start } from "./index";

//===========================================
// 目标主机，服务所在的主机
const target_host = '127.0.0.1';
const gatewayPort = 2857;
const gateway = `127.0.0.1:${gatewayPort}`;
const permissionStationPort = gatewayPort + 100;
const portalStationPort = gatewayPort + 200;
//===========================================
let gatewayStationSettings: GatewaySettings = {
    port: gatewayPort,
    db: {
        user: "root",
        password: "81263",
        database: "node_auth_gateway",
        host: "localhost",
        port: 3306
    },
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
        "/image/(\\S*)": `http://127.0.0.1:48628/$1`
    },
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*'
    },
    permissions: {
        "/": { roleIds: [roleIds.anonymousRoleId] },
        "/socket.io/*": { roleIds: [roleIds.anonymousRoleId] },
        "/socket*": { roleIds: [roleIds.anonymousRoleId] },
        "*.js": { roleIds: [roleIds.anonymousRoleId] },
        "*.html": { roleIds: [roleIds.anonymousRoleId] },
        "*.css": { roleIds: [roleIds.anonymousRoleId] },
        "*.less": { roleIds: [roleIds.anonymousRoleId] },
        "*.jpg": { roleIds: [roleIds.anonymousRoleId] },
        "*.png": { roleIds: [roleIds.anonymousRoleId] },
        "*.woff": { roleIds: [roleIds.anonymousRoleId] },
        "*.map": { roleIds: [roleIds.anonymousRoleId] },

        "/favicon.ico": { roleIds: [roleIds.anonymousRoleId] },
        "/auth/user/login": { roleIds: [roleIds.anonymousRoleId] },

        "/auth/station/list": { roleIds: [roleIds.anonymousRoleId] },
        "/auth/station/register": { roleIds: [roleIds.anonymousRoleId] },

        "/AdminMember/*": { roleIds: [roleIds.adminRoleId] },
        "/UserMember/*": { roleIds: [roleIds.adminRoleId] },
    },

}

let permissionStationSettings: PermissionSettings = {
    port: permissionStationPort,
    gateway,
    db: {
        user: "root",
        password: "81263",
        database: "node_auth_permission",
        host: "localhost",
        port: 3306
    },
}

let portalStationSettings: PortalSettings = {
    port: portalStationPort,
    gateway,
}

start({
    gatewaySettings: gatewayStationSettings,
    permissionSettings: permissionStationSettings,
    portalSettings: portalStationSettings,
})
