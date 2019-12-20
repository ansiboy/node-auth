import { controller, action, routeData, getLogger } from "maishu-node-mvc";
import { StationInfo, ServerContextData } from "../types";
import { g, constants } from "../global";
import { errors } from "../errors";

@controller(`/${constants.controllerPathRoot}/station`)
export class StationController {

    @action()
    list() {
        let r = g.stationInfos.value.map(o => ({ path: o.path }));
        return r;
    }

    /** 注册站点 */
    register(data: StationInfo, contextData: ServerContextData) {

        let logger = getLogger(g.projectName, contextData.logLevel);
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

        //如果站点已经存在（通过路径判断），移除掉 
        let stationInfos = g.stationInfos.value.filter(o => o.path != data.path);

        stationInfos.push(data);
        g.stationInfos.value = stationInfos;
    }

}