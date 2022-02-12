import { PermissionConfig, Station, Settings } from "../types";
import { ValueStore } from "maishu-chitu-service"

export let constants = {
    dbName: "shop_auth",
    cookieToken: "token",
    projectName: "node-auth",
    userApiBasePath: "/user-api/auth",
    adminApiBasePath: "/admin-api/auth",
    anonApiBasePath: "/anon-api/auth",
}

export let userIds = {
    /** 管理员 ID */
    admin: "5ADB4240-B058-4D1C-9B8A-5A29A89715A8",
}

export let HeaderNames = {
    userId: "user-id",
    applicationId: "application-id",
}

export const TOKEN_NAME = "token";

export { guid } from 'maishu-toolkit';
export let g = {
    settings: null as Settings,
    projectName: constants.projectName,
    stationInfos: new ValueStore<(Readonly<Station> & { permissions?: PermissionConfig })[]>([])
};
