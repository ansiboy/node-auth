import { connect, execute, guid } from '../database';
import { errors } from '../errors';
import { Token } from '../token';
import * as db from 'maishu-mysql-helper';
import { action } from '../controller';

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

    async register({ mobile, password, smsId, verifyCode }: { mobile: string, password: string, smsId: string, verifyCode: string }) {
        if (mobile == null)
            throw errors.argumentNull('mobile');

        if (!password)
            throw errors.argumentNull('password')

        if (smsId == null)
            throw errors.argumentNull('smsId');

        if (verifyCode == null)
            throw errors.argumentNull('verifyCode');


        let user = await connect(async conn => {

            let sql = `select code from sms_record where id = ?`
            let [rows] = await execute(conn, sql, [smsId])
            if (rows == null || rows.length == 0 || rows[0].code != verifyCode) {
                throw errors.verifyCodeIncorrect(verifyCode)
            }

            let user = {
                id: guid(), mobile, password,
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

    async loginByUserName({ username, password }) {

        if (!username) throw errors.argumentNull("username")
        if (!password) throw errors.argumentNull('password')

        //TODO: 检查 username 类型
        let type: 'mobile' | 'username' | 'email' = 'mobile'
        let [rows] = await connect(conn => {
            let sql: string
            switch (type) {
                default:
                case 'mobile':
                    sql = `select * from user where mobile = ? and password = ?`
                    break
                case 'username':
                    sql = `select * from user where user_name = ? and password = ?`
                    break
                case 'email':
                    sql = `select * from user where email = ? and password = ?`
                    break
            }
            return execute(conn, sql, [username, password])
        })

        let user: User = rows == null ? null : rows[0]
        if (user == null) {
            throw errors.usernameOrPasswordIncorrect(username)
        }

        let token = await Token.create({ user_id: user.id, SellerId: user.id } as UserToken)
        return { token: token.id, userId: user.id }
    }
    async loginByOpenId<T extends { openid }>(args: T) {
        let { openid } = args
        if (!openid) throw errors.argumentNull('openid')
        let user = await connect(async conn => {
            let sql = `select * from user where openid = ?`
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
    async login(args: any): Promise<{ token: string, userId: string }> {
        args = args || {}
        if (args.openid) {
            return this.loginByOpenId(args)
        }

        return this.loginByUserName(args)
    }

    /** 获取登录用户的信息 */
    async me({ USER_ID }) {
        let user = await connect(async conn => {
            let sql = `select id, user_name, mobile, openid from user where id = ?`
            let [rows] = await execute(conn, sql, [USER_ID])
            return rows[0]
        })

        return user
    }

    /**
     * 获取用户角色
     * @param param0
     * 1. userId string 
     */
    async getRoles({ USER_ID }) {
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
        if (!userId) throw errors.argumentNull('USER_ID')
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
}



module Args {
    export type addUser = { item: User, roleIds: string[], conn: db.Connection }

}





