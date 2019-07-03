import { controller, action } from "maishu-node-mvc";
import { authDataContext, AuthDataContext } from "../dataContext";
import { UserId } from "../decorators";
import { errors } from "../errors";
import { Resource } from "../entities";

@controller("current-user")
export default class CurrentUserController {
    @action("resource/list")
    async resourceList(@authDataContext dc: AuthDataContext, @UserId userId: string) {
        if (!userId) throw errors.argumentNull("userId");

        let user = await dc.user.findOne(userId, { relations: ["roles"] });
        let roleIds = user.roles.map(o => o.id);
        let roles = await dc.roles.find({
            relations: ['resources'],
            where: dc.roles.createQueryBuilder().where("id in (...:roleIds)").setParameter("roleIds", roleIds),
        })

        let r: Resource[] = [];
        roles.forEach(role => r.push(...role.resources));

        return r;
    }
}