
/// <reference path="declare.ts"/>

import { PermissionConfig, WebsiteConfig } from "maishu-chitu-admin";
import { roleIds } from "../gateway";

export let stationPath = "/portal/";
export let permissions: PermissionConfig = {};
permissions[`${stationPath}*`] = { roleIds: [roleIds.anonymous] };

export interface ServerContextData {
    indexPage: string,
}

export default function (data: ServerContextData) {

    let lib = "./lib";
    let websiteConfig: PortalWebsiteConfig & WebsiteConfig = {
        stationPath,
        indexPage: data.indexPage || "index",
        protocol: "http:",
        requirejs: {
            context: stationPath,
            paths: {
                qrcode: `${lib}/qrcode`,
            }
        }
    }

    return websiteConfig;

    // stationConfig.permissions[`${stationPath}`] = { roleIds: [roleIds.anonymousRoleId] }
    // export default websiteConfig;
}