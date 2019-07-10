import { execute, guid, connection } from "../database";
import { errors } from "../errors";
import { controller, formData, action } from "maishu-node-mvc";
import * as mysql from 'mysql'
import { Resource, User } from "../entities";
import { authDataContext, AuthDataContext } from "../dataContext";
import { actionPaths } from "../common";
import { currentUser } from "../decorators";



@controller("resource")
export default class ResourceController {

    @action(actionPaths.resource.add)
    async add(@authDataContext dc: AuthDataContext, @currentUser user: User, @formData { item }: { item: Resource }): Promise<Partial<Resource>> {
        if (!item.name) throw errors.fieldNull('name', 'item')

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
        if (!item.id) throw errors.fieldNull('id', 'item')

        // create_date_time type 不能更新
        delete item.create_date_time;
        delete item.type;

        await dc.resources.save(item)

        return { id: item.id }
    }

    @action(actionPaths.resource.remove)
    async remove(@connection conn: mysql.Connection, @formData { id }) {
        if (!id) throw errors.argumentNull('id')

        let sql = `delete from resource where id = ?`;
        await execute(conn, sql, id)
    }


    @action(actionPaths.resource.list)
    async list(@authDataContext dc: AuthDataContext, @currentUser user: User, @formData { parentId }: { parentId: string }): Promise<Resource[]> {
        if (!user)
            throw errors.argumentNull("user");

        if (!user.role_id)
            return [];

        let roleResources = await dc.roleResources.find({ role_id: user.role_id });
        if (roleResources.length == 0) {
            return [];
        }

        let resourceIds = roleResources.map(o => o.resource_id);
        let resources = await dc.resources.findByIds(resourceIds, { order: { sort_number: "ASC" } });
        if (parentId) {
            return resources.filter(o => o.parent_id == parentId);
        }

        return resources;
    }

    @action(actionPaths.resource.item)
    async item(@authDataContext dc: AuthDataContext, @formData { id }) {
        if (!id) throw errors.fieldNull("id", "formData");

        let item = await dc.resources.findOne(id);
        return item;
    }



}