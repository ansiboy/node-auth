import { connect, execute, guid, connection, list, get, executeSQL } from "../database";
import { errors } from "../errors";
// import { Connection, list, get, execute as executeSQL } from "maishu-mysql-helper";
import { controller, action, formData } from "maishu-node-mvc";
import * as mysql from 'mysql'
import { UserId, ApplicationId } from "../decorators";
import { Role } from "../entities";
import { AuthDataContext, authDataContext } from "../dataContext";

type RoleResource = {
    id: string,
    resource_id: string,
    role_id: string,
    create_date_time: Date,
    appliation_id: string,
}

@controller("role")
export default class RoleController {

    @action()
    add(@authDataContext dc: AuthDataContext, @ApplicationId appId: string, @formData { item }: { item: Role }) {
        if (!item) throw errors.argumentNull('item')
        if (!item.name) throw errors.fieldNull("name", "item");

        let role: Role = {
            id: guid(), name: item.name, remark: item.remark,
            category: item.category,
            create_date_time: new Date(Date.now()),
            application_id: appId
        }

        if (appId)
            role.application_id = appId;

        dc.roles.save(role);

        return { id: role.id };
    }

    @action()
    update(@formData { id, name, remark }) {
        return connect(async conn => {
            let sql = `update role set ? where id = ?`
            let role = { name, remark } as Role
            await execute(conn, sql, [role, id])

            return role
        })
    }

    @action()
    async remove(@authDataContext dc: AuthDataContext, @ApplicationId appId: string, @formData { id }) {
        if (!id) throw errors.argumentNull('id')
        await dc.roles.delete({ id })
        return { id };
    }

    /** 获取角色列表 */
    @action()
    async list(@connection conn) {
        let result = await list<Role>(conn, 'role', { sortExpression: 'create_date_time asc' })
        return result.dataItems
    }

    /** 获取单个角色 */
    @action("get", "item")
    async get(@authDataContext dc: AuthDataContext, @formData { id }): Promise<Role> {
        if (!id) throw errors.argumentNull('id')
        if (!dc) throw errors.argumentNull('dc')

        // let r = await get(conn, 'role', { id })
        // return r
        let r = await dc.roles.findOne(id);
        return r;
    }

    /**
     * 设置角色所允许访问的资源
     * @param param0 参数
     * roleId 角色 ID
     * resourceIds 角色所允许访问的资源 ID 数组
     * appId 应用 ID
     */
    @action("setResources", "resource/set")
    async setResources(@connection conn: mysql.Connection, @formData { roleId, resourceIds }: { roleId: string, resourceIds: string[] }) {
        // return connect(async conn => {
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
            sql = `insert into role_resource (resource_id, role_id, create_date_time) values `
            let values = new Array<any>()
            for (let i = 0; i < addResourceIds.length; i++) {
                if (i == 0) {
                    sql = sql + '(?, ?, ?)'
                }
                else {
                    sql = sql + ',(?, ?, ?)'
                }
                values.push(...[addResourceIds[i], roleId, new Date(Date.now())])
            }
            await execute(conn, sql, values)
        }

        return {}
        // })
    }

    /**
     * 获取角色的资源编号
     * @param param0 
     * roleId: 角色编号 
     */
    @action("resourceIds", "resource/ids")
    resourceIds(@formData { roleId }): Promise<string[]> {
        if (!roleId) throw errors.argumentNull('roleId')
        return connect(async conn => {
            let sql = `select resource_id from role_resource where role_id = ?`
            let [rows] = await execute(conn, sql, [roleId])
            return rows.map(o => o.resource_id)
        })
    }


    /**
     * 获取用户角色编号
     */
    @action()
    async userRoles(@connection conn: mysql.Connection, @formData { userIds }: { userIds: string[] }) {
        if (userIds == null)
            throw errors.argumentNull('userIds');
        if (conn == null)
            throw errors.argumentNull('conn');

        let items: { [key: string]: Role[] } = {}

        if (userIds.length > 0) {
            let str = userIds.map(o => `"${o}"`).join(',');
            let sql = `select * from user_role left join role on user_role.role_id = role.id where user_role.user_id in (${str})`;
            let rows = await executeSQL(conn, sql, null) as any[];
            for (let i = 0; i < userIds.length; i++) {
                items[userIds[i]] = rows.filter(o => o.user_id == userIds[i])
            }
        }

        return items;
    }
}