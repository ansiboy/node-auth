import { errors } from "../errors";
import { controller, routeData, action } from "maishu-node-mvc";
import { Resource, User, ResourcePath } from "../entities";
import { PermissionDataContext, permissionDataContext, currentUser } from "../data-context";
import { guid } from "maishu-chitu-service";


/** 资源控制器 */
@controller("resource")
export default class ResourceController {


    @action()
    async add(@permissionDataContext dc: PermissionDataContext, @currentUser user: User, @routeData { item }: { item: Resource }) {
        // if (!item.name) throw errors.argumentFieldNull('name', 'item')

        // item.id = guid()
        // item.create_date_time = new Date(Date.now())

        // if (item.sort_number == null) {
        //     let r = await dc.resources.createQueryBuilder()
        //         .select("max(sort_number) as max_sort_number").getRawOne();

        //     item.sort_number = (r["max_sort_number"] || 0) + 100;
        // }


        // await dc.resources.save(item);
        // await dc.roleResources.save({ resource_id: item.id });

        // return { id: item.id, create_date_time: item.create_date_time, sort_number: item.sort_number };
    }

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
        let resources = await dc.resources.find({ order: { sort_number: "ASC" } });
        return resources;
    }

    @action()
    async item(@permissionDataContext dc: PermissionDataContext, @routeData { id }) {
        if (!id) throw errors.argumentFieldNull("id", "routeData");

        let item = await dc.resources.findOne(id);
        return item;
    }

    // @action()
    // async set(@permissionDataContext dc: PermissionDataContext,
    //     @routeData { resourceId, paths }: { resourceId: string, paths: string[] }) {
    //     if (!resourceId) throw errors.argumentFieldNull("resourceId", "routeData");
    //     if (!paths) throw errors.argumentFieldNull("pathIds", "routeData");

    //     let allPaths = await dc.paths.find();
    //     let allPathStrings = allPaths.map(o => o.value);
    //     let notExistsPaths = paths.filter(o => allPathStrings.indexOf(o) < 0)
    //         .map(o => ({ id: guid(), value: o, create_date_time: new Date(Date.now()) }) as Path);

    //     await dc.paths.save(notExistsPaths);

    //     allPaths.push(...notExistsPaths);

    //     let pathIds = allPaths.filter(o => paths.indexOf(o.value) >= 0).map(o => o.id);
    //     let resourcePaths = pathIds.map(o => ({ resource_id: resourceId, path_id: o } as ResourcePath));

    //     await dc.resourcePaths.save(resourcePaths);
    // }
}