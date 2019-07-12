import * as mysql from 'mysql';
interface Role {
    id: string;
    name: string;
    remark: string;
    create_date_time: Date;
    application_id: string;
}
export default class RoleController {
    add({ APP_ID, name, remark }: {
        APP_ID: any;
        name: any;
        remark: any;
    }): Promise<Role>;
    update({ id, name, remark }: {
        id: any;
        name: any;
        remark: any;
    }): Promise<Role>;
    remove({ id, APP_ID }: {
        id: any;
        APP_ID: any;
    }): Promise<{
        id: any;
    }>;
    /** 获取角色列表 */
    list(conn: any): Promise<Role[]>;
    /** 获取单个角色 */
    get(conn: any, { id }: {
        id: any;
    }): Promise<{
        id: any;
    }>;
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
    userRoleIds(conn: mysql.Connection, { userIds }: {
        userIds: string[];
    }): Promise<UserRole[]>;
    /**
     * 获取用户角色编号
     */
    userRoles(conn: mysql.Connection, { userIds }: {
        userIds: string[];
    }): Promise<{
        [key: string]: Role[];
    }>;
}
export {};
