import { getApplicationIdByUrl, getApplicationIdFromRequest } from "../../common";
import { AuthDataContext } from "../../data-context";
import { authDataContext } from "../../decorators";
import { constants } from "../../global";
import { action, controller, routeData } from "maishu-node-mvc";
import { errors } from "maishu-toolkit";

@controller(`${constants.adminApiBasePath}`)
export class HomeController {

    @action()
    getApplicationId(@authDataContext dc: AuthDataContext, @routeData d: { host: string }) {
        if (!d.host) throw errors.routeDataFieldNull("host");

        let appId = getApplicationIdByUrl(d.host);
        return appId;
    }
}