import { AuthDataContext } from "../data-context";
import { Role } from "../entities";
import { SelectResult } from "maishu-node-data";
export default class RoleController {
    add(dc: AuthDataContext, { item }: {
        item: Role;
    }): Promise<{
        id: string;
        create_date_time: Date;
    }>;
    update(dc: AuthDataContext, { item }: {
        item: Role;
    }): Promise<{
        id: string;
    }>;
    remove(dc: AuthDataContext, { id }: {
        id: any;
    }): Promise<Partial<Role>>;
    /** 获取角色列表 */
    list(dc: AuthDataContext, { args, ids }: {
        args: any;
        ids: any;
    }): Promise<SelectResult<Role>>;
    getByIds(dc: AuthDataContext, { ids }: {
        ids: string[];
    }): Promise<Role[]>;
    /** 获取单个角色 */
    get(dc: AuthDataContext, { id }: {
        id: any;
    }): Promise<Role>;
}
