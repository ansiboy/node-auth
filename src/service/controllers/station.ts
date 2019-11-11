import { controller, action, routeData, getLogger } from "maishu-node-mvc";
import { StationInfo } from "maishu-chitu-admin";
import { errors } from "../errors";
import { g } from "../global";
import { PROJECt_NAME } from "../config";


@controller("station")
export class StationController {

    @action()
    list() {
        let r = g.stationInfos.value.map(o => ({ path: o.path }));
        return r;
    }

    @action()
    register(@routeData data: StationInfo) {

        let logger = getLogger(PROJECt_NAME, g.settings.logLevel);
        logger.info("Register action of station controller execute.");

        console.assert(data != null);
        if (data.ip == null) throw errors.routeDataFieldNull<StationInfo>("ip");
        if (data.path == null) throw errors.routeDataFieldNull<StationInfo>("path");
        if (data.port == null) throw errors.routeDataFieldNull<StationInfo>("port");

        if (!data.path.startsWith("/")) {
            data.path = "/" + data.path;
        }
        if (!data.path.endsWith("/")) {
            data.path = data.path + "/";
        }

        let stationInfos = g.stationInfos.value;
        let itemIndex = stationInfos.map(o => o.path).indexOf(data.path);
        if (itemIndex >= 0) {
            let logger = getLogger(PROJECt_NAME, g.settings.logLevel);
            logger.info(`Station path is exists, path is '${data.path}'.`);
            return;
        }

        stationInfos.push(data);
        g.stationInfos.value = stationInfos;
    }
}