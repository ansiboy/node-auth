import { constants, g, TOKEN_NAME } from "../global";
import { controller, action, request, response, getLogger } from "maishu-node-mvc";
import { authDataContext, AuthDataContext, currentUserId } from "../data-context";
import { errors } from "../errors";
import http = require("http");
import { getTokenData } from "../filters/authenticate";
import { TokenManager } from "../token";
import Cookies = require("maishu-cookies");

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