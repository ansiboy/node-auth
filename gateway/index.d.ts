import { Settings } from "./types";
export { socketMessages } from "./socket-server";
export { LoginResult, Settings } from "./types";
export { createDatabaseIfNotExists } from "./data-context";
export declare let roleIds: {
    adminRoleId: string;
    anonymousRoleId: string;
};
export { statusCodes } from "./status-codes";
export { tokenDataHeaderNames } from "./global";
export declare let stationPath: string;
export declare function start(settings: Settings): void;
