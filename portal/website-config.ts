/// <reference path="declare.d.ts"/>

import { WebsiteConfig } from "maishu-chitu-admin";

let lib = "./lib";
let stationPath = "/portal/";
let stationConfig: WebsiteConfig & WebsiteConfigExt = {
    stationPath,
    requirejs: {

    },
    permissions: {}
}

// stationConfig.permissions[`${stationPath}`] = { roleIds: [roleIds.anonymousRoleId] }

export default stationConfig;