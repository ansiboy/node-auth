import { DataSourceSelectResult, DataSourceSelectArguments } from "maishu-wuzhui";
import { PermissionService as Service, User, MenuItem, Resource, Role } from 'maishu-services-sdk';
export declare type Admin = User & {
    role_ids: string[];
};
export declare class PermissionService extends Service {
    private roleResourceIds;
    constructor();
    getMenuResource(startRowIndex: number, maximumRows: number, filter?: string): Promise<DataSourceSelectResult<Resource>>;
    resourceList(args: DataSourceSelectArguments): Promise<DataSourceSelectResult<Resource>>;
    getResources(): Promise<({
        children: Resource[];
        selected: boolean;
    } & Resource)[]>;
    getResourceChildCommands(id: string): Promise<unknown>;
    getRoleResourceIds(roleId: string): Promise<string[]>;
    setUserRoles(userId: string, roleIds: string[]): Promise<unknown>;
    addUserRoles(userId: string, roleIds: string[]): Promise<unknown>;
    getUsersRoles(userIds: string[]): Promise<{
        [key: string]: Role[];
    }>;
    getUserRoles(userId: string): Promise<Role[]>;
    getUserList(args: DataSourceSelectArguments): Promise<DataSourceSelectResult<User>>;
    getUsersByIds(ids: string[]): Promise<User[]>;
    getUser(userId: string): Promise<User>;
    getUserByMobile(mobile: string): Promise<User>;
    addAdmin(item: Partial<Admin>): Promise<{
        id: string;
    }>;
    deleteAdmin(userId: any): Promise<unknown>;
    updateAdmin(item: Partial<Admin>): Promise<void>;
    /** 获取菜单列表 */
    getPlatformMenu(): Promise<MenuItem[]>;
    /** 获取菜单列表 */
    private getMenu;
    getMenuItem(id: string): Promise<MenuItem>;
    private createPath;
    static readonly isLogin: boolean;
    addUser(item: Partial<User>): Promise<{
        id: string;
    }>;
}
