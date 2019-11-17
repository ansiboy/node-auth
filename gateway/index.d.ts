import { Settings } from "./types";
export { socketMessages } from "./socket-server";
export { LoginResult } from "./types";
export declare let roleIds: {
    adminRoleId: string;
    anonymousRoleId: string;
};
export { statusCodes } from "./status-codes";
export { tokenDataHeaderNames } from "./global";
export declare function start(settings: Settings): void;
