import { connect, execute, guid } from '../database';
import { errors } from '../errors';
import { Token } from '../token';
import * as db from 'maishu-mysql-helper';
import { action } from '../controller';
import { Application } from './application';
import RoleController from './role';

export default class UserController {

    //====================================================
    /** 手机是否已注册 */
    async isMobileRegister({ mobile }): Promise<boolean> {
        if (!mobile) throw errors.argumentNull('mobile')

        return connect(async conn => {
            let sql = `select id from user where mobile = ? limit 1`
            let [rows] = await execute(conn, sql, [mobile])
            return (rows || []).length > 0
        })
    }

    async isUserNameRegister({ user_name }): Promise<boolean> {
        if (!user_name) throw errors.argumentNull('user_name')
        return connect(async conn => {
            let sql = `select id from user where user_name = ? limit 1`
            let [rows] = await execute(conn, sql, [user_name])
            return (rows || []).length > 0
        })
    }

    async isEmailRegister({ email }): Promise<boolean> {
        if (!email) throw errors.argumentNull('user_name')
        return connect(async conn => {
            let sql = `select id from user where user_name = ? limit 1`
            let [rows] = await execute(conn, sql, [email])
            return (rows || []).length > 0
        })
    }

    async register({ mobile, password, smsId, verifyCode, data }: { mobile: string, password: string, smsId: string, verifyCode: string, data: any }) {
        if (mobile == null)
            throw errors.argumentNull('mobile');

        if (!password)
            throw errors.argumentNull('password')

        if (smsId == null)
            throw errors.argumentNull('smsId');

        if (verifyCode == null)
            throw errors.argumentNull('verifyCode');

        data = data || {}
        let user = await connect(async conn => {

            let sql = `select code from sms_record where id = ?`
            let [rows] = await execute(conn, sql, [smsId])
            if (rows == null || rows.length == 0 || rows[0].code != verifyCode) {
                throw errors.verifyCodeIncorrect(verifyCode)
            }

            let user = {
                id: guid(), mobile, password, data: JSON.stringify(data),
                create_date_time: new Date(Date.now()),
            } as User

            sql = 'insert into user set ?'
            await execute(conn, sql, user)
            return user
        })

        let token = await Token.create({ user_id: user.id } as UserToken);
        return { token: token.id, userId: user.id };
    }

    async resetPassword({ mobile, password, smsId, verifyCode }) {
        if (mobile == null)
            throw errors.argumentNull('mobile');

        if (!password)
            throw errors.argumentNull('password')

        if (smsId == null)
            throw errors.argumentNull('smsId');

        if (verifyCode == null)
            throw errors.argumentNull('verifyCode');

        let result = await connect(async conn => {
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
        })

        return result
    }

    async resetMobile({ mobile, smsId, verifyCode, USER_ID }) {
        if (mobile == null)
            throw errors.argumentNull('mobile');

        if (smsId == null)
            throw errors.argumentNull('smsId');

        if (verifyCode == null)
            throw errors.argumentNull('verifyCode');

        let isMobileRegister = await this.isMobileRegister({ mobile })
        if (isMobileRegister)
            throw errors.mobileExists(mobile)

        let result = await connect(async conn => {

            let sql = `select code from sms_record where id = ?`
            let [rows] = await execute(conn, sql, [smsId])
            if (rows == null || rows.length == 0 || rows[0].code != verifyCode) {
                throw errors.verifyCodeIncorrect(verifyCode)
            }

            sql = `update user set mobile = ? where id = ?`
            await execute(conn, sql, [mobile, USER_ID])

            return {};
        })

        return result
    }

    async loginByUserName({ username, password }) {

        if (!username) throw errors.argumentNull("username")
        if (!password) throw errors.argumentNull('password')

        //TODO: 检查 username 类型
        let usernameRegex = /^[a-zA-Z\-]+$/;
        let type: 'mobile' | 'username' | 'email' = usernameRegex.test(username) ? 'username' : 'mobile' //'mobile'
        let [rows] = await connect(conn => {
            let sql: string
            switch (type) {
                default:
                case 'mobile':
                    sql = `select id from user where mobile = ? and password = ?`
                    break
                case 'username':
                    sql = `select id from user where user_name = ? and password = ?`
                    break
                case 'email':
                    sql = `select id from user where email = ? and password = ?`
                    break
            }
            return execute(conn, sql, [username, password])
        })

        let user: User = rows == null ? null : rows[0]
        if (user == null) {
            throw errors.usernameOrPasswordIncorrect(username)
        }

        let token = await Token.create({ user_id: user.id } as UserToken)
        return { token: token.id, userId: user.id }
    }
    async loginByOpenId<T extends { openid }>(args: T) {
        let { openid } = args
        if (!openid) throw errors.argumentNull('openid')
        let user = await connect(async conn => {
            let sql = `select id from user where openid = ?`
            let [rows] = await execute(conn, sql, [openid])
            if (rows.length > 0) {
                return rows[0] as User
            }

            let user = {
                id: guid(), openid, create_date_time: new Date(Date.now()),
                data: JSON.stringify(args)
            } as User
            sql = `insert into user set ?`
            await execute(conn, sql, user)
            return user
        })

        let token = await Token.create({ user_id: user.id } as UserToken);
        return { token: token.id, userId: user.id };
    }
    async loginByVerifyCode(args: { mobile: string, smsId: string, verifyCode: string }) {
        let { mobile, smsId, verifyCode } = args
        let r = await connect(async conn => {
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
        })
        return r
    }

    @action()
    async login(args: any): Promise<{ token: string, userId: string }> {
        args = args || {}

        let p: Promise<{ token: string, userId: string }>
        if (args.openid) {
            p = this.loginByOpenId(args)
        }
        else if (args.smsId) {
            p = this.loginByVerifyCode(args)
        }
        else {
            p = this.loginByUserName(args)
        }

        p.then(o => {
            let conn = args.conn
            console.assert(conn != null)
            // connect(async conn => {
            let now = new Date(Date.now())
            db.update<User>(conn, 'user', { id: o.userId, lastest_login: now })
            return o;
        })

        return p
    }

    /** 获取登录用户的信息 */
    async me({ USER_ID }) {
        if (!USER_ID) throw errors.argumentNull('USER_ID')

        return this.item({ userId: USER_ID })
    }

    /** 获取用户信息 */
    async item({ userId }: { userId: string }) {
        if (!userId) throw errors.argumentNull("userId")

        let user = await connect(async conn => {
            let sql = `select id, user_name, mobile, openid, data from user where id = ?`
            let [rows] = await execute(conn, sql, [userId])
            return rows[0] as User
        })

        return user
    }

    /**
     * 获取用户角色
     * @param param0
     * 1. userId string 
     */
    async getRoles({ USER_ID }) {
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
    async setRoles({ userId, roleIds, conn }) {
        if (!userId) throw errors.argumentNull('userId')
        if (!roleIds) throw errors.argumentNull('roleIds')
        if (!conn) throw errors.argumentNull('conn')
        if (!Array.isArray(roleIds)) throw errors.argumentTypeIncorrect('roleIds', 'array')

        await db.execute(conn, `delete from user_role where user_id = ?`, userId)

        if (roleIds.length > 0) {
            let values = []
            let sql = `insert into user_role (user_id, role_id) values `
            for (let i = 0; i < roleIds.length; i++) {
                sql = sql + "(?,?)"
                values.push(userId, roleIds[i])
            }

            await db.execute(conn, sql, values)
        }
    }

    @action()
    async addRoles({ userId, roleIds, conn }) {
        if (!userId) throw errors.argumentNull("userId")
        if (!roleIds) throw errors.argumentNull("roleIds")
        if (!conn) throw errors.argumentNull("conn")

        if (!Array.isArray(roleIds)) throw errors.argumentTypeIncorrect('roleIds', 'array')
        if (roleIds.length == 0)
            return errors.argumentEmptyArray("roleIds")

        // await db.execute(conn, `delete from user_role where user_id = ? and role_id in (${roleIds.map(o => '?').join(',')})`, [userId, ...roleIds])
        let roleController = new RoleController()
        let userRoles = await roleController.userRoleIds({ userIds: [userId], conn })
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
            await db.execute(conn, sql, values)
    }

    @action()
    async list({ args, conn }: { args: db.SelectArguments, conn: db.Connection }) {
        let result = await db.list<User>(conn, 'user', args)
        return result
    }

    /** 添加用户 */
    @action()
    async add({ item, conn, roleIds }: Args.addUser) {

        let p: Promise<boolean>[] = []
        if (item.mobile) {
            let isMobileRegister = await this.isMobileRegister({ mobile: item.mobile })
            if (isMobileRegister)
                return Promise.reject(errors.mobileExists(item.mobile))
        }

        if (item.email) {
            let isEmailRegister = await this.isEmailRegister({ email: item.email })
            if (isEmailRegister)
                return Promise.reject(errors.emailExists(item.email))
        }

        if (item.user_name) {
            let isUserNameRegister = await this.isUserNameRegister({ user_name: item.user_name })
            if (isUserNameRegister)
                return Promise.reject(errors.usernameExists(item.user_name))
        }

        item.id = guid()
        item.create_date_time = new Date(Date.now())
        await db.insert(conn, 'user', item)

        roleIds = roleIds || []
        for (let i = 0; i < roleIds.length; i++) {
            let userRole: UserRole = { user_id: item.id, role_id: roleIds[i] }
            await conn.source.query("insert into user_role set ?", userRole)
        }

        return { id: item.id }
    }

    @action()
    async update({ USER_ID, user, conn }) {
        if (!user) throw errors.argumentNull('user')
        let u = user as User
        u.id = USER_ID

        let result = await db.update(conn, 'user', user)
        return result
    }

    /** 显示用户所拥有的应用 */
    @action()
    ownAppliactions({ USER_ID, conn }) {
        if (!USER_ID) throw errors.argumentNull('USER_ID')
        if (!conn) throw errors.argumentNull('conn')

        return db.list<Application>(conn, 'application', { filter: `user_id = '${USER_ID}'` })
    }

    /** 显示用户所允许访问的应用 */
    @action()
    async canVisitApplicationIds({ USER_ID, conn }) {
        type ApplicationUser = { user_id: string, application_id: string }
        let items = await db.select<ApplicationUser>(conn, 'application_user', { filter: `user_id = '${USER_ID}'` })
        return items.map(o => o.application_id)
    }
}



module Args {
    export type addUser = { item: User, roleIds: string[], conn: db.Connection }

}





