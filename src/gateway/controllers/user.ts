import { constants, g, TOKEN_NAME, userIds } from "../global";
import { controller, action, request, response, getLogger, routeData } from "maishu-node-mvc";
import { authDataContext, AuthDataContext, currentUserId } from "../data-context";
import { errors } from "../errors";
import http = require("http");
import { getTokenData } from "../filters/authenticate";
import { TokenManager } from "../token";
import Cookies = require("maishu-cookies");
import { In } from "maishu-node-data";
import { Role } from "gateway-entities";

@controller(`/${constants.controllerPathRoot}/user`)
export default class UserController {

    /** 获取登录用户的角色 */
    @action()
    async myRoles(@authDataContext dc: AuthDataContext, @currentUserId currentUserId: string): Promise<Role[]> {
        if (!currentUserId)
            throw errors.userNotLogin();

        let r = await this.roles(dc, { userIds: [currentUserId] });
        return r[currentUserId];
    }

    /** 退出登录 */
    @action()
    async logout(@request req: http.IncomingMessage, @response res: http.ServerResponse) {
        let tokenData = await getTokenData(req, res);
        if (!tokenData) {
            let logger = getLogger(constants.projectName, g.settings.logLevel);
            logger.warn(`Cannt get token data.`)
            return false;
        }

        TokenManager.remove(tokenData.id);
        let cookies = new Cookies(req, res);
        cookies.set(TOKEN_NAME, "");
        return true;
    }

    /** 获取指定的用户角色 */
    @action()
    async roles(@authDataContext dc: AuthDataContext, @routeData d: { userIds: string[] }) {
        if (!d.userIds) throw errors.argumentFieldNull("userIds", "d");
        if (d.userIds.length == 0)
            return {};
            
        let userRoles = await dc.userRoles.find({ where: { user_id: In(d.userIds) } });
        let roleIds = userRoles.map(o => o.role_id).filter((item, index, arr) => arr.indexOf(item) == index);
        let roles = await dc.roles.findByIds(roleIds);
        let r: { [userId: string]: Role[] } = {};
        for (let i = 0; i < d.userIds.length; i++) {
            let theUserRoles = userRoles.filter(o => o.user_id == d.userIds[i])
                .map(o => o.role_id).map(roleId => roles.filter(o => o.id == roleId)[0])
                .filter(o => o != null);
            r[d.userIds[i]] = theUserRoles;
        }
        return r;
    }





}