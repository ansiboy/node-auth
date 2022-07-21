
import { constants } from "../../global";
import { action, controller, RequestResult, routeData } from "maishu-node-mvc";
import { errors } from "../../errors";
import { getApplicationIdByHost } from "../../common";

@controller(`${constants.anonApiBasePath}`)
export class HomeController {
    @action()
    async getApplicationId(@routeData d: { host: string }): Promise<RequestResult> {
        if (!d.host) throw errors.routeDataFieldNull("host");

        let appId = await getApplicationIdByHost(d.host);
        return { content: JSON.stringify(appId), headers: { "content-type": "application/json" } };
    }
}