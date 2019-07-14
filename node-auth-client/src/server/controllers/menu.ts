import { controller, action, Controller, formData } from "maishu-node-mvc";
import { PermissionService } from 'maishu-services-sdk'
import { settings } from "../settings";
import { errors } from "../errors";

// export let gatewayHost = '60.190.16.30:8084'
PermissionService.baseUrl = `http://${settings.gateway}`

export type MenuItem = {
    id: string,
    name: string,
    path?: string,
    children?: MenuItem[],
    parentId?: string,
}


@controller("auth/menu")
export class MenuController extends Controller {
    @action()
    async list(@formData { userId }): Promise<MenuItem[]> {
        if (!userId) throw errors.argumentFieldNull("formData", "userId");

        // if (!settings.roleId)
        //     throw errors.settingItemNull('roleId');

        let ps = new PermissionService();
        let roles = await ps.getUserRoles(userId);
        let resourceIds: string[] = [];
        let arrResourceIds = await Promise.all(roles.map(o => ps.getRoleResourceIds(o.id)))
        for (let i = 0; i < arrResourceIds.length; i++) {
            resourceIds.push(...arrResourceIds[i])
        }

        let r = await ps.resource.list();
        let resources = r.dataItems;
        resources = resources.filter(o => resourceIds.indexOf(o.id) >= 0 && o.type == 'menu');

        let top = resources.filter(o => !o.parent_id).map(o => ({ id: o.id, name: o.name, path: o.path, parentId: o.parent_id } as MenuItem))
        for (let i = 0; i < top.length; i++) {
            top[i].children = resources.filter(o => o.parent_id == top[i].id).map(o => ({ id: o.id, name: o.name, path: o.path, parentId: o.parent_id } as MenuItem))
        }
        return top
    }
}