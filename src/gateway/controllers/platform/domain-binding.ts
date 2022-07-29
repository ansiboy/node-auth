import { DomainBinding } from "../../entities";
import { AuthDataContext } from "../../data-context";
import { authDataContext } from "../../decorators";
import { constants } from "../..//global";
import { action, controller, routeData } from "maishu-node-mvc";
import { DataSourceSelectArguments, DataSourceSelectResult, guid } from "maishu-toolkit";
import { errors } from "../../errors";

@controller(`${constants.platformApiBasePath}/domain`)
export default class DomainBindingController {

    @action()
    async list(@authDataContext dc: AuthDataContext, @routeData d: { args: DataSourceSelectArguments }) {
        if (!dc) throw errors.argumentNull("dc");
        if (!d) throw errors.argumentNull("d");
        if (!d.args) throw errors.routeDataFieldNull("args");

        let domainBindings = await dc.domainBindings.all();
        if (d.args.filter) {
            domainBindings = domainBindings.filter(eval(`o=> ${d.args.filter}`));
        }
        
        let start = d.args.startRowIndex || 0;
        let end = start + d.args.maximumRows || 10;
        let dataItems = domainBindings.slice(start, end);
        let r: DataSourceSelectResult<DomainBinding> = { dataItems, totalRowCount: domainBindings.length };
        return r;
    }

    @action()
    async insert(@authDataContext dc: AuthDataContext, @routeData d: { item: Partial<DomainBinding> }) {
        if (!dc) throw errors.argumentNull("dc");
        if (!d) throw errors.argumentNull("d");
        if (!d.item) throw errors.routeDataFieldNull("item");

        if (!d.item.domain)
            throw errors.argumentFieldNull("domain", "DomainBinding");

        if (!d.item.appId)
            throw errors.argumentFieldNull("appId", "DomainBinding");


        let domainBindings = await dc.domainBindings.all();
        let entity = domainBindings.filter(o => o.domain == d.item.domain)[0];
        if (entity)
            throw errors.domainBindingExists(d.item.domain);

        d.item.id = d.item.id || guid();
        d.item.createDateTime = new Date();

        await dc.domainBindings.insert(d.item);
        let r: Pick<DomainBinding, "id" | "createDateTime"> = {
            id: d.item.id, createDateTime: d.item.createDateTime
        };

        return r;
    }

    @action()
    async update(@authDataContext dc: AuthDataContext, @routeData d: { item: Partial<DomainBinding> }) {
        if (!dc) throw errors.argumentNull("dc");
        if (!d) throw errors.argumentNull("d");
        if (!d.item) throw errors.routeDataFieldNull("item");
        if (!d.item.id) throw errors.argumentFieldNull("id", "item");

        //===========================================================================
        // 检查对象是否已经存在
        let domainBindings = await dc.domainBindings.all();
        let entity = domainBindings.filter(o => o.id == d.item.id)[0];
        if (!entity) throw errors.objectNotExistWithId(d.item.id, "domainBindings");
        //===========================================================================

        //===========================================================================
        // 检查域名是否已经存在
        let domainItem = domainBindings.filter(o => o.id != d.item.id).filter(o => o.domain == entity.domain)[0];
        if (domainItem != null && domainItem != entity)
            throw errors.domainBindingExists(entity.domain);
        //===========================================================================

        await dc.domainBindings.update(d.item);

        return {};
    }

    @action()
    async delete(@authDataContext dc: AuthDataContext, @routeData d: { id: string }) {
        if (!dc) throw errors.argumentNull("dc");
        if (!d) throw errors.argumentNull("d");
        if (!d.id) throw errors.routeDataFieldNull("id");

        await dc.domainBindings.delete(d.id);

        return {};
    }
}