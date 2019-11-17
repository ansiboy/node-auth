import { controller, action, routeData } from "maishu-node-mvc";
import { PermissionDataContext, permissionDataContext } from "../data-context";
import { Path } from "../entities";

@controller("path")
export class PathController {
    @action()
    async list(@permissionDataContext dc: PermissionDataContext, @routeData { resourceId }: { resourceId: string }): Promise<Path[]> {
        let items: Path[];
        if (resourceId) {
            let resourcePaths = await dc.resourcePaths.find({ resource_id: resourceId });
            items = await dc.paths.findByIds(resourcePaths.map(o => o.path_id));
        }
        else {
            items = await dc.paths.find();
        }
        return items;
    }

    @action()
    async listByResourceIds(@permissionDataContext dc: PermissionDataContext, @routeData { resourceIds }: { resourceIds: string[] }): Promise<Path[]> {
        let resourcePaths = await dc.resourcePaths.createQueryBuilder()
            .where(`resource_id in (...:resourceIds)`).setParameters({ resourceIds })
            .getMany();

        let pathIds = resourcePaths.map(o => o.path_id);
        let paths = await dc.paths.findByIds(pathIds);
        return paths;
    }

    // @action()
    // async add(@authDataContext dc: AuthDataContext, @routeData { item }: { item: Path }): Promise<Partial<Path>> {
    //     if (!item) throw errors.argumentNull("item");

    //     item.id = guid();
    //     item.create_date_time = new Date(Date.now());

    //     await dc.paths.save(item);

    //     return { id: item.id, create_date_time: item.create_date_time }
    // }

    // @action()
    // async update(@authDataContext dc: AuthDataContext, @routeData { item }: { item: Path }): Promise<Partial<Path>> {
    //     if (!item) throw errors.argumentNull("item");
    //     if (!item.id) throw errors.argumentFieldNull("id", "item");
    //     if (!item.value) throw errors.argumentFieldNull("value", "item");

    //     let entity = await dc.paths.findOne({ id: item.id });
    //     if (!entity)
    //         throw errors.objectNotExistWithId(item.id, "path");

    //     entity.value = item.value;
    //     await dc.paths.save(item);

    //     return { id: item.id, create_date_time: item.create_date_time }
    // }

    // @action()
    // async remove(@authDataContext dc: AuthDataContext, @routeData { id }): Promise<Partial<Path>> {
    //     if (!id) throw errors.argumentFieldNull("id", "routeData");

    //     await dc.paths.delete({ id });
    //     return { id }
    // }



}