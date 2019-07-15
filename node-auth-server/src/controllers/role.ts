import { errors } from "../errors";
import { controller, action, formData } from "maishu-node-mvc";
import { currentUserId, currentUser, authDataContext } from "../decorators";
import { Role, User, RoleResource } from "../entities";
import { AuthDataContext } from "../dataContext";
import { actionPaths } from "../common";
import { guid } from "../utility";

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
    async add(@authDataContext dc: AuthDataContext, @currentUserId userId: string, @formData { item }: { item: Role }) {
        if (!item) throw errors.argumentNull('item')
        if (!item.name) throw errors.argumentFieldNull("name", "item");
        if (!userId) throw errors.userIdNull();

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
    async list(@authDataContext dc: AuthDataContext, @currentUserId userId: string) {
        if (!dc) throw errors.argumentNull("dc");
        if (!userId) throw errors.userIdNull();
        
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
    async resourceIds(@authDataContext dc: AuthDataContext, @formData { roleId }): Promise<string[]> {
        if (!roleId) throw errors.argumentFieldNull('roleId', "formData");

        let items = await dc.roleResources.find({
            where: { role_id: roleId },
            select: ["resource_id"]
        })

        let r = items.map(o => o.resource_id);
        return r;
    }
}