import { ApplicationIdBinding } from "./entities";
import NodeCache = require("node-cache");
import { AuthDataContext } from "./data-context";
import { ConnectionOptions, DataHelper } from "maishu-node-data";
import { g } from "./global";

var nodeCache = new NodeCache()

const SECOND = 1;
const ONE_HOUR = 60 * 60 * SECOND;
const APP_ID_BINDINGS = "AppIdBindings";

async function getAppIdBindings(): Promise<ApplicationIdBinding[]> {
    var appIdBindings = nodeCache.get(APP_ID_BINDINGS) as ApplicationIdBinding[];
    if (appIdBindings == null) {
        var dc = await DataHelper.createDataContext(AuthDataContext, g.settings.db as ConnectionOptions);
        appIdBindings = await dc.appIdBindings.find();
        let idsToUpdate = appIdBindings.filter(o => o.valid != true).map(o => o.id);
        if (idsToUpdate.length > 0) {
            dc.appIdBindings.update(idsToUpdate, { valid: true });
        }
        nodeCache.set(APP_ID_BINDINGS, appIdBindings, ONE_HOUR * 2);
    }

    return appIdBindings;
}

export async function getApplicationIdById(id: string): Promise<string | null> {
    var appIdBindings = await getAppIdBindings();
    let domain: string = "";
    if (id.indexOf(":") > 0) {
        domain = id.split(":")[0];
    }

    let item = appIdBindings.filter(o => o.id == id || o.id == domain)[0];
    return item?.app_id || null;
}



