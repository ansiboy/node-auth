
/// <reference path="declare.ts"/>

import { PermissionConfig, WebsiteConfig } from "maishu-chitu-admin";
import { roleIds } from "../gateway";

export let stationPath = "/portal/";
export let permissions: PermissionConfig = {};
permissions[`${stationPath}*`] = { roleIds: [roleIds.anonymous] };

export default function (data: ServerContextData) {

    let websiteConfig: PortalWebsiteConfig & WebsiteConfig = {
        stationPath,
        indexPage: data.indexPage || "index",
        protocol: "http:",
        requirejs: {

        },
    }

    return websiteConfig;

    // stationConfig.permissions[`${stationPath}`] = { roleIds: [roleIds.anonymousRoleId] }
    // export default websiteConfig;
}