import { ApplicationIdBinding } from "./entities";
import NodeCache = require("node-cache");
import { AuthDataContext } from "./data-context";
import { g } from "./global";

var nodeCache = new NodeCache()

const SECOND = 1;
const ONE_HOUR = 60 * 60 * SECOND;
const APP_ID_BINDINGS = "AppIdBindings";

async function getAppIdBindings(): Promise<ApplicationIdBinding[]> {
    var appIdBindings = nodeCache.get(APP_ID_BINDINGS) as ApplicationIdBinding[];
    if (appIdBindings == null) {
        var dc = await AuthDataContext.create(g.settings.db);
        appIdBindings = await dc.appIdBindings.all();
        let itemsToUpdate = appIdBindings.filter(o => o.valid != true);
        itemsToUpdate.forEach(item => {
            item.valid = true;
            dc.appIdBindings.update(item);
        })

        nodeCache.set(APP_ID_BINDINGS, appIdBindings, ONE_HOUR * 2);
    }

    return appIdBindings;
}

export async function getApplicationIdByHost(host: string): Promise<string | null> {
    var appIdBindings = await getAppIdBindings();
    let domain: string = "";
    if (host.indexOf(":") > 0) {
        domain = host.split(":")[0];
    }

    let item = appIdBindings.filter(o => o.domain == host || o.domain == domain)[0];
    if (item != null)
        return item.app_id;

    return item?.app_id || null;
}



