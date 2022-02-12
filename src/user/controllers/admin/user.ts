import { errors } from '../../errors';
import { controller, action, routeData, ContentResult } from 'maishu-node-mvc';
import { UserDataContext } from '../../data-context';
import { userDataContext, currentUserId, currentUser } from "../../decorators";
import { User } from '../../entities';
import { DataSourceSelectArguments, guid } from 'maishu-toolkit';
import { adminApiBasePath } from '../../global';
import MemberController from "../user";
import UserController from '../user';
import { currentAppId } from '../../decorators/current-user-id';

type BaseUserController = Pick<UserController, "me" | "login">;

var userController = new UserController();

@controller(`${adminApiBasePath}/user`)
export default class AdminMemberController implements BaseUserController {

    @action()
    login(@userDataContext dc: UserDataContext, @routeData args: any): Promise<ContentResult> {
        return userController.login(dc, args);
    }

    @action()
    me(@currentUser user: User): Promise<Partial<User>> {
        return userController.me(user);
    }

    /** 添加用户 */
    @action()
    async add(@userDataContext dc: UserDataContext, @routeData d: { item: User }): Promise<Partial<User>> {
        let { item } = d;
        if (!item) throw errors.routeDataFieldNull("item");

        if (d.item.id) {
            let r: User = await dc.users.findOne({ select: ["id"], where: { id: d.item.id } });
            if (r) {
                return { id: r.id };
            }
        }

        let ctrl = new MemberController();
        if (item.mobile) {
            let isMobileRegister = await ctrl.isMobileRegister(dc, { mobile: item.mobile })
            if (isMobileRegister)
                return Promise.reject(errors.mobileExists(item.mobile))
        }

        if (item.email) {
            let isEmailRegister = await ctrl.isEmailRegister(dc, { email: item.email })
            if (isEmailRegister)
                return Promise.reject(errors.emailExists(item.email))
        }

        if (item.user_name) {
            let isUserNameRegister = await ctrl.isUserNameRegister(dc, { user_name: item.user_name })
            if (isUserNameRegister)
                return Promise.reject(errors.usernameExists(item.user_name))
        }

        item.id = item.id || guid();
        item.create_date_time = new Date(Date.now());

        await dc.users.insert(item);
        return { id: item.id, create_date_time: item.create_date_time };
    }


    @action()
    async addIfNotExists(@userDataContext dc: UserDataContext, @routeData { item }: { item: User }) {
        if (!item) throw errors.routeDataFieldNull("item");

        if (item.id) {
            let entity = await dc.users.findOne(item.id);
            if (entity != null) {
                return entity;
            }
        }

        return this.add(dc, { item });
    }

    @action()
    async remove(@userDataContext dc: UserDataContext, @routeData { id }) {
        if (!id) throw errors.argumentFieldNull("id", "routeData");
        await dc.users.delete(id);
        return { id };
    }

    @action()
    async update(@userDataContext dc: UserDataContext, @routeData d: { user: User }) {
        if (!d.user) throw errors.argumentNull('user');
        if (!d.user.id) throw errors.argumentFieldNull("id", "user");

        let q = dc.users.createQueryBuilder("u");
        let query = "u.id <> :id";
        let orQuery = "";
        if (d.user.mobile)
            orQuery = "or u.mobile = :mobile "; //q.orWhere("u.mobile = :mobile", { mobile: d.user.mobile })

        if (d.user.email)
            orQuery = orQuery + "or u.email = :email ";//q.orWhere("u.email = :email", { email: d.user.email })

        if (d.user.user_name)
            orQuery = orQuery = "or u.user_name = :user_name ";//q.orWhere("u.user_name = :user_name", { user_name: d.user.user_name })

        if (orQuery) {
            orQuery = orQuery.substr(2);
            query = query + " and (" + orQuery + ")";
        }

        let obj = await q.where(query, d.user).select(["u.mobile", "u.email", "u.user_name"]).getOne();
        if (obj?.mobile != null && obj?.mobile == d.user.mobile)
            throw errors.mobileExists(d.user.mobile);

        if (obj?.user_name != null && obj?.user_name == d.user.user_name)
            throw errors.usernameExists(d.user.user_name);

        if (obj?.email != null && obj?.email == d.user.email)
            throw errors.emailExists(d.user.email);

        // d.user.id = d.user.id || guid();
        // d.user.create_date_time = d.user.create_date_time || new Date();
        let keys = Object.keys(d.user);
        for (let i = 0; i < keys.length; i++) {
            if (d.user[keys[i]] === undefined) {
                delete d.user[keys[i]];
            }
        }

        delete d.user.create_date_time;
        await dc.users.update(d.user.id, d.user);
        return { id: d.user.id, } as Partial<User>
    }

    @action()
    async userLatestLogin(@userDataContext dc: UserDataContext, @routeData { userIds }: { userIds: string[] }, @currentAppId appId: string): Promise<User[]> {

        const ID: keyof User = "id";
        const APPLICATION_ID: keyof User = "application_id";
        var query = `${ID} in (...:userIds)`;
        if (appId) {
            query = `(${query}) and (${APPLICATION_ID} = :appId)`;
        }
        else {
            query = `(${query}) and (${APPLICATION_ID} is null)`;
        }
        var q = dc.users.createQueryBuilder().where(query).setParameter("userIds", userIds);
        if (appId) {
            q.setParameter("appId", appId);
        }

        let items = await q.getMany();
        return items;
    }

    @action()
    async changePassword(@userDataContext dc: UserDataContext, @routeData d: { oldPassword: string, newPassword: string },
        @currentUserId currentUserId: string) {
        let ctrl = new MemberController();
        return ctrl.changePassword(dc, d, currentUserId);
    }

    @action()
    async users(@routeData d: { ids: string[] }, @userDataContext dc: UserDataContext, @currentAppId appId: string): Promise<User[]> {
        if (!d.ids) throw errors.routeDataFieldNull("ids");
        if (!Array.isArray(d.ids)) throw errors.routeDataFieldTypeIncorrect("ids", "array", typeof d.ids);
        if (d.ids.length == 0) throw errors.parameterArrayIsEmpty("ids");

        const ID: keyof User = "id";
        const APPLICATION_ID: keyof User = "application_id";

        var query = `${ID} in (...:userIds)`;
        if (appId) {
            query = `(${query}) and (${APPLICATION_ID} = :appId)`;
        }
        else {
            query = `(${query}) and (${APPLICATION_ID} is null)`;
        }

        var q = dc.users.createQueryBuilder().where(query).setParameter("userIds", d.ids);
        if (appId)
            q.setParameter(":appId", appId);

        let users = await q.getMany();
        return users;
    }

    @action()
    async list(@userDataContext dc: UserDataContext, @routeData d: { args: DataSourceSelectArguments }) {
        let ctrl = new MemberController();
        return ctrl.list(dc, d);
    }

    /** 获取用户信息 */
    @action()
    async item(@userDataContext dc: UserDataContext, @routeData { userId }: { userId: string }) {
        if (!userId) throw errors.userIdNull();

        let user = await dc.users.findOne(userId);
        return user
    }

    @action()
    async enableUser(@userDataContext dc: UserDataContext, @routeData d: { userId: string, enable?: boolean }) {
        if (!d.userId) throw errors.userIdNull();

        let user = await dc.users.findOne(d.userId);
        if (!user) throw errors.objectNotExistWithId(d.userId, 'User');

        let enable: boolean = d.enable == null ? true : d.enable;
        user.invalid = !enable;

        await dc.users.update(d.userId, { invalid: user.invalid });
        return user
    }

    @action()
    async updateMe(@currentUserId userId: string, @userDataContext dc: UserDataContext, @routeData d: { user: Partial<User> }) {
        let ctrl = new MemberController();
        return ctrl.updateMe(userId, dc, d);
    }
}