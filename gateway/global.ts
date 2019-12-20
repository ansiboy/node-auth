import { PermissionConfig, StationInfo, Settings } from "./types";
import { ValueStore } from "maishu-chitu-service"

export let constants = {
    dbName: "shop_auth",
    cookieToken: "token",
    projectName: "node-auth",
    controllerPathRoot: "auth"
}

/** 内置角色 ID */
export let roleIds = {
    /** 管理员角色 ID */
    admin: "535e89a2-5b17-4e65-fecb-0259015b1a9b",
    anonymous: "738FB92C-60CF-4280-B5AE-61C376D0AADF",
    normalUser: "516A72A0-21AE-4551-8A38-96EDAB0FAA5F",
}

export let userIds = {
    admin: "5ADB4240-B058-4D1C-9B8A-5A29A89715A8",
}

export let tokenDataHeaderNames = {
    userId: "user-id"
}

export const TOKEN_NAME = "token";

export { guid } from "maishu-chitu-service";
export let g = {
    // settings: null as Settings,
    projectName: constants.projectName,
    stationInfos: new ValueStore<(Readonly<StationInfo> & { permissions?: PermissionConfig })[]>([])
};
