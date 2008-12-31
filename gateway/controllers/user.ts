import { constants } from "../global";
import { controller, action, routeData } from "maishu-node-mvc";
import { SelectArguments, authDataContext, AuthDataContext, currentUserId } from "../data-context";
import { errors } from "../errors";

@controller(`/${constants.controllerPathRoot}/user`)
export default class UserController {
    @action("myRoles")
    async roleList(@authDataContext dc: AuthDataContext, @currentUserId currentUserId: string) {
        if (!currentUserId)
            throw errors.userNotLogin();

        let userRoles = await dc.userRoles.find({ user_id: currentUserId });
        let roles = await dc.roles.findByIds(userRoles.map(o => o.role_id));
        return roles;
    }
}