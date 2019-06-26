import { controller, action, Controller, formData } from "maishu-node-mvc";
import { authDataContext, AuthDataContext } from "../../dataContext";
import { Role } from "../../entities";
import { errors } from "../../errors";

/**
 * 后台管理接口
 */
@controller("admin/role")
export default class RoleController extends Controller {

    @action()
    async list(@authDataContext dc: AuthDataContext): Promise<Role[]> {
        let roles = await dc.roles.createQueryBuilder("role").orderBy("role.createDateTime", "DESC").getMany();

        return roles
    }

    @action()
    async add(@authDataContext dc: AuthDataContext, @formData { role }: { role: Role }) {
        if (!role) throw errors.fieldNull("role", "formData")

        await dc.roles.insert(role)
    }

    @action()
    async delete(@authDataContext dc: AuthDataContext, @formData { roleId }) {
        if (!roleId) throw errors.fieldNull("roleId", "formData")
    }
}