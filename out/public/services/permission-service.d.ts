import { DataSourceSelectResult, DataSourceSelectArguments } from "maishu-wuzhui";
import { PermissionService as Service, User, MenuItem, Resource, Role } from 'maishu-services-sdk';
import { Category } from "../../../out/server/entities";
export declare type Admin = User & {
    role_ids: string[];
};
export declare class PermissionService extends Service {
    private roleResourceIds;
    constructor();
    role: {
        list: () => Promise<Role[]>;
        item: (id: string) => Promise<Role>;
        add: (item: Partial<Role>) => Promise<unknown>;
        remove: (id: string) => Promise<unknown>;
    };
    resource: {
        list: (args: DataSourceSelectArguments) => Promise<DataSourceSelectResult<Resource>>;
        item: (id: any) => Promise<Resource>;
        remove: (id: any) => Promise<unknown>;
        add: (item: Partial<Resource>) => Promise<{
            id: string;
        }>;
    };
    menu: {
        list: (args: DataSourceSelectArguments) => Promise<any[]>;
        item: (id: string) => Promise<any>;
    };
    /** 系统类别，例如：平台，经销商 */
    category: {
        list: () => Promise<Category[]>;
    };
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
