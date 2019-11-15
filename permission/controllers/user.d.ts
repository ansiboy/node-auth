import { AuthDataContext } from '../data-context';
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
        token: any;
        userId: any;
    }>;
    resetPassword(dc: AuthDataContext, { mobile, password, smsId, verifyCode }: {
        mobile: any;
        password: any;
        smsId: any;
        verifyCode: any;
    }): Promise<{
        token: any;
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
    login(dc: AuthDataContext, args: any, req: any, res: any): Promise<LoginResult>;
    logout(tokenId: string): Promise<{}>;
    /** 获取登录用户的信息 */
    me(user: User): Promise<User>;
    /** 获取用户信息 */
    item(dc: AuthDataContext, { userId }: {
        userId: string;
    }): Promise<User>;
    list(dc: AuthDataContext, { args }: {
        args: SelectArguments;
    }): Promise<import("./base-controller").SelectResult<User>>;
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
    /** 获取当前用户角色的子角色列表 */
    roleList(dc: AuthDataContext, { userId }: {
        userId: any;
    }): Promise<import("../entities").Role[]>;
    /** 获取用户所允许访问的资源 */
    resourceList(dc: AuthDataContext, { userId }: {
        userId: any;
    }): Promise<import("../entities").Resource[]>;
}
