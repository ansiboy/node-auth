import { g, constants, tokenDataHeaderNames, TOKEN_NAME } from "./global";
import { Settings as MVCSettings, getLogger, ProxyProcessor } from "maishu-node-mvc";
import { Settings } from "./types";
import { startSocketServer } from "./socket-server";
import Cookies = require("maishu-cookies");
import { TokenManager } from "./token";
import http = require("http");
import path = require("path");
import { roleIds } from "./global"
import { start as startAdmin } from "maishu-chitu-admin";
import websiteConfig from "./website-config";
import { AuthenticateRequestProcessor } from "./request-processors/authenticate";
import { loginTransform } from "./content-transforms/login";
export { socketMessages } from "./socket-server";
export { LoginResult, Settings } from "./types";

export { statusCodes } from "./status-codes";
export { tokenDataHeaderNames, roleIds, userIds, g } from "./global";
export let stationPath = `/${constants.controllerPathRoot}/`;

export async function start(settings: Settings) {

    console.assert(settings.port != null);

    g.settings = settings;

    let proxy: MVCSettings["proxy"] = {};
    settings.proxy = settings.proxy || {};
    for (let key in settings.proxy) {
        proxy[key] = {
            targetUrl: settings.proxy[key], headers: (args) => proxyHeader(args.req),
        }
    }

    settings.permissions = settings.permissions || {};
    settings.permissions[`/${constants.controllerPathRoot}/*`] = { roleIds: [roleIds.anonymous] };
    settings.permissions["/favicon.ico"] = { roleIds: [roleIds.anonymous] };

    let r = await startAdmin({
        proxy,
        headers: settings.headers,
        virtualPaths: settings.virtualPaths,
        bindIP: settings.bindIP,
        port: settings.port,
        rootPhysicalPath: __dirname,
        websiteConfig: Object.assign(websiteConfig, settings.websiteConfig || {}),
    })

    r.contentTransforms.unshift(loginTransform);


    startSocketServer(r.source);
    // let staticDirectory = r.root.findDirectory("/static");
    // console.assert(staticDirectory != null);
    // r.websiteDirectory.setPath("/content", path.join(__dirname, "../../content"));


    g.stationInfos.add(stations => {

        let proxyProcessor = r.requestProcessors.filter(o => o instanceof ProxyProcessor)[0] as ProxyProcessor;
        for (let i = 0; i < stations.length; i++) {
            let key = `^${stations[i].path}(\\S*)`;
            let targetUrl = `http://${stations[i].ip}:${stations[i].port}/$1`;
            if (!proxy[key]) {
                proxy[key] = {
                    targetUrl, headers: (args) => proxyHeader(args.req),
                    //  pipe: proxyPipe
                };
            }

            proxyProcessor.proxyTargets[key] = { targetUrl, headers: (args) => proxyHeader(args.req) };

            if (stations[i].permissions) {
                Object.assign(settings.permissions, stations[i].permissions);
            }
        }
    })

    let authenticateProcessor = new AuthenticateRequestProcessor(settings.permissions);
    r.requestProcessors.unshift(authenticateProcessor);

    return r;
}

async function proxyHeader(req: http.IncomingMessage) {
    let cookies = new Cookies(req, null);
    let header = {}

    let logger = getLogger(`${constants.projectName} ${proxyHeader.name}`);
    let tokenText = req.headers[TOKEN_NAME] as string || cookies.get(TOKEN_NAME);

    if (!tokenText) {
        logger.warn(`Token text is empty.`);
        return header;
    }

    logger.info(`Token text is ${tokenText}`);
    let token = await TokenManager.parse(tokenText);
    if (!token) {
        logger.warn(`Token data '${tokenText}' is not exits.`);
        return header;
    }

    header[tokenDataHeaderNames.userId] = token.user_id;

    return header
}


