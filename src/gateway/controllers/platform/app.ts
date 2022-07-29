import { errors } from "../../errors";
import { controller, action, routeData } from "maishu-node-mvc";
import { DataSourceSelectArguments, DataSourceSelectResult, guid } from "maishu-toolkit";
import { constants } from "../../global";
import { authDataContext } from "../../decorators";
import { AuthDataContext } from "../../data-context";
import { Application } from "../../entities";

@controller(`${constants.platformApiBasePath}/app`)
export default class ApplicationController {

    @action()
    async list(@authDataContext dc: AuthDataContext, @routeData d: { args: DataSourceSelectArguments }) {
        if (!d) throw errors.argumentNull("d");
        if (!d.args) throw errors.routeDataFieldNull("args");

        let apps = await dc.apps.all();
        let start = d.args.startRowIndex || 0;
        let end = start + d.args.maximumRows || 10;
        let dataItems = apps.slice(start, end);
        let r: DataSourceSelectResult<Application> = { dataItems, totalRowCount: apps.length };
        return r;
    }

    @action()
    async insert(@authDataContext dc: AuthDataContext, @routeData d: { item: Partial<Application> }) {

        if (!dc) throw errors.argumentNull("dc");
        if (!d) throw errors.argumentNull("d");
        if (!d.item) throw errors.routeDataFieldNull("item");
        if (!d.item.name) throw errors.argumentFieldNull("name", "item");

        let apps = await dc.apps.all();
        let entity = apps.filter(o => o.name == d.item.name)[0];// .findOne({ name: d.item.name });
        if (entity)
            throw errors.applicationExists(d.item.name);

        if (!d.item.id)
            d.item.id = guid();

        d.item.createDateTime = new Date();

        await dc.apps.insert(d.item);

        let r: Pick<Application, "id" | "createDateTime"> = {
            id: d.item.id, createDateTime: d.item.createDateTime
        };
        return r;
    }

    @action()
    async update(@authDataContext dc: AuthDataContext, @routeData d: { item: Partial<Application> }) {

        if (!dc) throw errors.argumentNull("dc");
        if (!d) throw errors.routeDataFieldNull("d");
        if (!d.item) throw errors.routeDataFieldNull("item");
        if (!d.item.id) throw errors.argumentFieldNull("id", "item");

        await dc.apps.update(d.item);

        return {};
    }

    @action()
    async delete(@authDataContext dc: AuthDataContext, @routeData d: { id: string }) {

        if (!dc) throw errors.argumentNull("dc");
        if (!d) throw errors.argumentNull("d");
        if (!d.id) throw errors.routeDataFieldNull("id");

        await dc.apps.delete(d.id)

        return {};
    }

    @action()
    async item(@authDataContext dc: AuthDataContext, @routeData d: { id: string }) {

        if (!dc) throw errors.argumentNull("dc");
        if (!d) throw errors.argumentNull("d");
        if (!d.id) throw errors.routeDataFieldNull("id");

        let item = await dc.apps.item(d.id);

        return item;
    }



}
