import { WebsiteConfig } from "maishu-chitu-admin";

let lib = "./lib";
let stationPath = "/portal/";
let stationConfig: WebsiteConfig & WebsiteConfigExt = {
    stationPath,
    gateway: "127.0.0.1:2857",
    requirejs: {

    },
    permissions: {}
}

// stationConfig.permissions[`${stationPath}`] = { roleIds: [roleIds.anonymousRoleId] }

export default stationConfig;