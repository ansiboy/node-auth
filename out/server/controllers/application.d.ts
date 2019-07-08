import * as mysql from 'mysql';
import { User } from "../entities";
export interface Application {
    id: string;
    name: string;
    data: string;
    user_id: string;
    create_date_time: any;
}
export default class ApplicationController {
    /** 添加应用 */
    add(conn: mysql.Connection, { name, userId, data }: {
        name: string;
        userId: string;
        data?: object;
    }): Promise<Application>;
    /** 添加应用 */
    update(conn: mysql.Connection, { id, name, userId, data }: {
        id: any;
        name?: string;
        userId: string;
        data?: object;
    }): Promise<Application>;
    remove(conn: mysql.Connection, userId: any, { id }: {
        id: any;
    }): Promise<[any[], mysql.FieldInfo[]]>;
    /** 显示指定用户的 Application */
    list(conn: mysql.Connection, userId: any): Promise<any[]>;
    /** 显示 ID 为 APP_ID 应用下的用户 */
    users(conn: any, { args }: {
        args: any;
    }, APP_ID: any): Promise<import("maishu-mysql-helper").SelectResult<User>>;
    addUser({ appId, mobile, roleIds }: {
        appId: string;
        mobile: string;
        roleIds: string[];
    }): Promise<{
        application_id: string;
        user_id: any;
    }>;
    updateUser({ appId, userId, roleIds }: {
        appId: any;
        userId: any;
        roleIds: any;
    }): Promise<void>;
    removeUser({ appId, userId }: {
        appId: any;
        userId: any;
    }): Promise<void>;
    get({ id }: {
        id: any;
    }): Promise<any>;
}
