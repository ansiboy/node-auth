import { connect, execute, guid, connection, list, get, executeSQL } from "../database";
import { errors } from "../errors";
// import { Connection, list, get, execute as executeSQL } from "maishu-mysql-helper";
import { controller, action, formData } from "maishu-node-mvc";
import * as mysql from 'mysql'
import { UserId, ApplicationId, currentUser } from "../decorators";
import { Role, User, RoleResource } from "../entities";
import { AuthDataContext, authDataContext } from "../dataContext";
import { actionPaths } from "../common";

// type RoleResource = {
//     id: string,
//     resource_id: string,
//     role_id: string,
//     create_date_time: Date,
//     appliation_id: string,
// }

@controller("role")
export default class RoleController {

    @action(actionPaths.role.add)
    async add(@authDataContext dc: AuthDataContext, @UserId userId: string, @formData { item }: { item: Role }) {
        if (!item) throw errors.argumentNull('item')
        if (!item.name) throw errors.argumentFieldNull("name", "item");
        if (!userId) throw errors.argumentNull("userId");

        let user = await dc.users.findOne(userId);
        if (!user)
            throw errors.objectNotExistWithId(userId, "User");

        let role: Role = {
            id: guid(), name: item.name, remark: item.remark,
            create_date_time: new Date(Date.now()),
            parent_id: user.role_id,
        }

        await dc.roles.save(role);

        return { id: role.id, create_date_time: role.create_date_time };
    }

    @action(actionPaths.role.update)
    async update(@authDataContext dc: AuthDataContext, @formData { item }: { item: Role }) {//id, name, remark

        if (!item) throw errors.argumentFieldNull("item", "formData");
        if (!item.id) throw errors.argumentFieldNull("id", "item");

        let role = await dc.roles.findOne({ id: item.id });
        if (!role)
            throw errors.objectNotExistWithId(item.id, "role");

        role.name = item.name;
        role.remark = item.remark;

        await dc.roles.save(role);

        return { id: role.id };
    }

    @action(actionPaths.role.remove)
    async remove(@authDataContext dc: AuthDataContext, @currentUser user: User, @formData { id }): Promise<Partial<Role>> {
        if (!id) throw errors.argumentNull('id');

        await dc.roles.delete({ id: id, parent_id: user.role_id })
        return { id };
    }

    /** 获取角色列表 */
    @action(actionPaths.role.list)
    async list(@authDataContext dc: AuthDataContext, @UserId userId: string) {
        if (!dc) throw errors.argumentNull("dc");

        let user = await dc.users.findOne(userId);
        if (!user)
            throw errors.objectNotExistWithId(userId, "User");

        let roles = await dc.roles.find({
            where: { parent_id: user.role_id },
            order: { create_date_time: "DESC" }
        });

        return roles;
    }

    /** 获取单个角色 */
    @action(actionPaths.role.item)
    async get(@authDataContext dc: AuthDataContext, @formData { id }): Promise<Role> {
        if (!id) throw errors.argumentNull('id')
        if (!dc) throw errors.argumentNull('dc')

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
    @action(actionPaths.role.resource.set)
    async setResources(@authDataContext dc: AuthDataContext, @formData { roleId, resourceIds }: { roleId: string, resourceIds: string[] }) {

        if (!roleId) throw errors.argumentFieldNull("roleId", "formData");
        if (!resourceIds) throw errors.argumentFieldNull("resourceIds", "formData");

        await dc.roleResources.delete({ role_id: roleId })

        let roleResources = resourceIds.map(o => ({ role_id: roleId, resource_id: o } as RoleResource))
        await dc.roleResources.save(roleResources);

        return {}
    }

    /**
     * 获取角色的资源编号
     * @param param0 
     * roleId: 角色编号 
     */
    @action(actionPaths.role.resource.ids)
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