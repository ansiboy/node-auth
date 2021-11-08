import IO = require("socket.io");
import net = require("net");
import { getLogger } from "maishu-node-mvc";
import { g } from "./global";
import { StationController } from "./controllers/station";
import { Station } from "./types";

export let socketMessages = {
    registerStation: "registerStation"
}

export function startSocketServer(server: net.Server) {

    console.assert(g.settings != null, "Settings is null.");
    let logger = getLogger(g.projectName, g.settings.logLevel);
    logger.info("Start socket server.");

    let io = IO(server, {});
    io.on("connection", function (socket) {
        logger.info("A client connected.");
        socket.on(socketMessages.registerStation, (data: string) => {
            logger.info(`Register station data:`, data);
            let stationInfo: Station = JSON.parse(data);
            StationController.register(stationInfo);
        })
    })
    io.on("reconnect", function (attempt) {
        logger.info(`A client reconnect, attempt times:${attempt}.`)
    })

}