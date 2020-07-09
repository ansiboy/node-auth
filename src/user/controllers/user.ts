import { errors } from '../errors';
import { controller, action, routeData, ContentResult } from 'maishu-node-mvc';
import { UserDataContext, permissionDataContext, currentUserId, currentUser } from '../data-context';
import { User } from '../entities';
import SMSController from './sms';
import { guid } from 'maishu-toolkit';
import { LoginResult, statusCodes } from "../../gateway";
import { FindOneOptions } from 'typeorm';
import { DataSourceSelectArguments } from 'maishu-wuzhui-helper';
import { DataHelper } from 'maishu-node-data';

@controller('user')
export default class UserController {

    //====================================================
    /** 手机是否已注册 */
    @action()
    async isMobileRegister(@permissionDataContext dc: UserDataContext, @routeData { mobile }): Promise<boolean> {
        if (!mobile) throw errors.argumentNull('mobile')
        if (!dc) throw errors.argumentNull('dc')

        let user = await dc.users.findOne({ mobile });
        return user != null;
    }

    @action()
    async isUserNameRegister(@permissionDataContext dc: UserDataContext, @routeData { user_name }): Promise<boolean> {
        if (!user_name) throw errors.argumentNull('user_name')
        if (!dc) throw errors.argumentNull('dc')

        let user = await dc.users.findOne({ user_name });
        return user != null;

    }

    @action()
    async isEmailRegister(@permissionDataContext dc: UserDataContext, @routeData { email }): Promise<boolean> {
        if (!email) throw errors.argumentNull('user_name')
        if (!dc) throw errors.argumentNull('dc')

        let user = await dc.users.findOne({ email });
        return user != null;
    }

    @action()
    async register(@permissionDataContext dc: UserDataContext,
        @routeData { mobile, password, smsId, verifyCode, data }: { mobile: string, password: string, smsId: string, verifyCode: string, data: any }) {
        if (mobile == null)
            throw errors.argumentNull('mobile');

        if (!password)
            throw errors.argumentNull('password')

        if (smsId == null)
            throw errors.argumentNull('smsId');

        if (verifyCode == null)
            throw errors.argumentNull('verifyCode');

        data = data || {}

        let ctrl = new SMSController();
        if (!ctrl.checkVerifyCode(dc, { smsId, verifyCode }))
            throw errors.verifyCodeIncorrect(verifyCode);

        let user: User = {
            id: guid(), mobile, password, data,
            create_date_time: new Date(Date.now())
        }

        await dc.users.insert(user);

        let r: LoginResult = { userId: user.id };
        return new ContentResult(JSON.stringify(r), "application/json", statusCodes.login);
    }

    private loginActionResult(userId: string) {
        let r: LoginResult = { userId: userId };
        return new ContentResult(JSON.stringify(r), "application/json", statusCodes.login);
    }

    @action()
    async resetPassword(@permissionDataContext dc: UserDataContext, @routeData { mobile, password, smsId, verifyCode }) {
        if (mobile == null)
            throw errors.argumentNull('mobile');

        if (!password)
            throw errors.argumentNull('password')

        if (smsId == null)
            throw errors.argumentNull('smsId');

        if (verifyCode == null)
            throw errors.argumentNull('verifyCode');

        let user = await dc.users.findOne({ mobile });
        if (user == null) {
            throw errors.mobileNotExists(mobile)
        }

        user.password = password;
        await dc.users.save(user);

        return this.loginActionResult(user.id);
    }

    @action()
    async resetMobile(@permissionDataContext dc: UserDataContext, @currentUserId userId: string, @routeData { mobile, smsId, verifyCode }) {
        if (!userId)
            throw errors.userIdNull();

        if (mobile == null)
            throw errors.argumentNull('mobile');

        if (smsId == null)
            throw errors.argumentNull('smsId');

        if (verifyCode == null)
            throw errors.argumentNull('verifyCode');

        let isMobileRegister = await this.isMobileRegister(dc, { mobile })
        if (isMobileRegister)
            throw errors.mobileExists(mobile)

        let smsRecord = await dc.smsRecords.findOne({ id: smsId });
        if (smsRecord == null || smsRecord.code != verifyCode) {
            throw errors.verifyCodeIncorrect(verifyCode)
        }

        await dc.users.update({ id: userId }, { mobile })

        return { id: userId };
    }

    async loginByUserName(dc: UserDataContext, { username, password }): Promise<LoginResult> {

        if (!username) throw errors.argumentNull("username")
        if (!password) throw errors.argumentNull('password')

        //TODO: 检查 username 类型
        let usernameRegex = /^[a-zA-Z\-]+$/;
        let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let type: 'mobile' | 'username' | 'email' =
            usernameRegex.test(username) ? 'username' :
                emailRegex.test(username) ? 'email' : 'mobile' //'mobile'

        let where: FindOneOptions<User>["where"];
        let user: User;
        switch (type) {
            default:
            case 'mobile':
                // sql = `select id from user where mobile = ? and password = ?`
                where = { mobile: username, password };
                break
            case 'username':
                // sql = `select id from user where user_name = ? and password = ?`
                // user = await dc.users.findOne({ user_name: username, password });
                where = { user_name: username, password };
                break
            case 'email':
                // sql = `select id from user where email = ? and password = ?`
                // user = await dc.users.findOne({ email: username, password });
                where = { email: username, password };
                break
        }

        user = await dc.users.findOne({ where, relations: [] });
        if (user == null) {
            throw errors.usernameOrPasswordIncorrect(username)
        }

        // let token = await TokenManager.create({ user_id: user.id } as UserToken)
        // return { token: token.id, userId: user.id, roleId: user.role_id }
        let r: LoginResult = { userId: user.id };
        return r;
    }

    private async loginByOpenId<T extends { openid }>(dc: UserDataContext, args: T): Promise<LoginResult> {
        let { openid } = args
        if (!openid) throw errors.argumentNull('openid')

        let user = await dc.users.findOne({ where: { openid: openid, } });
        if (user == null) {
            user = {
                id: guid(), openid, create_date_time: new Date(Date.now()),
                data: args
            } as User
            await dc.users.save(user);
        }

        // let token = await TokenManager.create({ user_id: user.id });
        // return { token: token.id, userId: user.id, roleId: user.role_id };
        let r: LoginResult = { userId: user.id };
        return r;
    }

    private async loginByVerifyCode(@permissionDataContext dc: UserDataContext,
        @routeData args: { mobile: string, smsId: string, verifyCode: string }): Promise<LoginResult> {

        let { mobile, smsId, verifyCode } = args

        let user = await dc.users.findOne({ where: { mobile } });
        if (user == null)
            throw errors.mobileExists(mobile);

        let smsRecord = await dc.smsRecords.findOne(smsId);
        if (smsRecord == null || smsRecord.code != verifyCode)
            throw errors.verifyCodeIncorrect(verifyCode);

        let r: LoginResult = { userId: user.id, };
        return r;
    }

    @action()
    async login(@permissionDataContext dc: UserDataContext, @routeData args: any) {
        args = args || {}

        let p: LoginResult;
        if (args.openid) {
            p = await this.loginByOpenId(dc, args)
        }
        else if (args.smsId) {
            p = await this.loginByVerifyCode(dc, args)
        }
        else {
            p = await this.loginByUserName(dc, args)
        }

        let r = await dc.userLatestLogins.findOne(p.userId);
        if (r == null) {
            r = { id: p.userId, latest_login: new Date(Date.now()), create_date_time: new Date(Date.now()) };
        }
        else {
            r.latest_login = new Date(Date.now());
        }
        await dc.userLatestLogins.save(r);


        return new ContentResult(JSON.stringify(p), "application/json", statusCodes.login);
    }

    @action()
    async logout() {
        return new ContentResult(JSON.stringify({}), "application/json", statusCodes.logout);
    }

    /** 获取登录用户的信息 */
    @action()
    async me(@currentUser user: User) {
        if (!user)
            return null;

        return {
            id: user.id, mobile: user.mobile, user_name: user.user_name,
            // roles: user.roles,
        } as Partial<User>;
    }

    /** 获取用户信息 */
    @action()
    async item(@permissionDataContext dc: UserDataContext, @routeData { userId }: { userId: string }) {
        if (!userId) throw errors.userIdNull();

        let user = await dc.users.findOne(userId);
        return user
    }

    @action()
    async list(@permissionDataContext dc: UserDataContext, @routeData d: { args: DataSourceSelectArguments }) {
        // let users = await dc.users.find();
        // return users;
        let r = DataHelper.list(dc.users, { selectArguments: d.args });
        return r;
    }

    /** 添加用户 */
    @action()
    async add(@permissionDataContext dc: UserDataContext, @routeData { item }: { item: User }): Promise<Partial<User>> {
        if (item.mobile) {
            let isMobileRegister = await this.isMobileRegister(dc, { mobile: item.mobile })
            if (isMobileRegister)
                return Promise.reject(errors.mobileExists(item.mobile))
        }

        if (item.email) {
            let isEmailRegister = await this.isEmailRegister(dc, { email: item.email })
            if (isEmailRegister)
                return Promise.reject(errors.emailExists(item.email))
        }

        if (item.user_name) {
            let isUserNameRegister = await this.isUserNameRegister(dc, { user_name: item.user_name })
            if (isUserNameRegister)
                return Promise.reject(errors.usernameExists(item.user_name))
        }

        item.id = guid();
        item.create_date_time = new Date(Date.now());

        await dc.users.save(item);
        return { id: item.id, create_date_time: item.create_date_time };
    }

    @action()
    async remove(@permissionDataContext dc: UserDataContext, @routeData { id }) {
        if (!id) throw errors.argumentFieldNull("id", "routeData");
        await dc.users.delete(id);
        return { id };
    }

    @action()
    async update(@permissionDataContext dc: UserDataContext, @routeData { user }: { user: User }) {
        if (!user) throw errors.argumentNull('user');
        if (!user.id) throw errors.argumentFieldNull("id", "user");

        let entity: Partial<User> = {
            id: user.id, email: user.email,
        };

        if (user.password)
            entity.password = user.password;

        await dc.users.save(entity);
        return { id: entity.id, } as Partial<User>
    }

    @action()
    async userLatestLogin(@permissionDataContext dc: UserDataContext, @routeData { userIds }: { userIds: string[] }) {
        let items = await dc.userLatestLogins.createQueryBuilder()
            .where(" id in (...:userIds)")
            .setParameter("userIds", userIds)
            .getMany();

        return items;
    }
}





