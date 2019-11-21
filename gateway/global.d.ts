import { PermissionConfig, StationInfo, Settings } from "./types";
import { ValueStore } from "maishu-chitu-service";
export declare let constants: {
    dbName: string;
    cookieToken: string;
    projectName: string;
    controllerPathRoot: string;
};
/** 内置角色 ID */
export declare let roleIds: {
    /** 管理员角色 ID */
    admin: string;
    anonymous: string;
    normalUser: string;
};
export declare let userIds: {
    admin: string;
};
export declare let tokenDataHeaderNames: {
    userId: string;
};
export declare const tokenName = "token";
export { guid } from "maishu-chitu-service";
export declare let g: {
    settings: Settings;
    projectName: string;
    stationInfos: ValueStore<(Readonly<StationInfo> & {
        permissions?: PermissionConfig;
    })[]>;
};
