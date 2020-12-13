import { constants } from "./global";

export { socketMessages } from "./socket-server";
export { LoginResult, Settings } from "./types";

export { statusCodes } from "./status-codes";
export { tokenDataHeaderNames, roleIds, userIds, g } from "./global";
export let stationPath = `/${constants.controllerPathRoot}/`;

export { start } from "./start";