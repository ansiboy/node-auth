import { controller, action } from "maishu-node-mvc";
import { authDataContext, AuthDataContext } from "../dataContext";
import { UserId } from "../decorators";
import { errors } from "../errors";
import { Resource, Role } from "../entities";

@controller("current-user")
export default class CurrentUserController {
    @action("resource/list")
    async resourceList(@authDataContext dc: AuthDataContext, @UserId userId: string): Promise<Resource[]> {
        if (!userId) throw errors.argumentNull("userId");

        let user = await dc.users.findOne(userId);
        if (!user)
            throw errors.objectNotExistWithId(userId, "User");

        if (!user.role_id)
            return [];

        let roles = await dc.roles.find({
            relations: ['resources'],
            where: dc.roles.createQueryBuilder().where("id = :roleId)").setParameter("roleId", user.role_id),
        })

        let r: Resource[] = [];
        roles.forEach(role => r.push(...role.resources));

        return r;
    }
}