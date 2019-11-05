import { action, controller, routeData } from "maishu-node-mvc";
import { errors } from "../errors";
import { g } from "../global";
import { getLogger } from "../logger";
import { StationInfo } from "maishu-chitu-admin";

@controller("/")
export class HomeController {
    @action()
    index() {
        return "Auth service started."
    }

    @action()
    registerStation(@routeData data: StationInfo) {
        console.assert(data != null);
        if (data.ip == null) throw errors.routeDataFieldNull<StationInfo>("ip");
        if (data.path == null) throw errors.routeDataFieldNull<StationInfo>("path");
        if (data.port == null) throw errors.routeDataFieldNull<StationInfo>("port");

        //TODO：对 path 进行处理

        let stationInfos = g.stationInfos.value;
        let item = stationInfos.map(o => o.path).indexOf(data.path)[0];
        if (item != null) {
            let logger = getLogger();
            logger.info(`Station path is exists, path is '${data.path}'.`);
            return; //throw errors.stationPathExists(data.path);
        }

        stationInfos.push(data);
        g.stationInfos.value = stationInfos;
    }
}