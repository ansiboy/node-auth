import { errors } from "../errors";
import { controller, action, routeData as formData, routeData, } from "maishu-node-mvc";
import { Role, User, RoleResource } from "../entities";
import { PermissionDataContext, permissionDataContext, currentUser } from "../data-context";
import { guid } from "maishu-chitu-service";

@controller("role")
export default class RoleController {

    @action()
    async add(@permissionDataContext dc: PermissionDataContext, @routeData { item }: { item: Role }) {
        if (!item) throw errors.argumentNull('item')
        if (!item.name) throw errors.argumentFieldNull("name", "item");

        let role: Role = {
            id: guid(), name: item.name, remark: item.remark,
            create_date_time: new Date(Date.now()),
            parent_id: item.parent_id,
        }

        await dc.roles.save(role);

        return { id: role.id, create_date_time: role.create_date_time };
    }

    @action()
    async update(@permissionDataContext dc: PermissionDataContext, @formData { item }: { item: Role }) {//id, name, remark

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

    @action()
    async remove(@permissionDataContext dc: PermissionDataContext, @currentUser user: User, @formData { id }): Promise<Partial<Role>> {
        if (!id) throw errors.argumentNull('id');

        await dc.roles.delete({ id: id })
        return { id };
    }

    /** 获取角色列表 */
    @action()
    async list(@permissionDataContext dc: PermissionDataContext) {
        if (!dc) throw errors.argumentNull("dc");
        let roles = await dc.roles.find({
            order: { create_date_time: "DESC" }
        });

        return roles;
    }

    /** 获取单个角色 */
    @action()
    async get(@permissionDataContext dc: PermissionDataContext, @formData { id }): Promise<Role> {
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
    @action()
    async setResources(@permissionDataContext dc: PermissionDataContext, @formData { roleId, resourceIds }: { roleId: string, resourceIds: string[] }) {

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
    @action()
    async resourceIds(@permissionDataContext dc: PermissionDataContext, @formData { roleId }): Promise<string[]> {
        if (!roleId) throw errors.argumentFieldNull('roleId', "formData");

        let items = await dc.roleResources.find({
            where: { role_id: roleId },
            select: ["resource_id"]
        })

        let r = items.map(o => o.resource_id);
        return r;
    }
}