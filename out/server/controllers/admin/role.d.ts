import { Controller } from "maishu-node-mvc";
import { AuthDataContext } from "../../dataContext";
import { Role } from "../../entities";
/**
 * 后台管理接口
 */
export default class RoleController extends Controller {
    list(dc: AuthDataContext): Promise<Role[]>;
    add(dc: AuthDataContext, { role }: {
        role: Role;
    }): Promise<void>;
    delete(dc: AuthDataContext, { roleId }: {
        roleId: any;
    }): Promise<void>;
}
