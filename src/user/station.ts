import IO = require("socket.io-client");
import { errors } from "./errors";

export interface StationInfo {
    path: string,
    ip: string,
    port: number,
}


export function registerStation(gateway: string, station: StationInfo, permissions?: any) {
    permissions = permissions || {};
    // console.assert(data.station != null, "Station field is null");

    // let config = HomeController.getWebsiteConfig(data, settings.logLevel);

    // let logger = getLogger(PROJECT_NAME, settings.logLevel);
    // if (config.requirejs != null) {
    //     config.requirejs.context = data.station.path;
    // }
    // else {
    //     logger.info("Requirejs field is null or empty.");
    // }

    if (station == null)
        throw errors.argumentNull("station");

    let s: StationInfo = {
        path: station.path,
        ip: "127.0.0.1",
        port: station.port,
    }

    // logger.info(`Register station '${data.station.path}'.`);
    let socket = IO(`http://${gateway}`);
    socket.on("connect", () => {
        // logger.info("Socket client connected.");
        let data = JSON.stringify(Object.assign(s, { permissions }));
        socket.emit("registerStation", data);
    })

    socket.on("error", (err: Error) => {
        // logger.error(err);
    })


}