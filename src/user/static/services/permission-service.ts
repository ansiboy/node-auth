import { Service } from "maishu-chitu-admin/static";
import { errors } from "../errors";
import { Resource, User } from "permission-entities";
import { DataSourceSelectArguments, DataSourceSelectResult } from "maishu-wuzhui-helper";
import { pathConcat } from "maishu-toolkit";

// import "json!websiteConfig";
// let websiteConfig: PermissionWebsiteConfig = require("json!websiteConfig")

export interface LoginInfo {
    token: string,
    userId: string,
}

export class PermissionService extends Service {
    user = new UserModule(this);
    sms = new SMSModule(this);
    resource = new ResourceModule(this);
    constructor(...args) {
        super(...args)
    }



}

class ServiceModule {
    service: PermissionService;
    getByJson: Service["getByJson"];
    postByJson: Service["postByJson"];
    get: Service["get"];
    post: Service["post"];

    constructor(service: PermissionService) {
        this.service = service;
        this.getByJson = this.service.getByJson.bind(this.service);
        this.postByJson = this.service.postByJson.bind(this.service);
        this.get = this.service.get.bind(this.service);
        this.post = this.service.post.bind(this.service);
    }

    protected url(path: string) {
        let url = pathConcat("user", path); //Requirejs.websitePath(path);
        return url;
    }
}

class UserModule extends ServiceModule {

    /** 获取用户列表 */
    async list(args?: DataSourceSelectArguments) {
        let url = this.url('user/list');
        let result = await this.getByJson<DataSourceSelectResult<User>>(url, { args });
        if (result == null)
            throw errors.unexpectedNullResult();

        return result;
    }

    /**
     * 更新用户信息
     * @param item 用户
     */
    async update(item: Partial<User>) {
        let url = this.url('user/update');
        let result = await this.postByJson(url, { user: item });
        return result;
    }

    /**
     * 获取用户
     * @param userId 用户编号
     */
    async item(userId: string) {
        let url = this.url('user/item')
        let user = await this.getByJson<User | null>(url, { userId });

        return user
    }

    /**
     * 添加用户信息
     * @param item 用户
     */
    async add(item: Partial<User>) {
        let url = this.url('user/add')
        let result: { id: string }
        let r = await this.postByJson<typeof result>(url, { item })
        return r
    }

    /** 通过手机获取用户 */
    async listByMobile(mobile: string) {
        if (!mobile) throw errors.argumentNull('mobile')

        let args: DataSourceSelectArguments = {}
        args.filter = `mobile = '${mobile}'`
        let r = await this.list(args);
        return r.dataItems[0]
    }

    /**
     * 重置密码
     * @param mobile 手机号
     * @param password 新密码
     * @param smsId 短信编号
     * @param verifyCode 验证码
     */
    resetPassword(mobile: string, password: string, smsId: string, verifyCode: string) {
        if (!mobile) throw errors.argumentNull('mobile')
        if (!password) throw errors.argumentNull('password')
        if (!smsId) throw errors.argumentNull('smsId')
        if (!verifyCode) throw errors.argumentNull('verifyCode')

        let url = this.url('user/resetPassword')
        return this.postByJson(url, { mobile, password, smsId, verifyCode })
    }

    /**
     * 重置手机号码
     * @param mobile 需要重置的新手机号
     * @param smsId 短信编号
     * @param verifyCode 验证码
     */
    resetMobile(mobile: string, smsId: string, verifyCode: string) {
        if (!mobile) throw errors.argumentNull('mobile')
        if (!smsId) throw errors.argumentNull('smsId')
        if (!verifyCode) throw errors.argumentNull('verifyCode')

        let url = this.url('user/resetMobile')
        return this.postByJson(url, { mobile, smsId, verifyCode })
    }

    /**
     * 注册
     * @param mobile 手机号
     * @param password 密码
     * @param smsId 短信编号
     * @param verifyCode 验证码
     */
    async register(mobile: string, password: string, smsId: string, verifyCode: string, data?: { [key: string]: any }) {
        if (!mobile) throw errors.argumentNull('mobile')
        if (!password) throw errors.argumentNull('password')
        if (!smsId) throw errors.argumentNull('smsId')
        if (!verifyCode) throw errors.argumentNull('verifyCode')

        let url = this.url('user/register')
        let r = await this.postByJson<LoginInfo>(url, { mobile, password, smsId, verifyCode, data })
        if (r == null)
            throw errors.unexpectedNullResult()

        return r;
    }

    /**
     * 获取用户个人信息
     */
    async me() {
        let url = this.url("user/me"); //Requirejs.websitePath('user/me');
        let user = await this.getByJson<User>(url);
        delete user.password;
        return user
    }
}

class SMSModule extends ServiceModule {
    /** 
     * 发送注册操作验证码
     * @param mobile 接收验证码的手机号
     */
    sendRegisterVerifyCode(mobile: string) {
        let url = this.url('sms/sendVerifyCode')
        return this.postByJson<{ smsId: string }>(url, { mobile, type: 'register' })
    }


    /**
     * 校验验证码
     * @param smsId 验证码信息的 ID 号
     * @param verifyCode 验证码
     */
    async checkVerifyCode(smsId: string, verifyCode: string) {
        if (!smsId) throw errors.argumentNull('smsId')
        if (!verifyCode) throw errors.argumentNull('verifycode')

        let url = this.url('sms/checkVerifyCode')
        let r = await this.postByJson<boolean>(url, { smsId, verifyCode })
        return r
    }

    /**
     * 发送重置密码操作验证码
     * @param mobile 接收验证码的手机号
     */
    sendResetVerifyCode(mobile: string) {
        if (!mobile) throw errors.argumentNull('mobile')

        let url = this.url('sms/sendVerifyCode')
        return this.postByJson<{ smsId: string }>(url, { mobile, type: 'resetPassword' })
    }

}

class ResourceModule extends ServiceModule {
    async list() {
        let url = this.url("resource/list");
        let r = await this.getByJson<Resource[]>(url);
        return r;
    }
}