import { Settings } from "./types";
export { socketMessages } from "./socket-server";
export { LoginResult, Settings } from "./types";
export { createDatabaseIfNotExists, createDataContext } from "./data-context";
export { statusCodes } from "./status-codes";
export { tokenDataHeaderNames, roleIds, userIds } from "./global";
export declare let stationPath: string;
export declare function start(settings: Settings): Promise<void>;
