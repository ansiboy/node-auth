import * as log4js from "log4js";
import { g } from "./global";

export function getLogger(): log4js.Logger {
    let logger = log4js.getLogger();
    logger.level = g.logLevel;
    return logger;
}