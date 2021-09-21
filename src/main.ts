import { Settings as GatewaySettings, roleIds } from "./gateway";
import { Settings as PermissionSettings } from "./user";
import { start } from "./index";
import path = require("path");
import { Config, loadConfig } from "./config";

type MyConfig = Config & {
    shopServiceStation: string,
    imageStation: string,
    payStation: string,
    emailStation: string,
    seoStation: string,
    builderStation: string,
    storeStation: string,
    merchantStation: string,
    messageStation: string,
    rewriteStation: string,
    freightStation: string,
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

    //===========================================
    // 目标主机，服务所在的主机
    // const target_host = '127.0.0.1';
    const gatewayPort = config.gatewayPort;
    // const gateway = `127.0.0.1:${gatewayPort}`;
    const userStationPort = gatewayPort + 1;
    const target_host = config.shopServiceStation;
    // const imageStation = "127.0.0.1:2863";
    const imageStation = config.imageStation;

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
            '^/UserSite/(\\S+)': `http://${target_host}:9000/User/$1`,
            '^/UserStock/(\\S+)': `http://${target_host}:9005/User/$1`,
            '^/UserShop/(\\S+)': `http://${target_host}:9010/User/$1`,
            '^/UserMember/(\\S+)': `http://${target_host}:9020/User/$1`,
            '^/UserWeiXin/(\\S+)': `http://${target_host}:9030/User/$1`,
            '^/UserAccount/(\\S+)': `http://${target_host}:9035/User/$1`,
            "^/Images/(\\S+)": `http://${imageStation}/Images/$1`,
            "^/image/(\\S+)": `http://${imageStation}/$1`,
            '^/pc-build/(\\S+)': `http://${target_host}:5216/$1`,

            // "^/user/(\\S+)": `http://${target_host}:${userStationPort}/$1`,
            '^/pay/(\\S*)': `http://${config.payStation}/$1`,
            '^/email/(\\S*)': `http://${config.emailStation}/$1`,
            '^/seo/(\\S*)': `http://${config.seoStation}/$1`,
            '^/site/(\\S*)': `http://${config.builderStation}/$1`,
            '^/store/(\\S*)': `http://${config.storeStation}/$1`,
            '^/merchant/(\\S*)': `http://${config.merchantStation}/$1`,
            '^/message/(\\S*)': `http://${config.messageStation}/$1`,
            '^/rewrite/(\\S*)': `http://${config.rewriteStation}/$1`,
            '^/freight/(\\S*)': `http://${config.freightStation}/freight/$1`
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*'
        },
        permissions: {
            "\\S+.js$": { roleIds: [roleIds.anonymous] },
            "\\S+.html$": { roleIds: [roleIds.anonymous] },
            "\\S+.css$": { roleIds: [roleIds.anonymous] },
            "\\S+.less$": { roleIds: [roleIds.anonymous] },
            "\\S+.jpg$": { roleIds: [roleIds.anonymous] },
            "\\S+.png$": { roleIds: [roleIds.anonymous] },
            "\\S+.woff$": { roleIds: [roleIds.anonymous] },
            "\\S+.map$": { roleIds: [roleIds.anonymous] },



            // TODO: 用户组设置
            "^/AdminAccount/\\S*": { roleIds: [roleIds.anonymous] },
            "^/AdminMember/\\S*": { roleIds: [roleIds.anonymous] },
            "^/AdminShop/\\S*": { roleIds: [roleIds.anonymous] },
            "^/AdminWeiXin/\\S*": { roleIds: [roleIds.anonymous] },
            "^/AdminStock/\\S*": { roleIds: [roleIds.anonymous] },
            "^/AdminSite/\\S*": { roleIds: [roleIds.anonymous] },

            "^/UserShop/\\S*": { roleIds: [roleIds.anonymous] },
            "^/UserStock/\\S*": { roleIds: [roleIds.anonymous] },
            "^/UserSite/\\S*": { roleIds: [roleIds.anonymous] },
            "^/image/\\S*": { roleIds: [roleIds.anonymous] },

            "^/auth/\\S*": { roleIds: [roleIds.anonymous] },
            "^/user/\\S*": { roleIds: [roleIds.anonymous] },
            "^/merchant/website-config": { roleIds: [roleIds.anonymous] },
            "^/pay/\\S*": { roleIds: [roleIds.anonymous] },
            "^/email/\\S*": { roleIds: [roleIds.anonymous] },
            "^/seo/\\S*": { roleIds: [roleIds.anonymous] },
            "^/site/\\S*": { roleIds: [roleIds.anonymous] },
            "^/store/\\S*": { roleIds: [roleIds.anonymous] },
            "^/merchant/\\S*": { roleIds: [roleIds.anonymous] },
            "^/message/\\S*": { roleIds: [roleIds.anonymous] },
        },
        virtualPaths: {
            "node_modules": path.join(__dirname, "../node_modules"),
        },
    }

    let permissionStationSettings: PermissionSettings = {
        port: userStationPort,
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

})

