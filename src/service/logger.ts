import * as log4js from "log4js";
import { g } from "./global";

log4js.configure({
    appenders: {
        console: { type: "console" }
    },
    categories: {
        default: {
            appenders: ['console'], level: getLogLevel()
        }
    }
});

export function getLogger(): log4js.Logger {

    let logger = log4js.getLogger();
    logger.level = getLogLevel();
    return logger;
}

export function getLogLevel() {
    if (g.settings != null && g.settings.logLevel != null) {
        return g.settings.logLevel;
    }

    return "info";
}