import { errors } from "../errors";
import { controller, routeData, action } from "maishu-node-mvc";
import { Resource } from "../entities";
import { UserDataContext } from "../data-context";
import { userDataContext } from "../decorators";
import { userApiBasePath } from "../global";

/** 资源控制器 */
@controller(`${userApiBasePath}/resource`)
export default class ResourceController {

    @action()
    async update(@userDataContext dc: UserDataContext, @routeData { item }: { item: Resource }) {
        if (!item) throw errors.argumentNull('item')
        if (!item.id) throw errors.argumentFieldNull('id', 'item')

        delete item.create_date_time;
        // delete item.type;

        await dc.resources.save(item)

        return { id: item.id }
    }

    @action()
    async remove(@userDataContext dc: UserDataContext, @routeData { id }) {
        if (!id) throw errors.argumentFieldNull('id', "routeData");

        await dc.resources.delete(id);
        return { id };
    }


    @action()
    async list(@userDataContext dc: UserDataContext): Promise<Resource[]> {
        let resources = await dc.resources.find();
        return resources;
    }

    @action()
    async item(@userDataContext dc: UserDataContext, @routeData { id }) {
        if (!id) throw errors.argumentFieldNull("id", "routeData");

        let item = await dc.resources.findOne(id);
        return item;
    }

}