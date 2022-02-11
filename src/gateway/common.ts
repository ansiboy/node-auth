import { ApplicationIdBinding } from "./entities";
import NodeCache = require("node-cache");
import { AuthDataContext } from "./data-context";
import { DataHelper } from "maishu-node-data";
import http = require("http");
import { g } from "./global";

var nodeCache = new NodeCache()

const SECONDS = 1;
const HOURS = 60 * 60 * SECONDS;
const APP_ID_BINDINGS = "AppIdBindings";

async function getAppIdBindings(): Promise<ApplicationIdBinding[]> {
    var appIdBindings = nodeCache.get(APP_ID_BINDINGS) as ApplicationIdBinding[];
    if (appIdBindings == null) {
        // ApplicationIdBinding
        var dc = await DataHelper.createDataContext(AuthDataContext, g.settings.db);
        appIdBindings = await dc.appIdBindings.find();
        nodeCache.set(APP_ID_BINDINGS, HOURS * 2);
    }

    return appIdBindings;
}

export async function getApplicationIdByUrl(url: string): Promise<string> {
    var appIdBindings = await getAppIdBindings();
    for (let i = 0; i < appIdBindings.length; i++) {
        if (url.startsWith(appIdBindings[i].url_prefix)) {
            return appIdBindings[i].app_id;
        }

    }

    return null;
}

export async function getApplicationIdFromRequest(req: http.IncomingMessage): Promise<string> {
    var url = req.headers.host + req.url;
    return getApplicationIdByUrl(url);
}

