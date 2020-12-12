import { controller, action, routeData, getLogger } from "maishu-node-mvc";
import { Station as StationInfo } from "../types";
import { g, constants } from "../global";
import { errors } from "../errors";
import { AuthDataContext } from "../data-context";
import { guid } from "maishu-toolkit";
import { demandCommand } from "yargs";
import { authDataContext } from "../decorators";

@controller(`/${constants.controllerPathRoot}/station`)
export class StationController {

    @action()
    async list(@authDataContext dc: AuthDataContext) {
        let r = g.stationInfos.value.map(o => ({ path: o.path }));
        // return r;
        let items = await dc.stations.find();
        r.push(...items);
        return r;
    }

    /** 注册站点 */
    static register(data: StationInfo) {

        let logger = getLogger(g.projectName, g.settings.logLevel);
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

    @action()
    async add(@routeData d: { item: StationInfo }, @authDataContext dc: AuthDataContext) {
        if (d.item == null) throw errors.argumentNull("item");

        d.item.id = d.item.id || guid();
        await dc.stations.insert(d.item);

        return { id: d.item.id };
    }

    @action()
    async remove(@authDataContext dc: AuthDataContext, @routeData d: { id: string }) {
        if (d.id == null) throw errors.argumentNull("id");
        await dc.stations.delete(d.id);

        return { id: d.id };
    }

}