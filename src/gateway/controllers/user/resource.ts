import { controller, action, request, response } from "maishu-node-mvc";
import { constants } from "../../global";
import { WebsiteConfig } from "../../types";
import http = require("http");
import url = require("url");
import { errors } from "../../errors";
import { AuthDataContext } from "../../data-context/data-context";
import { authDataContext, currentUserId } from "../../decorators";
import { AdminMenuController } from "../admin/menu";

@controller(`${constants.userApiBasePath}/menuItem`)
export class UserMenuController {
    /** 获取我的权限 */
    @action()
    async my(@request req: http.IncomingMessage, @response res: http.ServerResponse, @authDataContext dc: AuthDataContext,
        @currentUserId currentUserId: string) {
        if (!currentUserId)
            throw errors.userNotLogin(req.url);

        let userRoleIds = await AuthDataContext.getUserRoleIds(currentUserId);
        var adminCtrl = new AdminMenuController();
        let menuItems = await adminCtrl.list(req, dc);
        let result: typeof menuItems = this.filterMenuItems(menuItems, userRoleIds);

        return result;
    }


    private filterMenuItems(menuItems: WebsiteConfig["menuItems"], userRoleIds: string[]) {
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
                menuItem.children = this.filterMenuItems(menuItem.children, userRoleIds);
            }
        }

        return result;
    }


}