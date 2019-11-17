import { PermissionConfig, StationInfo, Settings } from "./types";
import { ValueStore } from "maishu-chitu-service";
export declare let constants: {
    /** 管理员角色 ID */
    adminRoleId: string;
    anonymousRoleId: string;
    dbName: string;
    cookieToken: string;
    projectName: string;
    controllerPathRoot: string;
};
export declare let tokenDataHeaderNames: {
    userId: string;
    roleIds: string;
};
export declare const tokenName = "token";
export declare function guid(): string;
export declare let g: {
    settings: Settings;
    projectName: string;
    stationInfos: ValueStore<(Readonly<StationInfo> & {
        permissions?: PermissionConfig;
    })[]>;
};
