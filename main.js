"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let gatewayStationSettings = {
    "port": 2857,
    "db": {
        "user": "root",
        "password": "81263",
        "database": "node_auth_gateway",
        "host": "localhost",
        "port": 3306
    }
};
let permissionStationSettings = {
    port: gatewayStationSettings.port + 100,
    db: {
        "user": "root",
        "password": "81263",
        "database": "node_auth_permission",
        "host": "localhost",
        "port": 3306
    }
};
const index_1 = require("./gateway/index");
require("./portal/index");
let { start: startPermission } = require("./permission/index");
//===========================================
// 目标主机，服务所在的主机
const target_host = '127.0.0.1';
//===========================================
index_1.start({
    port: gatewayStationSettings.port,
    logLevel: "all",
    db: gatewayStationSettings.db,
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
        "/merchant(\\S*)": `http://127.0.0.1:65271/$1`,
        "/image/(\\S*)": `http://127.0.0.1:48628/$1`
    },
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*'
    },
    permissions: {
        "/": { roleIds: [index_1.roleIds.anonymousRoleId] },
        "/socket.io/*": { roleIds: [index_1.roleIds.anonymousRoleId] },
        "/socket*": { roleIds: [index_1.roleIds.anonymousRoleId] },
        "*.js": { roleIds: [index_1.roleIds.anonymousRoleId] },
        "*.html": { roleIds: [index_1.roleIds.anonymousRoleId] },
        "*.css": { roleIds: [index_1.roleIds.anonymousRoleId] },
        "*.less": { roleIds: [index_1.roleIds.anonymousRoleId] },
        "*.jpg": { roleIds: [index_1.roleIds.anonymousRoleId] },
        "*.png": { roleIds: [index_1.roleIds.anonymousRoleId] },
        "*.woff": { roleIds: [index_1.roleIds.anonymousRoleId] },
        "*.map": { roleIds: [index_1.roleIds.anonymousRoleId] },
        // "/admin/(*)": { roleIds: [constants.anonymousRoleId] },
        // "/user/*": { roleIds: [constants.anonymousRoleId] },
        // "/designer/*": { roleIds: [constants.anonymousRoleId] },
        // "/shop/*": { roleIds: [constants.anonymousRoleId] },
        // "/chitu-admin/*": { roleIds: [constants.anonymousRoleId] },
        // "/auth/*": { roleIds: [constants.anonymousRoleId] },
        // "/UserMember/*": { roleIds: [constants.anonymousRoleId] },
        // "/UserShop/*": { roleIds: [constants.anonymousRoleId] },
        // "/Images/*": { roleIds: [constants.anonymousRoleId] },
        // "/merchant*": { roleIds: [constants.anonymousRoleId] },
        "/favicon.ico": { roleIds: [index_1.roleIds.anonymousRoleId] },
        "/auth/user/login": { roleIds: [index_1.roleIds.anonymousRoleId] },
        "/auth/station/list": { roleIds: [index_1.roleIds.anonymousRoleId] },
        "/auth/station/register": { roleIds: [index_1.roleIds.anonymousRoleId] },
        "/AdminMember/*": { roleIds: [index_1.roleIds.adminRoleId] },
        "/UserMember/*": { roleIds: [index_1.roleIds.adminRoleId] },
        "/portal/*": { roleIds: [index_1.roleIds.anonymousRoleId] }
    },
});
startPermission({
    port: permissionStationSettings.port,
    db: permissionStationSettings.db
});
