import { g, constants, tokenDataHeaderNames, tokenName } from "./global";
import { startServer, Settings as MVCSettings, getLogger } from "maishu-node-mvc";
import { Settings } from "./types";
import { authenticate } from "./filters/authenticate";
import { startSocketServer } from "./socket-server";
import { loginFilter } from "./filters/login-filter";
import Cookies = require("cookies");
import { PROJECT_NAME } from "../../chitu-admin/out/global";
import { TokenManager } from "./token";
import http = require("http");
import path = require("path");

export { socketMessages } from "./socket-server";
export { LoginResult } from "./types";
export { createDatabaseIfNotExists } from "./data-context";

export let roleIds = {
    adminRoleId: constants.adminRoleId,
    anonymousRoleId: constants.anonymousRoleId,
}

export { statusCodes } from "./status-codes";
export { tokenDataHeaderNames } from "./global";

export function start(settings: Settings) {

    console.assert(settings.port != null);

    g.settings = settings;

    let proxy: MVCSettings["proxy"] = {};

    settings.proxy = settings.proxy || {};
    for (let key in settings.proxy) {
        proxy[key] = { targetUrl: settings.proxy[key], headers: proxyHeader }
    }
    let requestFilters = settings.requestFilters || [];
    requestFilters.unshift(loginFilter);

    settings.permissions = settings.permissions || {};
    settings.permissions[`/${constants.controllerPathRoot}/*`] = { roleIds: [roleIds.anonymousRoleId] };
    settings.permissions["/favicon.ico"] = { roleIds: [roleIds.anonymousRoleId] };

    settings.virtualPaths = settings.virtualPaths || {};
    settings.virtualPaths["node_modules"] = path.join(__dirname, "node_modules");

    let r = startServer({
        proxy, requestFilters,
        headers: settings.headers,
        authenticate: (req, res) => authenticate(req, res, settings.permissions),
        controllerDirectory: path.join(__dirname, "controllers"),
        staticRootDirectory: path.join(__dirname, "static"),
        virtualPaths: settings.virtualPaths,
    })

    startSocketServer(r.server);
    r.server.listen(settings.port);

    g.stationInfos.add(stations => {
        for (let i = 0; i < stations.length; i++) {
            let key = `${stations[i].path}(\\S*)`;
            let targetUrl = `http://${stations[i].ip}:${stations[i].port}/$1`;
            if (!proxy[key]) {
                proxy[key] = targetUrl;
            }

            if (stations[i].permissions) {
                Object.assign(settings.permissions, stations[i].permissions);
            }
        }
    })
}


async function proxyHeader(req: http.IncomingMessage) {
    let cookies = new Cookies(req, null);
    let header = {}

    let logger = getLogger(`${PROJECT_NAME} ${proxyHeader.name}`);
    let tokenText = req.headers[tokenName] as string || cookies.get(tokenName);
    if (tokenText) {
        logger.warn(`Token text is ${tokenText}`);
        try {
            let token = await TokenManager.parse(tokenText);
            header[tokenDataHeaderNames.userId] = token.user_id;
            header[tokenDataHeaderNames.roleIds] = token.role_ids || "";

        } catch (err) {
            console.error(err)
        }
    }
    else {
        logger.warn(`Token text is empty.`);
    }

    return header
}

