import { g, constants, HeaderNames, TOKEN_NAME } from "./global";
import { Settings as MVCSettings, getLogger, ProxyProcessor, StaticFileProcessor } from "maishu-node-mvc";
import { Settings } from "./types";
import Cookies = require("maishu-cookies");
import { TokenManager } from "./token";
import http = require("http");
import { roleIds } from "./global"
import { startServer as startAdmin } from "maishu-node-mvc";
import { AuthenticateRequestProcessor } from "./request-processors/authenticate";
import { loginTransform } from "./content-transforms/login";
import { getVirtualPaths } from "maishu-admin-scaffold";
import * as path from "path";
import { ProxyItem } from "maishu-node-web-server";
import { errors } from "./errors";
import { getApplicationIdById } from "./common";
// import { getApplicationIdFromRequest } from "./common";


export async function start(settings: Settings) {

    console.assert(settings.port != null);

    g.settings = settings;

    let proxy: MVCSettings["proxy"] = {};
    settings.proxy = settings.proxy || {};
    for (let key in settings.proxy) {
        if (typeof settings.proxy[key] == "string") {
            proxy[key] = {
                targetUrl: settings.proxy[key] as string, headers: (args) => proxyHeader(args.req),
            }
        }
        else {
            proxy[key] = settings.port[key];
            (proxy[key] as ProxyItem).headers = (args) => proxyHeader(args.req);
        }
    }

    settings.permissions = settings.permissions || {};
    settings.permissions["/favicon.ico"] = { roleIds: [roleIds.anonymous] };
    settings.permissions["/websiteConfig"] = { roleIds: [roleIds.anonymous] };
    let virtualPaths = getVirtualPaths("static", path.join(__dirname, "static"));
    Object.assign(virtualPaths, settings.virtualPaths || {});

    let r = startAdmin({
        proxy,
        virtualPaths,
        bindIP: settings.bindIP,
        port: settings.port,
        headers: settings.headers,
        websiteDirectory: __dirname,
    }, "mvc");

    r.contentTransforms.unshift(loginTransform);

    let staticProcessor = r.requestProcessors.find(StaticFileProcessor);
    staticProcessor.contentTypes[".woff2"] = "font/woff2";

    let proxyProcessor = r.requestProcessors.find(ProxyProcessor);
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
    r.requestProcessors.add(authenticateProcessor);

    return r;
}

// 将 Token 添加到 http headers
async function proxyHeader(req: http.IncomingMessage) {
    let cookies = new Cookies(req, null);
    let header = {}

    let logger = getLogger(`${constants.projectName} ${proxyHeader.name}`);
    let tokenText = req.headers[TOKEN_NAME] as string || cookies.get(TOKEN_NAME);

    if (tokenText && tokenText != "undefined") {
        logger.info(`Token text is ${tokenText}`);
        let token = await TokenManager.parse(tokenText);
        if (!token) {
            logger.warn(`Token data '${tokenText}' is not exits.`);
            throw errors.tokenNotExist(tokenText);
        }

        header[HeaderNames.userId] = token.user_id;
    }

    if (!req.headers[HeaderNames.applicationId]) {
        let host = req.headers["original-host"] as string || req.headers.host;
        let appId = await getApplicationIdById(host);
        if (appId) {
            header[HeaderNames.applicationId] = appId;
        }
    }
    return header
}


