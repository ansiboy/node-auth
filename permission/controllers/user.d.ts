import { ContentResult } from 'maishu-node-mvc';
import { PermissionDataContext } from '../data-context';
import { User } from '../entities';
import { SelectArguments } from './base-controller';
import { LoginResult } from "../../gateway";
export default class UserController {
    /** 手机是否已注册 */
    isMobileRegister(dc: PermissionDataContext, { mobile }: {
        mobile: any;
    }): Promise<boolean>;
    isUserNameRegister(dc: PermissionDataContext, { user_name }: {
        user_name: any;
    }): Promise<boolean>;
    isEmailRegister(dc: PermissionDataContext, { email }: {
        email: any;
    }): Promise<boolean>;
    register(dc: PermissionDataContext, { mobile, password, smsId, verifyCode, data }: {
        mobile: string;
        password: string;
        smsId: string;
        verifyCode: string;
        data: any;
    }): Promise<ContentResult>;
    private loginActionResult;
    resetPassword(dc: PermissionDataContext, { mobile, password, smsId, verifyCode }: {
        mobile: any;
        password: any;
        smsId: any;
        verifyCode: any;
    }): Promise<ContentResult>;
    resetMobile(dc: PermissionDataContext, userId: string, { mobile, smsId, verifyCode }: {
        mobile: any;
        smsId: any;
        verifyCode: any;
    }): Promise<{
        id: string;
    }>;
    loginByUserName(dc: PermissionDataContext, { username, password }: {
        username: any;
        password: any;
    }): Promise<LoginResult>;
    private loginByOpenId;
    private loginByVerifyCode;
    login(dc: PermissionDataContext, args: any, req: any, res: any): Promise<ContentResult>;
    logout(): Promise<ContentResult>;
    /** 获取登录用户的信息 */
    me(user: User): Promise<Partial<User>>;
    /** 获取用户信息 */
    item(dc: PermissionDataContext, { userId }: {
        userId: string;
    }): Promise<User>;
    list(dc: PermissionDataContext, { args }: {
        args: SelectArguments;
    }): Promise<User[]>;
    /** 添加用户 */
    add(dc: PermissionDataContext, { item }: {
        item: User;
    }): Promise<Partial<User>>;
    remove(dc: PermissionDataContext, { id }: {
        id: any;
    }): Promise<{
        id: any;
    }>;
    update(dc: PermissionDataContext, { user }: {
        user: User;
    }): Promise<Partial<User>>;
    userLatestLogin(dc: PermissionDataContext, { userIds }: {
        userIds: string[];
    }): Promise<import("../entities").UserLatestLogin[]>;
    /** 获取当前用户角色的子角色列表 */
    roleList(dc: PermissionDataContext, { userId }: {
        userId: any;
    }): Promise<import("../entities").Role[]>;
    /** 获取用户所允许访问的资源 */
    resourceList(dc: PermissionDataContext, { userId }: {
        userId: any;
    }): Promise<void>;
}
