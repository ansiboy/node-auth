import { errors } from "../errors";
import { controller, formData, action } from "maishu-node-mvc";
import { Resource, User, Path, ResourcePath } from "../entities";
import { AuthDataContext } from "../dataContext";
import { actionPaths, constants } from "../common";
import { currentUser, authDataContext } from "../decorators";
import { guid } from "../utility";



@controller("resource")
export default class ResourceController {

    @action(actionPaths.resource.add)
    async add(@authDataContext dc: AuthDataContext, @currentUser user: User, @formData { item }: { item: Resource }): Promise<Partial<Resource>> {
        if (!item.name) throw errors.argumentFieldNull('name', 'item')

        item.id = guid()
        item.create_date_time = new Date(Date.now())

        if (item.sort_number == null) {
            let r = await dc.resources.createQueryBuilder()
                .select("max(sort_number) as max_sort_number").getRawOne();

            item.sort_number = (r["max_sort_number"] || 0) + 100;
        }


        await dc.resources.save(item);
        await dc.roleResources.save({ role_id: user.role_id, resource_id: item.id });

        return { id: item.id, create_date_time: item.create_date_time, sort_number: item.sort_number };
    }

    @action(actionPaths.resource.update)
    async update(@authDataContext dc: AuthDataContext, @formData { item }: { item: Resource }) {
        if (!item) throw errors.argumentNull('item')
        if (!item.id) throw errors.argumentFieldNull('id', 'item')

        delete item.create_date_time;
        delete item.type;

        await dc.resources.save(item)

        return { id: item.id }
    }

    @action(actionPaths.resource.remove)
    async remove(@authDataContext dc: AuthDataContext, @formData { id }) {
        if (!id) throw errors.argumentFieldNull('id', "formData");

        await dc.resources.delete(id);
        return { id };
    }


    @action(actionPaths.resource.list)
    async list(@authDataContext dc: AuthDataContext, @currentUser user: User): Promise<Resource[]> {
        if (!user)
            throw errors.argumentNull("user");

        if (!user.role_id)
            return [];

        if (user.role_id == constants.adminRoleId) {
            return dc.resources.find({ order: { sort_number: "ASC" } });
        }

        let roleResources = await dc.roleResources.find({ role_id: user.role_id });
        if (roleResources.length == 0) {
            return [];
        }

        let resourceIds = roleResources.map(o => o.resource_id);
        let resources = await dc.resources.findByIds(resourceIds, { order: { sort_number: "ASC" } });

        return resources;
    }

    @action(actionPaths.resource.item)
    async item(@authDataContext dc: AuthDataContext, @formData { id }) {
        if (!id) throw errors.argumentFieldNull("id", "formData");

        let item = await dc.resources.findOne(id);
        return item;
    }

    @action(actionPaths.resource.path.set)
    async set(@authDataContext dc: AuthDataContext,
        @formData { resourceId, paths }: { resourceId: string, paths: string[] }) {
        if (!resourceId) throw errors.argumentFieldNull("resourceId", "formData");
        if (!paths) throw errors.argumentFieldNull("pathIds", "formData");

        let allPaths = await dc.paths.find();
        let allPathStrings = allPaths.map(o => o.value);
        let notExistsPaths = paths.filter(o => allPathStrings.indexOf(o) < 0)
            .map(o => ({ id: guid(), value: o, create_date_time: new Date(Date.now()) }) as Path);

        await dc.paths.save(notExistsPaths);

        allPaths.push(...notExistsPaths);

        let pathIds = allPaths.filter(o => paths.indexOf(o.value) >= 0).map(o => o.id);
        let resourcePaths = pathIds.map(o => ({ resource_id: resourceId, path_id: o } as ResourcePath));

        await dc.roleResources.delete({ resource_id: resourceId });
        await dc.resourcePath.save(resourcePaths);
    }
}