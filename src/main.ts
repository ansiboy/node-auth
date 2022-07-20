import { Settings as GatewaySettings, roleIds } from "./gateway";
import { Settings as PermissionSettings } from "./user";
import { start } from "./index";
import path = require("path");
import { Config, loadConfig } from "./config";
import { settings as globalSettings, } from "./user/global";

type MyConfig = Config & {
    shopServiceStation: string,
    imageStation: string,
    fileStation: string,
    payStation: string,
    emailStation: string,
    seoStation: string,
    builderStation: string,
    builderStation2: string,
    builderStation3: string,
    storeStation: string,
    merchantStation: string,
    messageStation: string,
    portalStation: string,
    portal2Station: string,
    freightStation: string,
    editorStation: string,
};

class ConfigFieldNullError extends Error {
    constructor(field: keyof MyConfig) {
        super(`Config '${field}' field is null or empty.`)
    }

}

loadConfig().then((config: MyConfig) => {

    if (!config.shopServiceStation)
        throw new ConfigFieldNullError("shopServiceStation");

    if (!config.payStation)
        throw new ConfigFieldNullError("payStation");

    if (!config.emailStation)
        throw new ConfigFieldNullError("emailStation");

    globalSettings.db = config.db.user;

    //===========================================
    // 目标主机，服务所在的主机
    // const target_host = '127.0.0.1';
    const gatewayPort = config.gatewayPort;
    // const gateway = `127.0.0.1:${gatewayPort}`;
    const userStationPort = globalSettings.port;//gatewayPort + 1;
    const target_host = config.shopServiceStation;
    // const imageStation = "127.0.0.1:2863";
    const imageStation = config.imageStation;
    const portalStation = config.portalStation;
    const portal2Station = config.portal2Station;

    //===========================================
    let gatewayStationSettings: GatewaySettings = {
        port: gatewayPort,
        db: config.db.gateway,
        logLevel: "all",
        proxy: {
            '^/AdminSite/(\\S+)': `http://${target_host}:9000/Admin/$1`,
            '^/AdminStock/(\\S+)': `http://${target_host}:9005/Admin/$1`,
            '^/AdminShop/(\\S+)': `http://${target_host}:9010/Admin/$1`,
            '^/AdminMember/(\\S+)': `http://${target_host}:9020/Admin/$1`,
            '^/AdminWeiXin/(\\S+)': `http://${target_host}:9030/Admin/$1`,
            '^/AdminAccount/(\\S+)': `http://${target_host}:9035/Admin/$1`,
            '^/AdminStatistics/(\\S+)': `http://${target_host}:9050/Admin/$1`,
            '^/AdminERP/(\\S+)': `http://${target_host}:9060/Admin/$1`,
            '^/UserSite/(\\S+)': `http://${target_host}:9000/User/$1`,
            '^/UserStock/(\\S+)': `http://${target_host}:9005/User/$1`,
            '^/UserShop/(\\S+)': `http://${target_host}:9010/User/$1`,
            '^/UserMember/(\\S+)': `http://${target_host}:9020/User/$1`,
            '^/UserWeiXin/(\\S+)': `http://${target_host}:9030/User/$1`,
            '^/UserAccount/(\\S+)': `http://${target_host}:9035/User/$1`,

            '^/pc-build/(\\S+)': `http://${target_host}:5216/$1`,

            '^/pay/(\\S*)': `http://${config.payStation}/$1`,

            // 邮件
            '^/email/(\\S*)': `http://${config.emailStation}/$1`,
            '^/admin-api/email/(\\S*)': `http://${config.emailStation}/admin-api/$1`,
            '^/anon-api/email/(\\S*)': `http://${config.emailStation}/anon-api/$1`,

            // 运费
            '^/admin-api/freight/(\\S*)': `http://${config.freightStation}/admin-api/$1`,
            '^/anon-api/freight/(\\S*)': `http://${config.freightStation}/anon-api/$1`,

            // 前端门户
            "^/portal/(\\S+)": `http://${portalStation}/$1`,
            '^/admin-api/portal/(\\S*)': `http://${portalStation}/admin-api/$1`,
            '^/user-api/portal/(\\S*)': `http://${portalStation}/user-api/$1`,
            "^/rewrite/(\\S+)": `http://${portalStation}/$1`,
            '^/admin-api/rewrite/(\\S*)': `http://${portalStation}/admin-api/$1`,
            '^/user-api/rewrite/(\\S*)': `http://${portalStation}/user-api/$1`,

            '^/admin-api/portal2/(\\S*)': `http://${portal2Station}/admin-api/$1`,

            // 用户
            "^/user/(\\S+)": `http://${target_host}:${userStationPort}/$1`,
            '^/user-api/user/(\\S*)': `http://127.0.0.1:${userStationPort}/user-api/$1`,
            "^/admin-api/user/(\\S*)": `http://127.0.0.1:${userStationPort}/admin-api/$1`,
            '^/anon-api/user/(\\S*)': `http://127.0.0.1:${userStationPort}/anon-api/$1`,

            // "^/user-api/auth/(\\S*)": `http://127.0.0.1:${gatewayPort}/auth/user-api/$1`,
            // "^/admin-api/auth/(\\S*)": `http://127.0.0.1:${gatewayPort}/auth/admin-api/$1`,

            // 图片
            "^/admin-api/image/(\\S*)": `http://${imageStation}/admin-api/$1`,
            "^/user-api/image/(\\S*)": `http://${imageStation}/user-api/$1`,
            "^/Images/(\\S+)": `http://${imageStation}/Images/$1`,
            "^/image/(\\S*)": `http://${imageStation}/$1`,

            // 文件
            "^/file/(\\S+)": `http://${config.fileStation}/$1`,
            "^/admin-api/file/(\\S*)": `http://${config.fileStation}/admin-api/$1`,
            "^/user-api/file/(\\S*)": `http://${config.fileStation}/user-api/$1`,
            "^/anon-api/file/(\\S*)": `http://${config.fileStation}/anon-api/$1`,

            // 建站
            '^/site/(\\S*)': `http://${config.builderStation}/$1`,
            '^/admin-api/site/(\\S*)': `http://${config.builderStation}/admin-api/$1`,

            '^/site2/(\\S*)': `http://${config.builderStation2}/$1`,
            '^/admin-api/site2/(\\S*)': `http://${config.builderStation2}/admin-api/$1`,
            '^/user-api/site2/(\\S*)': `http://${config.builderStation2}/user-api/$1`,

            '^/site3(/\\S*)': `http://${config.builderStation3}$1`,
            '^/admin-api/site3/(\\S*)': `http://${config.builderStation3}/admin-api/$1`,
            '^/user-api/site3/(\\S*)': `http://${config.builderStation3}/user-api/$1`,

            // 内容管理
            '^/editor/(\\S*)': `http://${config.editorStation}/$1`,
            '^/admin-api/editor/(\\S*)': `http://${config.editorStation}/admin-api/$1`,
            '^/user-api/editor/(\\S*)': `http://${config.editorStation}/user-api/$1`,

            // 其他
            '^/seo/(\\S*)': `http://${config.seoStation}/$1`,
            '^/store/(\\S*)': `http://${config.storeStation}/$1`,
            '^/merchant/(\\S*)': `http://${config.merchantStation}/$1`,
            '^/message/(\\S*)': `http://${config.messageStation}/$1`,
            '^/rewrite/(\\S*)': `http://${config.portalStation}/$1`,



        },
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': 'application-id, track-id, content-type, token, user-id, *'
        },
        permissions: {
            "\\S+.js$": { roleIds: [roleIds.anonymous] },
            "\\S+.html$": { roleIds: [roleIds.anonymous] },
            "\\S+.css$": { roleIds: [roleIds.anonymous] },
            "\\S+.gif$": { roleIds: [roleIds.anonymous] },
            "\\S+.jpg$": { roleIds: [roleIds.anonymous] },
            "\\S+.less$": { roleIds: [roleIds.anonymous] },
            "\\S+.map$": { roleIds: [roleIds.anonymous] },
            "\\S+.png$": { roleIds: [roleIds.anonymous] },
            "\\S+.woff$": { roleIds: [roleIds.anonymous] },
            "\\S+.woff2$": { roleIds: [roleIds.anonymous] },

            // TODO: 用户组设置
            "^/AdminAccount/\\S*": { roleIds: [roleIds.admin, roleIds.ZWAdmin] },
            "^/AdminMember/\\S*": { roleIds: [roleIds.admin, roleIds.ZWAdmin] },
            "^/AdminShop/\\S*": { roleIds: [roleIds.admin, roleIds.ZWAdmin] },
            "^/AdminWeiXin/\\S*": { roleIds: [roleIds.admin, roleIds.ZWAdmin] },
            "^/AdminStock/\\S*": { roleIds: [roleIds.admin, roleIds.ZWAdmin] },
            "^/AdminSite/\\S*": { roleIds: [roleIds.admin, roleIds.ZWAdmin] },
            "^/AdminStatistics/\\S*": { roleIds: [roleIds.admin, roleIds.ZWAdmin] },
            "^/AdminERP/\\S*": { roleIds: [roleIds.admin, roleIds.ZWAdmin] },

            "^/UserShop/\\S*": { roleIds: [roleIds.anonymous] },
            "^/UserStock/\\S*": { roleIds: [roleIds.anonymous] },
            "^/UserSite/\\S*": { roleIds: [roleIds.anonymous] },
            "^/image/\\S*": { roleIds: [roleIds.anonymous] },

            // "^/auth/\\S*": { roleIds: [roleIds.admin] },
            "^/user/\\S*": { roleIds: [roleIds.anonymous] },
            "^/merchant/website-config": { roleIds: [roleIds.anonymous] },
            "^/pay/\\S*": { roleIds: [roleIds.anonymous] },
            "^/email/\\S*": { roleIds: [roleIds.anonymous] },
            "^/seo/\\S*": { roleIds: [roleIds.anonymous] },
            "^/site3\\S*": { roleIds: [roleIds.anonymous] },
            "^/site/\\S*": { roleIds: [roleIds.anonymous] },

            "^/user-api/site3/page-data/\\S*": { roleIds: [roleIds.anonymous] },
            "^/user-api/site3/theme/getVariable": { roleIds: [roleIds.anonymous] },

            "^/store/\\S*": { roleIds: [roleIds.anonymous] },
            "^/merchant/\\S*": { roleIds: [roleIds.anonymous] },
            "^/message/\\S*": { roleIds: [roleIds.anonymous] },
            "^/admin-api/auth/menuItem/getRolePermission": { roleIds: [roleIds.anonymous] },

            "^/rewrite/api\\S*": { roleIds: [roleIds.admin, roleIds.ZWAdmin] },

            "^/auth/menuItem/getRolePermission": { roleIds: [roleIds.anonymous, roleIds.ZWAdmin] },
            "^/auth/\\S*": { roleIds: [roleIds.admin, roleIds.ZWAdmin] },

            "^/admin-api/freight/\\S*": { roleIds: [roleIds.admin, roleIds.ZWAdmin] },
            "^/anon-api/freight/\\S*": { roleIds: [roleIds.anonymous] },

            "^/user-api/user/user/\\S*": { roleIds: [roleIds.anonymous] },
            "^/user-api/\\S*": { roleIds: [roleIds.normalUser] },
            "^/admin-api/\\S*": { roleIds: [roleIds.admin, roleIds.ZWAdmin] },
            "^/anon-api/\\S*": { roleIds: [roleIds.anonymous] },

            "^/[a-zA-Z\\-]+/admin-api/\\S*": { roleIds: [roleIds.admin, roleIds.ZWAdmin] },
            "^/[a-zA-Z\\-]+/user-api/\\S*": { roleIds: [roleIds.normalUser] },

            "^/api/editor/admin-api/\\S*": { roleIds: [roleIds.admin, roleIds.ZWAdmin] },
        },
        virtualPaths: {
            "node_modules": path.join(__dirname, "../node_modules"),
        },

    }

    let userStationSettings: PermissionSettings = {
        port: userStationPort,
        gateway: `127.0.0.1:${gatewayPort}`,
        db: config.db.user,
        virtualPaths: {
            "node_modules": path.join(__dirname, "../node_modules"),
        }
    }


    start({
        gatewaySettings: gatewayStationSettings,
        userSettings: userStationSettings,
    })

})

