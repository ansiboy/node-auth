import { g, constants, tokenDataHeaderNames, TOKEN_NAME } from "./global";
import { Settings as MVCSettings, getLogger, ProxyProcessor, StaticFileProcessor } from "maishu-node-mvc";
import { Settings } from "./types";
import { startSocketServer } from "./socket-server";
import Cookies = require("maishu-cookies");
import { TokenManager } from "./token";
import http = require("http");
import { roleIds } from "./global"
import { start as startAdmin } from "maishu-chitu-admin";
import websiteConfig from "./website-config";
import { AuthenticateRequestProcessor } from "./request-processors/authenticate";
import { loginTransform } from "./content-transforms/login";
import { DataHelper } from "maishu-node-data";
import { AuthDataContext } from "./data-context";
import { StationController } from "./controllers/station";


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
    settings.permissions["/"] = { roleIds: [roleIds.anonymous] };
    settings.permissions["/websiteConfig"] = { roleIds: [roleIds.anonymous] };
    // settings.permissions["/clientFiles"] = { roleIds: [roleIds.anonymous] };

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

    let staticProcessor = r.requestProcessors.filter(o => o instanceof StaticFileProcessor)[0] as StaticFileProcessor;
    staticProcessor.contentTypes[".woff2"] = "font/woff2";

    let proxyProcessor = r.requestProcessors.filter(o => o instanceof ProxyProcessor)[0] as ProxyProcessor;
    console.assert(proxyProcessor != null, "ProxyProcessor is null.");

    g.stationInfos.add(stations => {
        for (let i = 0; i < stations.length; i++) {
            let key = `^${stations[i].path}(\\S*)`;
            let targetUrl = `http://${stations[i].ip}:${stations[i].port}/$1`;
            if (!proxy[key]) {
                proxy[key] = {
                    targetUrl, headers: (args) => proxyHeader(args.req),
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

    DataHelper.createDataContext(AuthDataContext, settings.db).then(dc => {
        return dc.stations.find();
    }).then(stations => {
        stations.forEach(s => {
            StationController.register(s);
        })
    })

    return r;
}

// 将 Token 添加到 http headers
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


