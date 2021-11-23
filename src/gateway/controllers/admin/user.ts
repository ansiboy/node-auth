import { constants, } from "../../global";
import { controller, action, routeData } from "maishu-node-mvc";
import { AuthDataContext } from "../../data-context/";
import { errors } from "../../errors";
import { In } from "maishu-node-data";
import { Role, UserRole } from "gateway-entities";
import { authDataContext, currentUserId } from "../../decorators";

import UserUserControoler from "../user/user";

@controller(`${constants.adminApiBasePath}/user`)
export class UserControoler {

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

    /** 设置角色 */
    @action()
    async setRoles(@authDataContext dc: AuthDataContext, @routeData d: { userId: string, roleIds: string[] }) {
        if (!d.userId) throw errors.argumentFieldNull("userId", "d");
        if (!d.roleIds) throw errors.argumentFieldNull("roleIds", "d");

        await dc.userRoles.delete({ user_id: d.userId });

        let itmes: UserRole[] = d.roleIds.map(o => ({
            user_id: d.userId, role_id: o, create_date_time: new Date(),
        } as UserRole));
        await dc.userRoles.insert(itmes);
        return {};
    }

    /** 获取某个角色的用户 ID */
    @action()
    async ids(@authDataContext dc: AuthDataContext, @routeData d: { roleId: string }) {
        if (!d.roleId) throw errors.routeDataFieldNull("roleId");
        let userRoles = await dc.userRoles.find({ select: ["user_id"], where: { role_id: d.roleId } });
        let userIds = userRoles.map(o => o.user_id);
        return userIds;
    }

    @action()
    async myRoles(@authDataContext dc: AuthDataContext, @currentUserId currentUserId: string): Promise<Role[]> {

        let ctrl = new UserUserControoler();
        return ctrl.myRoles(dc, currentUserId);
    }

}