import { ConnectionConfig } from "mysql";
import { PermissionConfig, StationInfo, Settings } from "./types";
import { ValueStore } from "maishu-chitu-service"

export let constants = {
    /** 管理员角色 ID */
    adminRoleId: "535e89a2-5b17-4e65-fecb-0259015b1a9b",
    anonymousRoleId: "738FB92C-60CF-4280-B5AE-61C376D0AADF",
    dbName: "shop_auth",
    cookieToken: "token",
    projectName: "node-auth-core",
    controllerPathRoot: "auth"
}

export let tokenDataHeaderNames = {
    userId: "user-id",
    roleIds: "role-ids"
}

export const tokenName = "token";

export function guid(): string {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

export let g = {
    settings: null as Settings,
    projectName: constants.projectName,
    stationInfos: new ValueStore<(Readonly<StationInfo> & { permissions?: PermissionConfig })[]>([])
};
