import { controller, action, routeData } from "maishu-node-mvc";
import { AuthDataContext } from "../data-context";
import { authDataContext } from "../decorators";
import { Role } from "../entities";
import { errors } from "../errors";
import { DataSourceSelectArguments, guid } from 'maishu-toolkit';
import { constants } from "../global";
import { DataHelper } from "maishu-node-data";

@controller(`${constants.controllerPathRoot}/role`)
export default class RoleController {
    @action()
    async add(@authDataContext dc: AuthDataContext, @routeData { item }: { item: Role }) {
        if (!item) throw errors.argumentNull('item')
        if (!item.name) throw errors.argumentFieldNull("name", "item");

        // let role: Role = {
        //     id: guid(), name: item.name, remark: item.remark,
        //     create_date_time: new Date(Date.now()),
        //     parent_id: item.parent_id,
        // }
        item.id = item.id || guid();
        item.create_date_time = new Date();

        await dc.roles.insert(item);

        return { id: item.id, create_date_time: item.create_date_time };
    }

    @action()
    async update(@authDataContext dc: AuthDataContext, @routeData { item }: { item: Role }) {

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
    async remove(@authDataContext dc: AuthDataContext, @routeData { id }): Promise<Partial<Role>> {
        if (!id) throw errors.argumentNull('id');

        await dc.roles.delete({ id: id })
        return { id };
    }

    /** 获取角色列表 */
    @action()
    async list(@authDataContext dc: AuthDataContext, @routeData { args }: { args: DataSourceSelectArguments }) {
        if (!dc) throw errors.argumentNull("dc");

        let r = await DataHelper.list(dc.roles, { selectArguments: args });
        return r;
    }

    /** 获取单个角色 */
    @action()
    async get(@authDataContext dc: AuthDataContext, @routeData { id }): Promise<Role> {
        if (!id) throw errors.argumentNull('id')
        if (!dc) throw errors.argumentNull('dc')

        let r = await dc.roles.findOne(id);
        return r;
    }

}