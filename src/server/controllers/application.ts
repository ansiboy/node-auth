import { errors } from "../errors";
import { connect, execute, guid } from "../database";
import { action } from "../controller";
import * as db from 'maishu-mysql-helper'

interface Application {
    id: string,
    name: string,
    data: string,
    user_id: string,
    create_date_time
}

export default class ApplicationController {
    /** 添加应用 */
    async add({ name, userId, data }: { name: string, userId: string, data?: object }): Promise<Application> {
        if (!name) throw errors.argumentNull('name')
        if (!userId) throw errors.argumentNull('userId')

        let application: Application = {
            id: guid(),
            name,
            data: data == null ? null : JSON.stringify(data) as any,
            user_id: userId,
            create_date_time: new Date(Date.now())
        }

        await connect(conn => {
            let sql = `insert into application set ?`
            return execute(conn, sql, application)
        })

        return application
    }

    /** 添加应用 */
    async update({ id, name, userId, data }: { id, name?: string, userId: string, data?: object }): Promise<Application> {
        if (!id) throw errors.argumentNull('id')
        if (!userId) throw errors.argumentNull('userId')

        let obj = await connect(async conn => {
            let sql = `select * from application where id = ? and user_id = ?`
            let [rows] = await execute(conn, sql, [id, userId])
            let app: Application = rows[0]
            if (app == null)
                throw errors.objectNotExistWithId(id, name)

            let obj = {} as Application
            if (name)
                obj.name = name

            if (data)
                obj.data = JSON.stringify(data)

            sql = `update application set ? where id = ?`
            execute(conn, sql, [obj, id])

            return app

        })


        return obj
    }

    async remove({ id, userId }) {
        if (!id) throw errors.argumentNull('id');

        return connect(conn => {
            let sql = `delete from application where id = ? and user_id = ?`
            return execute(conn, sql, [id, userId])
        })
    }

    /** 显示指定用户的 Application */
    async list({ userId }) {
        if (!userId) throw errors.argumentNull('userId')
        let [rows] = await connect(conn => {
            let sql = `select * from application where user_id = ?`
            return execute(conn, sql, [userId])
        })
        return rows
    }

    /** 显示 ID 为 APP_ID 应用下的用户 */
    @action()
    async users({ args, APP_ID, conn }) {
        if (!APP_ID) throw errors.argumentNull('APP_ID')
        if (!conn) throw errors.argumentNull("conn")

        let source = `(select t1.* from application_user as t0 left join user as t1 on t0.user_id = t1.id
                        where t0.application_id = '${APP_ID}') as t1`
        let r = await db.list<User>(conn, source, args)
        if (r.dataItems.length == 0) {
            return r
        }

        let users = r.dataItems
        // let sql = `select user_id, role_id from user_role where user_id in (?) `
        let userIds = users.map((o: User) => `'${o.id}'`).join(',')
        let filter = `user_id in (${userIds})`
        let rows = await db.select<UserRole>(conn, 'user_role', { filter, sortExpression: 'user_id' })

        users.forEach(user => {
            // let rows = role_result.dataItems;
            (user as any).role_ids = rows.filter(r => r.user_id == user.id).map(o => o.role_id)
        })

        return r

    }

    async addUser({ appId, mobile, roleIds }: { appId: string, mobile: string, roleIds: string[] }) {
        if (!appId)
            throw errors.argumentNull('appId')

        if (!mobile)
            throw errors.argumentNull('userId')

        if (roleIds != null && !Array.isArray(roleIds)) {
            throw errors.argumentTypeIncorrect('roleIds', 'Array')
        }
        return connect(async conn => {
            let sql = `select id from user where mobile = ?`
            let [rows] = await execute(conn, sql, [mobile])
            if (rows.length == 0) {
                return Promise.reject(errors.mobileNotExists(mobile))
            }

            let userId = rows[0].id

            sql = `select user_id from application_user where user_id = ? and application_id = ?`
            rows = (await execute(conn, sql, [userId, appId]))[0]
            if (rows.length > 0) {
                let err = new Error(`手机号为 ${mobile} 的员工已经存在`)
                return Promise.reject(err)
            }

            sql = `insert into application_user set ?`
            let obj = { application_id: appId, user_id: userId }
            await execute(conn, sql, obj)

            if (roleIds != null && roleIds.length > 0) {
                let values = []
                sql = `insert into user_role (user_id, role_id) values `
                for (let i = 0; i < roleIds.length; i++) {
                    sql = sql + "(?, ?)"
                    values.push(userId, roleIds[i])
                }
                await execute(conn, sql, values)
            }

            return obj
        })
    }

    async updateUser({ appId, userId, roleIds }) {
        if (!appId)
            throw errors.argumentNull('appId')

        if (!userId)
            throw errors.argumentNull('userId')

        if (roleIds != null && !Array.isArray(roleIds)) {
            throw errors.argumentTypeIncorrect('roleIds', 'Array')
        }

        return connect(async conn => {
            let sql = `delete from user_role where application_id =? and user_id =?`
            await execute(conn, sql, [appId, userId])
            if (roleIds != null && roleIds.length > 0) {
                let values = []
                sql = `insert into user_role (user_id, role_id, application_id) value `
                for (let i = 0; i < roleIds.length; i++) {
                    if (i > 0)
                        sql = sql + ","

                    sql = sql + "(?, ?, ?)"
                    values.push(userId, roleIds[i], appId)
                }
                await execute(conn, sql, values)
            }
        })
    }

    async removeUser({ appId, userId }) {
        return connect(async conn => {
            let sql = `delete from application_user where application_id = ? and user_id = ?`
            await execute(conn, sql, [appId, userId])
        })
    }

    async get({ id }) {
        if (!id) throw errors.argumentNull('id')
        let [rows] = await connect(conn => {
            let sql = `select * from application where id = ?`
            return execute(conn, sql, [id])
        })
        return rows[0]
    }
}