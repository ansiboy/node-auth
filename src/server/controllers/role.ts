import { connect, execute, guid } from "../database";
import { errors } from "../errors";

interface Role {
    id: string
    name: string
    remark: string
    create_date_time: Date,
    application_id: string
}

type RoleResource = {
    id: string,
    resource_id: string,
    role_id: string,
    create_date_time: Date,
    appliation_id: string,
}

export function add({ APP_ID, name, remark }) {
    if (!APP_ID) throw errors.argumentNull('APP_ID')
    if (!name) throw errors.argumentNull('name')

    return connect(async conn => {
        let sql = `insert into role set ?`
        let role: Role = {
            id: guid(), name, remark,
            create_date_time: new Date(Date.now()),
            application_id: APP_ID
        }
        await execute(conn, sql, role)

        return role
    })
}

export function update({ id, name, remark }) {
    return connect(async conn => {
        let sql = `update role set ? where id = ?`
        let role = { name, remark } as Role
        await execute(conn, sql, [role, id])

        return role
    })
}

export function remove({ id, APP_ID }) {
    if (!id) throw errors.argumentNull('id')
    if (!APP_ID) throw errors.argumentNull('APP_ID')

    return connect(async conn => {
        let sql = `delete from role where id = ? and application_id = ?`
        await execute(conn, sql, [id, APP_ID])
        return { id }
    })
}

/** 获取角色列表 */
export function list({ APP_ID }) {
    if (!APP_ID) throw errors.argumentNull('APP_ID')
    return connect(async conn => {
        let sql = `select * from role where application_id = ?`
        let [rows] = await execute(conn, sql, APP_ID)
        return rows
    })
}

/** 获取单个角色 */
export function get({ id, APP_ID }) {
    if (!id) throw errors.argumentNull('id')
    if (!APP_ID) throw errors.argumentNull('APP_ID')
    return connect(async conn => {
        let sql = `select * from role where id = ? and application_id = ?`
        let [rows] = await execute(conn, sql, [id, APP_ID])
        return rows[0]
    })
}

/**
 * 设置角色所允许访问的资源
 * @param param0 参数
 * roleId 角色 ID
 * resourceIds 角色所允许访问的资源 ID 数组
 * appId 应用 ID
 */
export function setResources({ roleId, resourceIds }: { roleId: string, resourceIds: string[] }) {
    return connect(async conn => {
        let sql = `select * from role_resource where role_id = ?`
        let [rows] = await execute(conn, sql, roleId)
        let roleResources: RoleResource[] = rows
        let existsResourceIds = roleResources.map(o => o.resource_id)

        let removeResourceIds = new Array<string>()
        let addResourceIds = new Array<string>()

        existsResourceIds.forEach(resource_id => {
            if (resourceIds.indexOf(resource_id) < 0) {
                removeResourceIds.push(resource_id)
            }
        })
        resourceIds.forEach(resourceId => {
            if (existsResourceIds.indexOf(resourceId) < 0)
                addResourceIds.push(resourceId)
        })

        if (removeResourceIds.length > 0) {
            sql = `delete from role_resource where role_id = ? and (`
            for (let i = 0; i < removeResourceIds.length; i++) {
                if (i == 0)
                    sql = sql + `resource_id = ?`
                else
                    sql = sql + ` or resource_id = ?`
            }

            sql = sql + ')'
            await execute(conn, sql, [roleId, ...removeResourceIds])
        }

        if (addResourceIds.length > 0) {
            sql = `insert into role_resource (id, resource_id, role_id, create_date_time) values `
            let values = new Array<any>()
            for (let i = 0; i < addResourceIds.length; i++) {
                if (i == 0) {
                    sql = sql + '(?, ?, ?, ?)'
                }
                else {
                    sql = sql + ',(?, ?, ?, ?)'
                }
                values.push(...[guid(), addResourceIds[i], roleId, new Date(Date.now())])
            }
            await execute(conn, sql, values)
        }

        return {}
    })
}

/**
 * 获取角色的资源编号
 * @param param0 
 * roleId: 角色编号 
 */
export function resourceIds({ roleId }) {
    if (!roleId) throw errors.argumentNull('roleId')
    return connect(async conn => {
        let sql = `select resource_id from role_resource where role_id = ?`
        let [rows] = await execute(conn, sql, [roleId])
        return rows
    })
}

