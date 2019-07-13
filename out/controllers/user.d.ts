import { AuthDataContext } from '../dataContext';
import { User, LoginResult } from '../entities';
import { SelectArguments } from './base-controller';
export default class UserController {
    /** 手机是否已注册 */
    isMobileRegister(dc: AuthDataContext, { mobile }: {
        mobile: any;
    }): Promise<boolean>;
    isUserNameRegister(dc: AuthDataContext, { user_name }: {
        user_name: any;
    }): Promise<boolean>;
    isEmailRegister(dc: AuthDataContext, { email }: {
        email: any;
    }): Promise<boolean>;
    register(dc: AuthDataContext, { mobile, password, smsId, verifyCode, data }: {
        mobile: string;
        password: string;
        smsId: string;
        verifyCode: string;
        data: any;
    }): Promise<{
        token: string;
        userId: string;
    }>;
    resetPassword(dc: AuthDataContext, { mobile, password, smsId, verifyCode }: {
        mobile: any;
        password: any;
        smsId: any;
        verifyCode: any;
    }): Promise<{
        token: string;
        userId: string;
    }>;
    resetMobile(dc: AuthDataContext, userId: string, { mobile, smsId, verifyCode }: {
        mobile: any;
        smsId: any;
        verifyCode: any;
    }): Promise<{
        id: string;
    }>;
    loginByUserName(dc: AuthDataContext, { username, password }: {
        username: any;
        password: any;
    }): Promise<LoginResult>;
    private loginByOpenId;
    private loginByVerifyCode;
    login(dc: AuthDataContext, args: any): Promise<LoginResult>;
    logout(tokenId: string): Promise<{}>;
    /** 获取登录用户的信息 */
    me(user: User): Promise<User>;
    /** 获取用户信息 */
    item(dc: AuthDataContext, { userId }: {
        userId: string;
    }): Promise<User>;
    /**
     * 获取当前登录用户角色
     * @param param0
     * 1. userId string
     */
    getRoles(dc: AuthDataContext, userId: any): Promise<string>;
    list(dc: AuthDataContext, { args }: {
        args: SelectArguments;
    }): Promise<import("maishu-mysql-helper").SelectResult<User>>;
    /** 添加用户 */
    add(dc: AuthDataContext, { item }: {
        item: User;
    }): Promise<Partial<User>>;
    remove(dc: AuthDataContext, { id }: {
        id: any;
    }): Promise<{
        id: any;
    }>;
    update(dc: AuthDataContext, { user }: {
        user: User;
    }): Promise<Partial<User>>;
    userLatestLogin(dc: AuthDataContext, { userIds }: {
        userIds: string[];
    }): Promise<import("../entities").UserLatestLogin[]>;
}
