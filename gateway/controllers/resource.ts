import { controller, action, getLogger, request } from "maishu-node-mvc";
import { StationController } from "./station";
import { constants, g } from "../global";
import { WebsiteConfig } from "../types";
import http = require("http");
import url = require("url");
import fetch from "node-fetch";

@controller(`${constants.controllerPathRoot}/resource`)
export class ResourceController {
    @action()
    async list(@request req: http.IncomingMessage) {

        let ctrl = new StationController();
        let stations = ctrl.list();
        let websiteConfigPaths = stations.map(o => `${o.path}websiteConfig`);

        let u = url.parse(req.url);
        let protocol = u.protocol || "http:";
        let websiteConfigUrls = websiteConfigPaths.map(p => `${protocol}//${req.headers.host}${p}`)

        let logger = getLogger(constants.projectName, g.settings.logLevel);
        logger.info(websiteConfigPaths);

        let menuItems: WebsiteConfig["menuItems"] = [];
        let websiteConfigs = await Promise.all(websiteConfigUrls.map(url => getWebsiteConfig(req, url)));
        websiteConfigs.forEach(websiteConfig => {
            menuItems.push(...websiteConfig.menuItems);
        })

        return menuItems;
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