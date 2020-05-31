import { controller, action, getLogger, request, response, routeData } from "maishu-node-mvc";
import { constants, g } from "../global";
import { WebsiteConfig } from "../types";
import http = require("http");
import url = require("url");
import fetch from "node-fetch";
import { getTokenData } from "../filters/authenticate";
import { errors } from "../errors";
import { Role } from "../entities";
import { authDataContext, AuthDataContext } from "../data-context";
import websiteConfig from "../website-config";

type MyMenuItem = WebsiteConfig["menuItems"][0] & { stationPath?: string };

@controller(`${constants.controllerPathRoot}/menuItem`)
export class ResourceController {

    /**
     * 获取菜单项列表
     * @param d.roleId 角色编号，如果指定 roleId，返回指定角色的可以访问的菜单项
     */
    @action()
    async list(@request req: http.IncomingMessage, @authDataContext dc: AuthDataContext, @routeData d?: { roleId?: string, userId?: string }) {

        let stations = g.stationInfos.value;

        let u = url.parse(req.url);
        let protocol = u.protocol || "http:";
        let websiteConfigUrls = stations.map(p => `${protocol}//${p.ip}:${p.port}/websiteConfig`)

        let logger = getLogger(constants.projectName, g.settings.logLevel);
        logger.info(websiteConfigUrls);

        let menuItems: MyMenuItem[] = [...websiteConfig.menuItems || []];
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

        let menuItemRecords = await dc.menuItemRecords.find();
        for (let i = 0; i < menuItemRecords.length; i++) {
            let item = this.findMenuItem(menuItems, menuItemRecords[i].id);
            if (!item) {
                continue;
            }

            let roleIds = menuItemRecords[i].roleIds.split(",").filter(o => o);
            for (let i = 0; i < roleIds.length; i++) {
                if (item.roleIds.indexOf(roleIds[i]) < 0)
                    item.roleIds.push(roleIds[i]);

                // item.roleIds = menuItemRecords[i].roleIds ? menuItemRecords[i].roleIds.split(",").filter(o => o) : [];
            }
        }

        if (d != null && d.roleId != null) {
            menuItems = menuItems.filter(o => o.roleIds.indexOf(d.roleId) >= 0 || o.userId == d.userId);
        }

        return menuItems;
    }

    private findMenuItem(menuItems: MyMenuItem[], id: string) {
        let stack = [...menuItems];
        while (stack.length > 0) {
            let item = stack.pop();
            if (item.id == id)
                return item;

            if (item.children)
                stack.push(...item.children);
        }
        return null;
    }

    /** 获取我的权限 */
    @action()
    async my(@request req: http.IncomingMessage, @response res: http.ServerResponse, @authDataContext dc: AuthDataContext) {
        let tokenData = await getTokenData(req, res);
        if (!tokenData)
            throw errors.userNotLogin(req.url);

        let userRoleIds = await Role.getUserRoleIds(tokenData.user_id);
        let menuItems = await this.list(req, dc);
        let result: typeof menuItems = filterMenuItems(menuItems, userRoleIds);

        return result;
    }

    @action()
    async setRolePermission(@authDataContext dc: AuthDataContext, @routeData d: { roleId: string, resourceIds: string[] }) {
        if (!d.roleId) throw errors.routeDataFieldNull<typeof d>("roleId");
        if (!d.resourceIds) throw errors.routeDataFieldNull<typeof d>("resourceIds");

        let menuItemRecords = await dc.menuItemRecords.find();
        for (let i = 0; i < d.resourceIds.length; i++) {
            let menuItemRecord = await menuItemRecords.filter(o => o.id == d.resourceIds[i])[0];
            if (menuItemRecord == null) {
                menuItemRecord = { id: d.resourceIds[i], roleIds: d.roleId, createDateTime: new Date() };
                menuItemRecords.push(menuItemRecord);
                await dc.menuItemRecords.insert(menuItemRecord);
            }
            else if (menuItemRecord.roleIds.indexOf(d.roleId) < 0) {
                menuItemRecord.roleIds = menuItemRecord.roleIds + "," + d.roleId;
                await dc.menuItemRecords.save(menuItemRecord);
            }
        }

        return { id: d.roleId };
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