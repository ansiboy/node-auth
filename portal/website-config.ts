
/// <reference path="declare.ts"/>

let lib = "./lib";
let stationPath = "/portal/";
let stationConfig: PortalWebsiteConfig = {
    stationPath,
    requirejs: {

    },
}

// stationConfig.permissions[`${stationPath}`] = { roleIds: [roleIds.anonymousRoleId] }

export default stationConfig;