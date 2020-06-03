import { errors } from "../errors";
import { controller, routeData, action } from "maishu-node-mvc";
import { Resource } from "../entities";
import { PermissionDataContext, permissionDataContext } from "../data-context";


/** 资源控制器 */
@controller("resource")
export default class ResourceController {

    @action()
    async update(@permissionDataContext dc: PermissionDataContext, @routeData { item }: { item: Resource }) {
        if (!item) throw errors.argumentNull('item')
        if (!item.id) throw errors.argumentFieldNull('id', 'item')

        delete item.create_date_time;
        // delete item.type;

        await dc.resources.save(item)

        return { id: item.id }
    }

    @action()
    async remove(@permissionDataContext dc: PermissionDataContext, @routeData { id }) {
        if (!id) throw errors.argumentFieldNull('id', "routeData");

        await dc.resources.delete(id);
        return { id };
    }


    @action()
    async list(@permissionDataContext dc: PermissionDataContext): Promise<Resource[]> {
        let resources = await dc.resources.find();
        return resources;
    }

    @action()
    async item(@permissionDataContext dc: PermissionDataContext, @routeData { id }) {
        if (!id) throw errors.argumentFieldNull("id", "routeData");

        let item = await dc.resources.findOne(id);
        return item;
    }

}