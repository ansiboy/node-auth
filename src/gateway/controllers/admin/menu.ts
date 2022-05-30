import { controller, action, getLogger, request, response, routeData } from "maishu-node-mvc";
import { constants, g } from "../../global";
import { WebsiteConfig } from "../../types";
import http = require("http");
import url = require("url");
import fetch from "node-fetch";
import { errors } from "../../errors";
import { AuthDataContext } from "../../data-context/data-context";
import w from "../../static/website-config";
import { authDataContext, currentUserId } from "../../decorators";
import { pathConcat } from "maishu-toolkit";
import { MenuItemRecord } from "gateway-entities";
import { MenuItem } from "maishu-admin-scaffold/static/website-config";

type MyMenuItem = MenuItem & { stationPath?: string };

@controller(`${constants.adminApiBasePath}/menuItem`)
export class AdminMenuController {

    /**
     * 获取菜单项列表
     * @param d.roleId 角色编号，如果指定 roleId，返回指定角色的可以访问的菜单项
     */
    @action()
    async list(@request req: http.IncomingMessage, @authDataContext dc: AuthDataContext, @routeData d?: { roleId?: string, userId?: string }) {

        let stations = g.stationInfos.value || [];

        let u = url.parse(req.url || "");
        let protocol = u.protocol || "http:";
        let websiteConfigUrls = stations.map(p => {
            let configPath = p.config || "website-config";
            let url = pathConcat(`${protocol}//${p.ip}:${p.port}/`, configPath);
            return url;
        });

        let logger = getLogger(constants.projectName, g.settings.logLevel);
        logger.info(websiteConfigUrls);

        let menuItems: MyMenuItem[] = [...JSON.parse(JSON.stringify(w.menuItems)) || []];
        let websiteConfigs = await Promise.all(websiteConfigUrls.map(url => getWebsiteConfig(req, url)));

        for (let i = 0; i < websiteConfigs.length; i++) {
            let w = websiteConfigs[i];
            if (w.menuItems == null)
                continue;

            let stack = [...w.menuItems] as MyMenuItem[];
            while (stack.length > 0) {
                let item = stack.shift() as MyMenuItem;
                item.stationPath = stations[i].path;
                (item.children || []).forEach(child => {
                    stack.unshift(child);
                })
            }

            menuItems.push(...w.menuItems || []);
        }

        let menuItemRecords = await dc.menuItemRecords.find();
        for (let i = 0; i < menuItemRecords.length; i++) {
            let item = this.findMenuItem(menuItems, menuItemRecords[i].id);
            if (!item) {
                continue;
            }

            let roleIds = menuItemRecords[i].roleIds;//.split(",").filter(o => o);
            for (let i = 0; i < roleIds.length; i++) {
                if ((item.roleIds as string[]).indexOf(roleIds[i]) < 0)
                    (item.roleIds as string[]).push(roleIds[i]);

            }
        }

        if (d != null && d.roleId != null) {
            menuItems = menuItems.filter(o => o.roleIds != null && o.roleIds.indexOf(d.roleId as string) >= 0 || (o as any)["userId"] == d.userId);
        }

        return menuItems;
    }

    private findMenuItem(menuItems: MyMenuItem[], id: string) {
        let stack = [...menuItems];
        while (stack.length > 0) {
            let item = stack.pop();
            if ((item as MyMenuItem).id == id)
                return item;

            if ((item as MyMenuItem).children)
                stack.push(...((item as MyMenuItem).children as MenuItem[]));
        }
        return null;
    }


    @action()
    async setRolePermission(@authDataContext dc: AuthDataContext, @routeData d: { roleId: string, resourceIds: string[] }) {
        if (!d.roleId) throw errors.routeDataFieldNull<typeof d>("roleId");
        if (!d.resourceIds) throw errors.routeDataFieldNull<typeof d>("resourceIds");

        let menuItemRecords = await dc.menuItemRecords.find();
        // 查找 roleId 允许访问的菜单
        let roleMenuItems = menuItemRecords.filter(o => o.roleIds.indexOf(d.roleId) >= 0);
        for (let i = 0; i < roleMenuItems.length; i++) {
            // 如果 菜单 ID 不在 resourceIds 中，去掉 roleId
            if (d.resourceIds.indexOf(roleMenuItems[i].id) < 0) {
                roleMenuItems[i].roleIds = roleMenuItems[i].roleIds.filter(roleId => roleId != d.roleId);
                await dc.menuItemRecords.update(roleMenuItems[i].id, { roleIds: roleMenuItems[i].roleIds });
            }
        }

        for (let i = 0; i < d.resourceIds.length; i++) {
            let menuItemRecord = menuItemRecords.filter(o => o.id == d.resourceIds[i])[0];
            if (menuItemRecord == null) {
                if (d.resourceIds[i].length > 36) {
                    throw errors.idTooLong(d.resourceIds[i]);
                }
                menuItemRecord = { id: d.resourceIds[i], roleIds: [d.roleId], create_date_time: new Date() };
                menuItemRecords.push(menuItemRecord);
                await dc.menuItemRecords.insert(menuItemRecord);
            }
            else if (menuItemRecord.roleIds.indexOf(d.roleId) < 0) {
                menuItemRecord.roleIds.push(d.roleId) //= menuItemRecord.roleIds + "," + d.roleId;
                await dc.menuItemRecords.update(menuItemRecord.id, { roleIds: menuItemRecord.roleIds });
            }
        }

        for (let i = 0; i < menuItemRecords.length; i++) {

        }

        return { id: d.roleId };
    }

    @action()
    async getRolePermission(@authDataContext dc: AuthDataContext, @routeData d: { roleId: string }): Promise<string[]> {
        if (!d.roleId) throw errors.routeDataFieldNull<typeof d>("roleId");
        let menuItemRecords = await dc.menuItemRecords.find();
        let r = menuItemRecords.filter(o => o.roleIds.indexOf(d.roleId) >= 0).map(o => o.id);
        return r;
    }

    @action()
    async getMenuItemRecords(@authDataContext dc: AuthDataContext): Promise<MenuItemRecord[]> {

        let r = await dc.menuItemRecords.find();
        return r;
    }


}

function getWebsiteConfig(req: http.IncomingMessage, url: string): Promise<WebsiteConfig> {
    return new Promise<WebsiteConfig>((resolve, reject) => {
        fetch(url)
            .then(r => r.json())
            .then(o => {
                resolve(o)
            })
            .catch(err => {
                console.info(err);
                resolve({});
            });

    })
}
