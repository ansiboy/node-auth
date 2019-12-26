import { constants, g, TOKEN_NAME } from "../global";
import { controller, action, request, response, getLogger, serverContext, routeData } from "maishu-node-mvc";
import { authDataContext, AuthDataContext, currentUserId } from "../data-context";
import { errors } from "../errors";
import http = require("http");
import { getTokenData } from "../filters/authenticate";
import { TokenManager } from "../token";
import Cookies = require("maishu-cookies");
import { ServerContext } from "../types";
import { Role, UserRole } from "../entities";
import { In } from "maishu-data";

@controller(`/${constants.controllerPathRoot}/user`)
export default class UserController {
    @action()
    async myRoles(@authDataContext dc: AuthDataContext, @currentUserId currentUserId: string) {
        if (!currentUserId)
            throw errors.userNotLogin();

        let userRoles = await dc.userRoles.find({ user_id: currentUserId });
        let roles = await dc.roles.findByIds(userRoles.map(o => o.role_id));
        return roles;
    }

    @action()
    async roles(@authDataContext dc: AuthDataContext, @routeData { userIds }: { userIds: string[] }) {
        if (!userIds)
            throw errors.routeDataFieldNull("userIds");

        return this.rolesByUserIds(dc, userIds);
    }

    @action()
    async setRoles(@authDataContext dc: AuthDataContext, @routeData { userId, roleids }: { userId: string, roleids: string[] }) {
        if (userId == null) throw errors.routeDataFieldNull("userId");
        if (roleids == null) throw errors.routeDataFieldNull("roleIds");

        await dc.userRoles.delete({ user_id: userId });
        if (roleids.length == 0)
            return;

        let userRoles = roleids.map(o => ({ user_id: userId, role_id: o } as UserRole));
        await dc.userRoles.insert(userRoles);
    }

    private async rolesByUserIds(dc: AuthDataContext, userIds: string[]): Promise<Role[][]> {
        userIds = userIds || [];
        if (userIds.length == 0)
            return [];

        // ToDO:从数据库过滤
        let userRoles = await dc.userRoles.find({ where: { user_id: In(userIds) } });
        // 过滤掉可能重复的 roleids;
        let roleIds = userRoles.map(o => o.role_id);
        roleIds = Array.from(new Set(roleIds));

        let roles = await dc.roles.findByIds(roleIds);
        let r: Role[][] = [];
        for (let i = 0; i < userIds.length; i++) {
            let roleIds = userRoles.filter(o => o.user_id == userIds[i]).map(o => o.role_id);
            let thisUserRoles = roles.filter(o => roleIds.indexOf(o.id) >= 0);
            r.push(thisUserRoles);
        }
        return r;
    }

    @action()
    async logout(@request req: http.IncomingMessage, @response res: http.ServerResponse, @serverContext context: ServerContext) {
        let tokenData = await getTokenData(req, res, context.data);
        if (!tokenData) {
            let logger = getLogger(constants.projectName, context.data.logLevel);
            logger.warn(`Cannt get token data.`)
            return false;
        }

        TokenManager.remove(tokenData.id, context.data);
        let cookies = new Cookies(req, res);
        cookies.set(TOKEN_NAME, "");
        return true;
    }
}