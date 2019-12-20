import { controller, action, getLogger, request, response, serverContext } from "maishu-node-mvc";
import { constants, g } from "../global";
import { WebsiteConfig, ServerContext } from "../types";
import http = require("http");
import url = require("url");
import fetch from "node-fetch";
import { getTokenData } from "../filters/authenticate";
import { errors } from "../errors";
import { Role } from "../entities";

type MyMenuItem = WebsiteConfig["menuItems"][0] & { stationPath?: string };

@controller(`${constants.controllerPathRoot}/menuItem`)
export class ResourceController {
    @action()
    async list(@request req: http.IncomingMessage, @serverContext context: ServerContext) {

        let stations = g.stationInfos.value;

        let u = url.parse(req.url);
        let protocol = u.protocol || "http:";
        let websiteConfigUrls = stations.map(p => `${protocol}//${p.ip}:${p.port}/websiteConfig`)

        let logger = getLogger(constants.projectName, context.data.logLevel);
        logger.info(websiteConfigUrls);

        let menuItems: MyMenuItem[] = [];
        let websiteConfigs = await Promise.all(websiteConfigUrls.map(url => getWebsiteConfig(req, url)));

        for (let i = 0; i < websiteConfigs.length; i++) {
            let websiteConfig = websiteConfigs[i];
            if (websiteConfig.menuItems == null)
                continue;

            let stack = [...websiteConfig.menuItems] as MyMenuItem[];
            while (stack.length > 0) {
                let item = stack.shift();
                item.stationPath = stations[i].path;
                (item.children || []).forEach(child => {
                    stack.unshift(child);
                })
            }

            menuItems.push(...websiteConfig.menuItems || []);
        }

        return menuItems;
    }

    @action()
    async my(@request req: http.IncomingMessage, @response res: http.ServerResponse, @serverContext context: ServerContext) {
        let tokenData = await getTokenData(req, res, context.data);
        if (!tokenData)
            throw errors.userNotLogin(req.url);

        let userRoleIds = await Role.getUserRoleIds(tokenData.user_id, context.data);
        let menuItems = await this.list(req, context);
        let result: typeof menuItems = filterMenuItems(menuItems, userRoleIds);

        return result;
    }
}

function getWebsiteConfig(req: http.IncomingMessage, url: string): Promise<WebsiteConfig> {
    return new Promise<WebsiteConfig>((resolve, reject) => {
        fetch(url)
            .then(r => r.json())
            .then(o => resolve(o))
            .catch(err => {
                reject(err);
            });
    })
}

function filterMenuItems(menuItems: WebsiteConfig["menuItems"], userRoleIds: string[]) {
    let result: WebsiteConfig["menuItems"] = [];
    for (let i = 0; i < menuItems.length; i++) {
        let menuItem = menuItems[i];
        if (menuItem.roleIds && menuItem.roleIds.length > 0) {
            for (let j = 0; j < userRoleIds.length; j++) {
                if (menuItem.roleIds.indexOf(userRoleIds[j]) >= 0) {
                    result.push(menuItem);
                    continue;
                }
            }
        }

        if (menuItem.children) {
            menuItem.children = filterMenuItems(menuItem.children, userRoleIds);
        }
    }

    return result;
}