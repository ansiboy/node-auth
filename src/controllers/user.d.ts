import * as db from 'maishu-mysql-helper';
import { Application } from './application';
import * as mysql from 'mysql';
export default class UserController {
    /** 手机是否已注册 */
    isMobileRegister(conn: mysql.Connection, { mobile }: {
        mobile: any;
    }): Promise<boolean>;
    isUserNameRegister(conn: mysql.Connection, { user_name }: {
        user_name: any;
    }): Promise<boolean>;
    isEmailRegister(conn: mysql.Connection, { email }: {
        email: any;
    }): Promise<boolean>;
    register(conn: mysql.Connection, { mobile, password, smsId, verifyCode, data }: {
        mobile: string;
        password: string;
        smsId: string;
        verifyCode: string;
        data: any;
    }): Promise<{
        token: string;
        userId: string;
    }>;
    resetPassword(conn: mysql.Connection, { mobile, password, smsId, verifyCode }: {
        mobile: any;
        password: any;
        smsId: any;
        verifyCode: any;
    }): Promise<{
        token: string;
        userId: string;
    }>;
    resetMobile(conn: mysql.Connection, { mobile, smsId, verifyCode, USER_ID }: {
        mobile: any;
        smsId: any;
        verifyCode: any;
        USER_ID: any;
    }): Promise<{}>;
    loginByUserName(conn: mysql.Connection, { username, password }: {
        username: any;
        password: any;
    }): Promise<{
        token: string;
        userId: string;
    }>;
    private loginByOpenId;
    private loginByVerifyCode;
    login(conn: mysql.Connection, args: any): Promise<{
        token: string;
        userId: string;
    }>;
    /** 获取登录用户的信息 */
    me(USER_ID: any): Promise<User>;
    /** 获取用户信息 */
    item({ userId }: {
        userId: string;
    }): Promise<User>;
    /**
     * 获取当前登录用户角色
     * @param param0
     * 1. userId string
     */
    getRoles(USER_ID: any): Promise<any[]>;
    /**
     * 设置用户权限
     * @param param0
     * 1. userId string, 用设置权限的用户 ID
     * 1. roleIds string[], 角色 ID 数组
     */
    setRoles(conn: mysql.Connection, { userId, roleIds }: {
        userId: any;
        roleIds: any;
    }): Promise<void>;
    addRoles(conn: mysql.Connection, { userId, roleIds }: {
        userId: any;
        roleIds: any;
    }): Promise<Error>;
    list(conn: mysql.Connection, { args }: {
        args: db.SelectArguments;
    }): Promise<db.SelectResult<User>>;
    /** 添加用户 */
    add(conn: mysql.Connection, { item, roleIds }: Args.addUser): Promise<{
        id: string;
    }>;
    update(conn: mysql.Connection, USER_ID: any, { user }: {
        user: any;
    }): Promise<void | {
        id: string;
    }>;
    /** 显示用户所拥有的应用 */
    ownAppliactions(conn: any, USER_ID: any): Promise<db.SelectResult<Application>>;
    /** 显示用户所允许访问的应用 */
    canVisitApplicationIds(conn: mysql.Connection, USER_ID: any): Promise<string[]>;
}
declare module Args {
    export type addUser = {
        item: User;
        roleIds: string[];
        conn: db.Connection;
    };
}
export {};
