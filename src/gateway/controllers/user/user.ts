import { constants, g, TOKEN_NAME, } from "../../global";
import { controller, action, request, response, getLogger, routeData } from "maishu-node-mvc";
import { AuthDataContext } from "../../data-context/";
import { errors } from "../../errors";
import http = require("http");
import { getTokenData } from "../../filters/authenticate";
import { TokenManager } from "../../token";
import Cookies = require("maishu-cookies");
import { Role } from "gateway-entities";
import { authDataContext, currentUserId } from "../../decorators";
import { UserControoler as AdminUserController } from "../admin/user";
import { Connection } from "maishu-node-data";

@controller(`${constants.userApiBasePath}/user`)
export default class UserController {

    /** 获取登录用户的角色 */
    @action()
    async myRoles(@authDataContext dc: AuthDataContext, @currentUserId currentUserId: string): Promise<Role[]> {
        if (!currentUserId)
            throw errors.userNotLogin();

        var ctrl = new AdminUserController();
        let r = await ctrl.roles(dc, { userIds: [currentUserId] });
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


}

