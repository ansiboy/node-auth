import { connect, execute, guid, connection, list, insert, update, select, executeSQL } from '../database';
import { errors } from '../errors';
import { Token } from '../token';
import * as db from 'maishu-mysql-helper';
import { Application } from './application';
import RoleController from './role';
import { controller, formData, action } from 'maishu-node-mvc';
import * as mysql from 'mysql'
import { UserId } from '../decorators';
import { authDataContext, AuthDataContext } from '../dataContext';
import { UserLatestLogin, User, Role } from '../entities';

@controller('/user')
export default class UserController {

    //====================================================
    /** 手机是否已注册 */
    @action()
    async isMobileRegister(@authDataContext dc: AuthDataContext, @formData { mobile }): Promise<boolean> {
        if (!mobile) throw errors.argumentNull('mobile')
        if (!dc) throw errors.argumentNull('dc')

        let user = await dc.users.findOne({ mobile });
        return user != null;
    }

    @action()
    async isUserNameRegister(@authDataContext dc: AuthDataContext, @formData { user_name }): Promise<boolean> {
        if (!user_name) throw errors.argumentNull('user_name')
        if (!dc) throw errors.argumentNull('dc')

        let user = await dc.users.findOne({ user_name });
        return user != null;

    }

    @action()
    async isEmailRegister(@authDataContext dc: AuthDataContext, @formData { email }): Promise<boolean> {
        if (!email) throw errors.argumentNull('user_name')
        if (!dc) throw errors.argumentNull('dc')

        let user = await dc.users.findOne({ email });
        return user != null;
    }

    @action()
    async register(@connection conn: mysql.Connection,
        @formData { mobile, password, smsId, verifyCode, data }: { mobile: string, password: string, smsId: string, verifyCode: string, data: any }) {
        if (mobile == null)
            throw errors.argumentNull('mobile');

        if (!password)
            throw errors.argumentNull('password')

        if (smsId == null)
            throw errors.argumentNull('smsId');

        if (verifyCode == null)
            throw errors.argumentNull('verifyCode');

        data = data || {}
        // let user = await connect(async conn => {

        let sql = `select code from sms_record where id = ?`
        let [rows] = await execute(conn, sql, [smsId])
        if (rows == null || rows.length == 0 || rows[0].code != verifyCode) {
            throw errors.verifyCodeIncorrect(verifyCode)
        }

        let user = {
            id: guid(), mobile, password, data,
            create_date_time: new Date(Date.now()),
        } as User

        sql = 'insert into user set ?'
        await execute(conn, sql, user)
        // return user
        // })

        let token = await Token.create({ user_id: user.id } as UserToken);
        return { token: token.id, userId: user.id };
    }

    @action()
    async resetPassword(@connection conn: mysql.Connection, @formData { mobile, password, smsId, verifyCode }) {
        if (mobile == null)
            throw errors.argumentNull('mobile');

        if (!password)
            throw errors.argumentNull('password')

        if (smsId == null)
            throw errors.argumentNull('smsId');

        if (verifyCode == null)
            throw errors.argumentNull('verifyCode');

        let sql = `select * from user where mobile = ?`
        let [rows] = await execute(conn, sql, [mobile, password])

        let user: User = rows == null ? null : rows[0]
        if (user == null) {
            throw errors.mobileNotExists(mobile)
        }

        sql = `update user set password = ? where mobile = ?`
        await execute(conn, sql, [password, mobile])

        let token = await Token.create({ user_id: user.id } as UserToken);
        return { token: token.id, userId: user.id };
    }

    @action()
    async resetMobile(@authDataContext dc: AuthDataContext, @UserId userId: string, @formData { mobile, smsId, verifyCode }) {
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

    async loginByUserName(dc: AuthDataContext, { username, password }) {

        if (!username) throw errors.argumentNull("username")
        if (!password) throw errors.argumentNull('password')

        //TODO: 检查 username 类型
        let usernameRegex = /^[a-zA-Z\-]+$/;
        let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let type: 'mobile' | 'username' | 'email' =
            usernameRegex.test(username) ? 'username' :
                emailRegex.test(username) ? 'email' : 'mobile' //'mobile'

        let sql: string
        let user: User;
        switch (type) {
            default:
            case 'mobile':
                // sql = `select id from user where mobile = ? and password = ?`
                user = await dc.users.findOne({ mobile: username, password });
                break
            case 'username':
                // sql = `select id from user where user_name = ? and password = ?`
                user = await dc.users.findOne({ user_name: username, password });
                break
            case 'email':
                // sql = `select id from user where email = ? and password = ?`
                user = await dc.users.findOne({ email: username, password });
                break
        }

        // let [rows] = await execute(conn, sql, [username, password])

        // let user: User = rows == null ? null : rows[0]
        if (user == null) {
            throw errors.usernameOrPasswordIncorrect(username)
        }

        let token = await Token.create({ user_id: user.id } as UserToken)
        return { token: token.id, userId: user.id }
    }

    private async loginByOpenId<T extends { openid }>(dc: AuthDataContext, args: T) {
        let { openid } = args
        if (!openid) throw errors.argumentNull('openid')
        // let sql = `select id from user where openid = ?`
        // let [rows] = await execute(conn, sql, [openid])
        let user = await dc.users.findOne({ openid: openid });
        // let user: User
        if (user == null) {
            user = {
                id: guid(), openid, create_date_time: new Date(Date.now()),
                data: args
            } as User
            // sql = `insert into user set ?`
            // await execute(conn, sql, user)
            await dc.users.save(user);
        }

        let token = await Token.create({ user_id: user.id });
        return { token: token.id, userId: user.id };
    }

    private async loginByVerifyCode(@connection conn: mysql.Connection, @formData args: { mobile: string, smsId: string, verifyCode: string }) {
        let { mobile, smsId, verifyCode } = args
        // let r = await connect(async conn => {
        let sql = `select id form user where mobile = ?`
        let [rows] = await execute(conn, sql, [args.mobile])
        if (rows.length == 0) {
            throw errors.mobileNotExists(mobile)
        }

        sql = `select code from sms_record where id = ?`;
        [rows] = await execute(conn, sql, [smsId])
        if (rows == null || rows.length == 0 || rows[0].code != verifyCode) {
            throw errors.verifyCodeIncorrect(verifyCode)
        }

        let user = rows[0]
        let token = await Token.create({ user_id: user.id } as UserToken)
        return { token: token.id, userId: user.id }
        // })
        // return r
    }

    @action()
    async login(@authDataContext dc: AuthDataContext, @connection conn: mysql.Connection, @formData args: any): Promise<{ token: string, userId: string }> {
        args = args || {}

        let p: { token: string, userId: string };
        if (args.openid) {
            p = await this.loginByOpenId(dc, args)
        }
        else if (args.smsId) {
            p = await this.loginByVerifyCode(conn, args)
        }
        else {
            p = await this.loginByUserName(dc, args)
        }

        // let o = await p;
        let r = await dc.userLatestLogins.findOne(p.userId);//.then(r => {
        if (r == null) {
            r = { id: p.userId, latest_login: new Date(Date.now()) }
        }
        else {
            r.latest_login = new Date(Date.now());
        }
        await dc.userLatestLogins.save(r);


        return p
    }

    /** 获取登录用户的信息 */
    @action()
    async me(@UserId userId) {
        if (!userId) throw errors.argumentNull('USER_ID')

        return this.item({ userId: userId })
    }

    /** 获取用户信息 */
    @action()
    async item(@formData { userId }: { userId: string }) {
        if (!userId) throw errors.argumentNull("userId")

        let user = await connect(async conn => {
            let sql = `select id, user_name, mobile, openid, data from user where id = ?`
            let [rows] = await execute(conn, sql, [userId])
            return rows[0] as User
        })

        return user
    }

    /**
     * 获取当前登录用户角色
     * @param param0
     * 1. userId string 
     */
    @action()
    async getRoles(@UserId USER_ID) {
        if (!USER_ID) throw errors.argumentNull('USER_ID')

        let roles = await connect(async conn => {
            let sql = `select r.*
                       from user_role as ur left join role as r on ur.role_id = r.id
                       where ur.user_id = ?`
            let [rows] = await execute(conn, sql, [USER_ID])
            return rows
        })

        return roles
    }

    /**
     * 设置用户权限
     * @param param0 
     * 1. userId string, 用设置权限的用户 ID
     * 1. roleIds string[], 角色 ID 数组
     */
    @action()
    async setRoles(@connection conn: mysql.Connection, @formData { userId, roleIds }) {
        if (!userId) throw errors.argumentNull('userId')
        if (!roleIds) throw errors.argumentNull('roleIds')
        if (!conn) throw errors.argumentNull('conn')
        if (!Array.isArray(roleIds)) throw errors.argumentTypeIncorrect('roleIds', 'array')

        await execute(conn, `delete from user_role where user_id = ?`, userId)

        if (roleIds.length > 0) {
            let values = []
            let sql = `insert into user_role (user_id, role_id) values `
            for (let i = 0; i < roleIds.length; i++) {
                sql = sql + "(?,?)"
                values.push(userId, roleIds[i])
            }

            await execute(conn, sql, values)
        }
    }

    /**
     * 获取用户角色编号
     */
    @action("/role/userRoleIds", "role/ids")
    async userRoleIds(@connection conn: mysql.Connection, @formData { userIds }: { userIds: string[] }): Promise<UserRole[]> {
        if (userIds == null) throw errors.argumentNull('userIds')
        if (conn == null) throw errors.argumentNull('conn')

        let str = userIds.map(o => `"${o}"`).join(',');
        // let r = await list<UserRole[]>(conn, `user_role`, `user_id in (${str})`)
        let sql = `select * from user_role where user_id in (${str})`
        let r = await executeSQL(conn, sql, null) as UserRole[]
        return r
    }


    @action("addRoles", "role/add")
    async addRoles(@connection conn: mysql.Connection, @formData { userId, roleIds }) {
        if (!userId) throw errors.argumentNull("userId")
        if (!roleIds) throw errors.argumentNull("roleIds")
        if (!conn) throw errors.argumentNull("conn")

        if (!Array.isArray(roleIds)) throw errors.argumentTypeIncorrect('roleIds', 'array')
        if (roleIds.length == 0)
            return errors.argumentEmptyArray("roleIds")

        let roleController = new RoleController()
        let userRoles = await this.userRoleIds(conn, { userIds: [userId] })
        let userRoleIds = userRoles.map(o => o.role_id)
        let values = []
        let sql = `insert into user_role (user_id, role_id) values `
        for (let i = 0; i < roleIds.length; i++) {
            if (userRoleIds.indexOf(roleIds[i]) >= 0)
                continue

            sql = sql + "(?,?)"
            values.push(userId, roleIds[i])
        }

        if (values.length > 0)
            await execute(conn, sql, values)
    }

    @action()
    async list(@connection conn: mysql.Connection, @formData { args }: { args: db.SelectArguments }) {
        let result = await list<User>(conn, 'user', args)
        return result
    }

    /** 添加用户 */
    @action()
    async add(@authDataContext dc: AuthDataContext, @connection conn: mysql.Connection, @formData { item, roleIds }: Args.addUser) {

        let p: Promise<boolean>[] = []
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

        item.id = guid()
        item.create_date_time = new Date(Date.now())
        item.roles = roleIds.map(o => ({ id: o }) as Role)
        await dc.users.save(item)

        // roleIds = roleIds || []
        // for (let i = 0; i < roleIds.length; i++) {
        //     let userRole: UserRole = { user_id: item.id, role_id: roleIds[i] }
        //     await conn.query("insert into user_role set ?", userRole)
        // }

        return { id: item.id }
    }

    @action()
    async update(@connection conn: mysql.Connection, @UserId USER_ID, @formData { user }) {
        if (!user) throw errors.argumentNull('user')
        let u = user as User
        u.id = USER_ID

        let result = await update(conn, 'user', user)
        return result
    }

    /** 显示用户所拥有的应用 */
    @action("ownAppliactions", "applicaion/list")
    ownAppliactions(@connection conn, @UserId USER_ID) {
        if (!USER_ID) throw errors.argumentNull('USER_ID')
        if (!conn) throw errors.argumentNull('conn')

        return db.list<Application>(conn, 'application', { filter: `user_id = '${USER_ID}'` })
    }

    /** 显示用户所允许访问的应用 */
    @action()
    async canVisitApplicationIds(@connection conn: mysql.Connection, @UserId USER_ID, ) {
        type ApplicationUser = { user_id: string, application_id: string }
        let items = await select<ApplicationUser>(conn, 'application_user', { filter: `user_id = '${USER_ID}'` })
        return items.map(o => o.application_id)
    }

    @action()
    async UserLatestLogin(@authDataContext dc: AuthDataContext, @formData { userIds }: { userIds: string[] }) {
        let items = await dc.userLatestLogins.createQueryBuilder()
            .where(" id in (...:userIds)")
            .setParameter("userIds", userIds)
            .getMany();

        return items;
    }
}



module Args {
    export type addUser = { item: User, roleIds: string[], conn: db.Connection }

}





