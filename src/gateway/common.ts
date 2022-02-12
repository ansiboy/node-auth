import { ApplicationIdBinding } from "./entities";
import NodeCache = require("node-cache");
import { AuthDataContext } from "./data-context";
import { DataHelper } from "maishu-node-data";
import { g } from "./global";

var nodeCache = new NodeCache()

const SECOND = 1;
const ONE_HOUR = 60 * 60 * SECOND;
const APP_ID_BINDINGS = "AppIdBindings";

async function getAppIdBindings(): Promise<ApplicationIdBinding[]> {
    var appIdBindings = nodeCache.get(APP_ID_BINDINGS) as ApplicationIdBinding[];
    if (appIdBindings == null) {
        var dc = await DataHelper.createDataContext(AuthDataContext, g.settings.db);
        appIdBindings = await dc.appIdBindings.find();
        nodeCache.set(APP_ID_BINDINGS, appIdBindings, ONE_HOUR * 2);
    }

    return appIdBindings;
}

export async function getApplicationIdById(id: string): Promise<string> {
    var appIdBindings = await getAppIdBindings();
    let item = appIdBindings.filter(o => o.id == id)[0];
    return item?.app_id;
}



