import { Service } from "maishu-chitu-admin/static";
import { Resource, User } from "permission-entities";
import { DataSourceSelectArguments, DataSourceSelectResult } from "maishu-wuzhui";
import "json!websiteConfig";
export interface LoginInfo {
    token: string;
    userId: string;
}
export declare class PermissionService extends Service {
    static baseUrl: string;
    user: UserModule;
    sms: SMSModule;
    resource: ResourceModule;
    protected url(path: string): string;
}
declare class ServiceModule {
    service: PermissionService;
    getByJson: Service["getByJson"];
    postByJson: Service["postByJson"];
    get: Service["get"];
    post: Service["post"];
    constructor(service: PermissionService);
    protected url(path: string): string;
}
declare class UserModule extends ServiceModule {
    /** 获取用户列表 */
    list(args?: DataSourceSelectArguments): Promise<DataSourceSelectResult<User>>;
    /**
     * 更新用户信息
     * @param item 用户
     */
    update(item: Partial<User>): Promise<unknown>;
    /**
     * 获取用户
     * @param userId 用户编号
     */
    item(userId: string): Promise<User>;
    /**
     * 添加用户信息
     * @param item 用户
     */
    add(item: Partial<User>): Promise<{
        id: string;
    }>;
    /** 通过手机获取用户 */
    listByMobile(mobile: string): Promise<User>;
    /**
     * 重置密码
     * @param mobile 手机号
     * @param password 新密码
     * @param smsId 短信编号
     * @param verifyCode 验证码
     */
    resetPassword(mobile: string, password: string, smsId: string, verifyCode: string): Promise<unknown>;
    /**
     * 重置手机号码
     * @param mobile 需要重置的新手机号
     * @param smsId 短信编号
     * @param verifyCode 验证码
     */
    resetMobile(mobile: string, smsId: string, verifyCode: string): Promise<unknown>;
    /**
     * 注册
     * @param mobile 手机号
     * @param password 密码
     * @param smsId 短信编号
     * @param verifyCode 验证码
     */
    register(mobile: string, password: string, smsId: string, verifyCode: string, data?: {
        [key: string]: any;
    }): Promise<LoginInfo>;
    /**
     * 获取用户个人信息
     */
    me(): Promise<User>;
}
declare class SMSModule extends ServiceModule {
    /**
     * 发送注册操作验证码
     * @param mobile 接收验证码的手机号
     */
    sendRegisterVerifyCode(mobile: string): Promise<{
        smsId: string;
    }>;
    /**
     * 校验验证码
     * @param smsId 验证码信息的 ID 号
     * @param verifyCode 验证码
     */
    checkVerifyCode(smsId: string, verifyCode: string): Promise<boolean>;
    /**
     * 发送重置密码操作验证码
     * @param mobile 接收验证码的手机号
     */
    sendResetVerifyCode(mobile: string): Promise<{
        smsId: string;
    }>;
}
declare class ResourceModule extends ServiceModule {
    list(): Promise<Resource[]>;
}
export {};
