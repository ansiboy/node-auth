import { Role, User } from "../entities";
import { AuthDataContext } from "../dataContext";
export default class RoleController {
    add(dc: AuthDataContext, userId: string, { item }: {
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
    remove(dc: AuthDataContext, user: User, { id }: {
        id: any;
    }): Promise<Partial<Role>>;
    /** 获取角色列表 */
    list(dc: AuthDataContext, userId: string): Promise<Role[]>;
    /** 获取单个角色 */
    get(dc: AuthDataContext, { id }: {
        id: any;
    }): Promise<Role>;
    /**
     * 设置角色所允许访问的资源
     * @param param0 参数
     * roleId 角色 ID
     * resourceIds 角色所允许访问的资源 ID 数组
     * appId 应用 ID
     */
    setResources(dc: AuthDataContext, { roleId, resourceIds }: {
        roleId: string;
        resourceIds: string[];
    }): Promise<{}>;
    /**
     * 获取角色的资源编号
     * @param param0
     * roleId: 角色编号
     */
    resourceIds(dc: AuthDataContext, { roleId }: {
        roleId: any;
    }): Promise<string[]>;
}
