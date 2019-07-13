import { controller, action, formData } from "maishu-node-mvc";
import { authDataContext, AuthDataContext } from "../dataContext";
import { Path } from "../entities";
import { errors } from "../errors";
import { guid } from "../database";
import { remove } from "maishu-mysql-helper";
import { actionPaths } from "../common";

@controller("path")
export class PathController {
    @action(actionPaths.path.list)
    async list(@authDataContext dc: AuthDataContext, @formData { resourceId }: { resourceId: string }): Promise<Path[]> {
        let items: Path[];
        if (resourceId) {
            items = await dc.paths.find({ resource_id: resourceId });
        }
        else {
            items = await dc.paths.find();
        }
        return items;
    }

    @action()
    async add(@authDataContext dc: AuthDataContext, @formData { item }: { item: Path }): Promise<Partial<Path>> {
        if (!item) throw errors.argumentNull("item");

        item.id = guid();
        item.create_date_time = new Date(Date.now());

        await dc.paths.save(item);

        return { id: item.id, create_date_time: item.create_date_time }
    }

    @action()
    async update(@authDataContext dc: AuthDataContext, @formData { item }: { item: Path }): Promise<Partial<Path>> {
        if (!item) throw errors.argumentNull("item");
        if (!item.id) throw errors.argumentFieldNull("id", "item");
        if (!item.value) throw errors.argumentFieldNull("value", "item");

        let entity = await dc.paths.findOne({ id: item.id });
        if (!entity)
            throw errors.objectNotExistWithId(item.id, "path");

        entity.value = item.value;
        await dc.paths.save(item);

        return { id: item.id, create_date_time: item.create_date_time }
    }

    @action()
    async remove(@authDataContext dc: AuthDataContext, @formData { id }): Promise<Partial<Path>> {
        if (!id) throw errors.argumentFieldNull("id", "formData");

        await dc.paths.delete({ id });
        return { id }
    }

}