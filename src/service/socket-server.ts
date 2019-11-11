import IO = require("socket.io");
import http = require("http");
import { getLogger } from "maishu-node-mvc";
import { g } from "./global";
import { PROJECt_NAME } from "./config";
import { StationInfo } from "maishu-chitu-admin";
import { StationController } from "./controllers/station";

export function startSocketServer(server: http.Server) {

    console.assert(g.settings != null, "Settings is null.");
    let logger = getLogger(PROJECt_NAME, g.settings.logLevel);
    logger.info("Start socket server.");

    let io = IO(server, {});
    io.on("connection", function (socket) {
        logger.info("A client connected.");
        socket.on("registerStation", (data) => {
            logger.info(`Register station data:`, data);
            let stationInfo: StationInfo = JSON.parse(data);
            let ctrl = new StationController();
            ctrl.register(stationInfo);
        })
    })
    io.on("reconnect", function (attempt) {
        logger.info(`A client reconnect, attempt times:${attempt}.`)
    })

}