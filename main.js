"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gateway_1 = require("./gateway");
const index_1 = require("./index");
//===========================================
// 目标主机，服务所在的主机
const target_host = '127.0.0.1';
const gatewayPort = 2857;
const gateway = `127.0.0.1:${gatewayPort}`;
const permissionStationPort = gatewayPort + 100;
const portalStationPort = gatewayPort + 200;
//===========================================
let gatewayStationSettings = {
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
        "/": { roleIds: [gateway_1.roleIds.anonymous] },
        "/socket.io/*": { roleIds: [gateway_1.roleIds.anonymous] },
        "/socket*": { roleIds: [gateway_1.roleIds.anonymous] },
        "*.js": { roleIds: [gateway_1.roleIds.anonymous] },
        "*.html": { roleIds: [gateway_1.roleIds.anonymous] },
        "*.css": { roleIds: [gateway_1.roleIds.anonymous] },
        "*.less": { roleIds: [gateway_1.roleIds.anonymous] },
        "*.jpg": { roleIds: [gateway_1.roleIds.anonymous] },
        "*.png": { roleIds: [gateway_1.roleIds.anonymous] },
        "*.woff": { roleIds: [gateway_1.roleIds.anonymous] },
        "*.map": { roleIds: [gateway_1.roleIds.anonymous] },
        "/favicon.ico": { roleIds: [gateway_1.roleIds.anonymous] },
        "/auth/user/login": { roleIds: [gateway_1.roleIds.anonymous] },
        "/auth/station/list": { roleIds: [gateway_1.roleIds.anonymous] },
        "/auth/station/register": { roleIds: [gateway_1.roleIds.anonymous] },
        "/AdminMember/*": { roleIds: [gateway_1.roleIds.anonymous] },
        "/UserMember/*": { roleIds: [gateway_1.roleIds.anonymous] },
    },
};
let permissionStationSettings = {
    port: permissionStationPort,
    gateway,
    db: {
        user: "root",
        password: "81263",
        database: "node_auth_permission",
        host: "localhost",
        port: 3306
    },
};
let portalStationSettings = {
    port: portalStationPort,
    gateway,
};
index_1.start({
    gatewaySettings: gatewayStationSettings,
    permissionSettings: permissionStationSettings,
    portalSettings: portalStationSettings,
});
