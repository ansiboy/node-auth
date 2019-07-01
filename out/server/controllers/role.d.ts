import * as mysql from 'mysql';
import { Role } from "../entities";
import { AuthDataContext } from "../dataContext";
export default class RoleController {
    add(dc: AuthDataContext, appId: string, { item }: {
        item: Role;
    }): {
        id: string;
    };
    update({ id, name, remark }: {
        id: any;
        name: any;
        remark: any;
    }): Promise<Role>;
    remove(dc: AuthDataContext, appId: string, { id }: {
        id: any;
    }): Promise<{
        id: any;
    }>;
    /** 获取角色列表 */
    list(conn: any): Promise<Role[]>;
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
    setResources(conn: mysql.Connection, { roleId, resourceIds }: {
        roleId: string;
        resourceIds: string[];
    }): Promise<{}>;
    /**
     * 获取角色的资源编号
     * @param param0
     * roleId: 角色编号
     */
    resourceIds({ roleId }: {
        roleId: any;
    }): Promise<string[]>;
    /**
     * 获取用户角色编号
     */
    userRoles(conn: mysql.Connection, { userIds }: {
        userIds: string[];
    }): Promise<{
        [key: string]: Role[];
    }>;
}
