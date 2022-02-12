
import { constants } from "../../global";
import { action, controller, routeData } from "maishu-node-mvc";
import { errors } from "../../errors";
import { getApplicationIdById } from "../../common";

@controller(`${constants.anonApiBasePath}`)
export class HomeController {
    @action()
    async getApplicationId(@routeData d: { host: string }) {
        if (!d.host) throw errors.routeDataFieldNull("host");

        let appId = await getApplicationIdById(d.host);
        return appId;
    }
}