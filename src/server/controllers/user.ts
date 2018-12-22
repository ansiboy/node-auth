import { connect, execute, guid } from '../database';
import { errors } from '../errors';
import { Token } from '../token';
import * as db from 'maishu-mysql-helper';
import { action } from '../controller';



interface Application {
    id: string,
    name: string,
    data: object,
    user_id: string,
    create_date_time
}

export default class UserController {

    //====================================================
    // 商家注册
    /** 手机是否已注册 */
    async isMobileRegister({ mobile }) {
        if (!mobile) throw errors.argumentNull('mobile')

        return connect(async conn => {
            let sql = `select id from user where mobile = ? limit 1`
            let [rows] = await execute(conn, sql, [mobile])
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


    async me({ userId }) {
        let user = await connect(async conn => {
            let sql = `select id, user_name, mobile, openid from user where id = ?`
            let [rows] = await execute(conn, sql, [userId])
            return rows[0]
        })

        return user
    }

    async getRoles({ userId }) {
        let roles = await connect(async conn => {
            let sql = `select r.*
                       from user_role as ur left join role as r on ur.role_id = r.id
                       where ur.user_id = ?`
            let [rows] = await execute(conn, sql, [userId])
            return rows
        })

        return roles
    }

    async setRoles({ userId, roleIds }) {
        if (!userId) throw errors.argumentNull('userId')
        if (!roleIds) throw errors.argumentNull('roleIds')
        if (!Array.isArray(roleIds)) throw errors.argumentTypeIncorrect('roleIds', 'array')
        if (roleIds.length == 0) {
            return
        }

        await connect(async conn => {

            let deleteSQL = `delete from user_role where user_id = ?`
            execute(conn, deleteSQL, [userId])

            let values = []
            let sql = `insert into user_role (user_id, role_id) values `
            for (let i = 0; i < roleIds.length; i++) {
                sql = sql + "(?,?)"
                values.push(userId, roleIds[i])
            }
            execute(conn, sql, values)
        })
    }

    @action()
    async list({ args, conn }: { args: db.SelectArguments, conn: db.Connection }) {
        let result = await db.list<User>(conn, 'user', args)
        return result
    }
}

