"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//===========================================
// 目标主机，服务所在的主机
const target_host = '127.0.0.1';
//===========================================
exports.bindIP = '0.0.0.0';
//===========================================
// 机器名称，用于集群，让客户端知道是哪台机器
exports.MACHINE_NAME = 'local-pc';
//===========================================
// 默认的 HTTP 头
exports.headers = [
    { name: 'Content-Type', value: 'application/json;charset=utf-8' },
    { name: 'gateway_machine', value: exports.MACHINE_NAME },
    // { name: 'Transfer-Encoding', value: 'identity' },
    // { name: 'Connection', value: 'close' },
    { name: 'Access-Control-Allow-Origin', value: '*' },
    { name: 'Access-Control-Allow-Methods', value: '*' },
    { name: 'Access-Control-Allow-Headers', value: '*' },
];
//===========================================
const APP_KEY = 'application-id';
const USER_TOKEN = 'token';
const STORE_KEY = 'store-key';
exports.allowHeaders = `${APP_KEY}, ${USER_TOKEN}, ${STORE_KEY}, content-type`;
exports.conn = {
    auth: { host: 'localhost', user: 'liuyunyuan', password: 'Xuan520Lv', database: 'node_auth2', port: 3306 },
};
exports.port = 2856;
exports.redirectInfos = {
    pathInfos: [
        // { rootDir: 'AdminSite', targetUrl: `http://${target_host}:9000/Admin` },
        // { rootDir: 'AdminStock', targetUrl: `http://${target_host}:9005/Admin` },
        // { rootDir: 'AdminShop', targetUrl: `http://${target_host}:9010/Admin` },
        // { rootDir: 'AdminMember', targetUrl: `http://${target_host}:9020/Admin` },
        // { rootDir: 'AdminWeiXin', targetUrl: `http://${target_host}:9030/Admin` },
        // { rootDir: 'AdminAccount', targetUrl: `http://${target_host}:9035/Admin` },
        // { rootDir: 'UserSite', targetUrl: `http://${target_host}:9000/User` },
        // { rootDir: 'UserStock', targetUrl: `http://${target_host}:9005/User` },
        // { rootDir: 'UserShop', targetUrl: `http://${target_host}:9010/User` },
        // { rootDir: 'UserMember', targetUrl: `http://${target_host}:9020/User` },
        // { rootDir: 'UserWeiXin', targetUrl: `http://${target_host}:9030/User` },
        // { rootDir: 'UserAccount', targetUrl: `http://${target_host}:9035/User` },
        { rootDir: 'app', targetUrl: `http://${target_host}:2893` },
        { rootDir: 'admin', targetUrl: `http://${target_host}:2894` },
        { rootDir: 'msg', targetUrl: `http://${target_host}:2895` },
        { rootDir: 'distributor', targetUrl: `http://${target_host}:2896` },
        { rootDir: 'tool', targetUrl: `http://${target_host}:2897` },
        { rootDir: 'image', targetUrl: `http://${target_host}:48628` },
    ]
};
exports.verifyCodeText = {
    default: '【百伦美】您的验证码是{0}',
};
//====================================
// 测试配置
/** 将 mobile 设为某个号码，则短信往该号码发，以方便测试 */
exports.test = {
    mobile: '18502146746',
    sendMessage: true,
};
//====================================
//# sourceMappingURL=settings.js.map