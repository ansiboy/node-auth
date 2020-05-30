import { g, constants, tokenDataHeaderNames, TOKEN_NAME, guid } from "./global";
import { startServer, Settings as MVCSettings, getLogger, ProxyPipe, VirtualDirectory } from "maishu-node-mvc";
import { Settings, LoginResult } from "./types";
import { authenticate } from "./filters/authenticate";
import { startSocketServer } from "./socket-server";
import Cookies = require("maishu-cookies");
import { TokenManager } from "./token";
import http = require("http");
import path = require("path");
import { initDatabase, createDataContext } from "./data-context";
import { roleIds } from "./global"
import { statusCodes } from "./status-codes";
import { TokenData } from "./entities";
import { createDatabaseIfNotExists } from "maishu-node-data";
export { socketMessages } from "./socket-server";
export { LoginResult, Settings } from "./types";



export { statusCodes } from "./status-codes";
export { tokenDataHeaderNames, roleIds, userIds } from "./global";
export let stationPath = `/${constants.controllerPathRoot}/`;

export async function start(settings: Settings) {

    console.assert(settings.port != null);

    g.settings = settings;

    await createDatabaseIfNotExists(settings.db, initDatabase);

    let proxyPipe: ProxyPipe = {
        async onResponse({ req, res }, data) {
            let r = await proxyResponseHandle(req, res, data);
            return r;
        }
    }

    let proxy: MVCSettings["proxy"] = {};
    settings.proxy = settings.proxy || {};
    for (let key in settings.proxy) {
        proxy[key] = {
            targetUrl: settings.proxy[key], headers: proxyHeader,
            pipe: proxyPipe
        }
    }

    settings.permissions = settings.permissions || {};
    settings.permissions[`/${constants.controllerPathRoot}/*`] = { roleIds: [roleIds.anonymous] };
    settings.permissions["/favicon.ico"] = { roleIds: [roleIds.anonymous] };

    let r = startServer({
        proxy,
        headers: settings.headers,
        authenticate: (req, res) => authenticate(req, res, settings.permissions),
        controllerDirectory: new VirtualDirectory(path.join(__dirname, "controllers")),
        staticRootDirectory: new VirtualDirectory(path.join(__dirname, "static")),
        virtualPaths: settings.virtualPaths,
        bindIP: settings.bindIP,
        requestFilters: settings.requestFilters
    })

    startSocketServer(r.server);
    r.server.listen(settings.port, settings.bindIP);

    g.stationInfos.add(stations => {
        for (let i = 0; i < stations.length; i++) {
            let key = `^${stations[i].path}(\\S*)`;
            let targetUrl = `http://${stations[i].ip}:${stations[i].port}/$1`;
            if (!proxy[key]) {
                proxy[key] = {
                    targetUrl, headers: proxyHeader, pipe: proxyPipe
                };
            }

            if (stations[i].permissions) {
                Object.assign(settings.permissions, stations[i].permissions);
            }
        }
    })
}

async function proxyResponseHandle(req: http.IncomingMessage, proxyResponse: http.IncomingMessage, buffer: Buffer): Promise<Buffer> {

    if (proxyResponse.statusCode != statusCodes.login) {
        return;
    }

    let logger = getLogger(constants.projectName);
    logger.info("Status code is login status code, process login logic.");

    console.assert(buffer != null);
    let loginResult: LoginResult = JSON.parse(buffer.toString());
    let tokenData = createTokenData(loginResult.userId);
    loginResult.token = tokenData.id;

    let expires = new Date(Date.now() + 60 * 60 * 1000 * 24 * 365);
    let cookies = new Cookies(req, proxyResponse as any);
    cookies.set(TOKEN_NAME, tokenData.id, {
        overwrite: true, expires,
        httpOnly: false,
    });

    return Buffer.from(JSON.stringify(loginResult));

    // let logger = getLogger(constants.projectName);
    // logger.info("Status code is login status code, process login logic.");
    // let buffers: Buffer[] = [];
    // proxyResponse.on("data", function (chunk: Buffer) {
    //     buffers.push(chunk);
    // })
    // proxyResponse.on("end", function () {
    //     let buffer = Buffer.concat(buffers);

    //     let loginResult: LoginResult = JSON.parse(buffer.toString());
    //     let tokenData = createTokenData(loginResult.userId);
    //     loginResult.token = tokenData.id;

    //     let expires = new Date(Date.now() + 60 * 60 * 1000 * 24 * 365);
    //     let cookies = new Cookies(req, res);
    //     cookies.set(TOKEN_NAME, tokenData.id, {
    //         overwrite: true, expires,
    //         httpOnly: false,
    //     });
    //     res.write(JSON.stringify(loginResult));
    //     res.end();
    // })
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

function createTokenData(userId: string): TokenData {
    let tokenData: TokenData = {
        id: guid(), user_id: userId,
        create_date_time: new Date(Date.now())
    }

    let logger = getLogger(`${constants.projectName}:${createTokenData.name}`, g.settings.logLevel);
    createDataContext(g.settings.db).then(dc => {
        return dc.tokenDatas.insert(tokenData);
    }).catch(err => {
        logger.error(err);
    })


    return tokenData;
}

