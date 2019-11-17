import { start as startAdmin, PermissionConfig } from "maishu-chitu-admin";
import path = require("path");
import websiteConfig from "./website-config";
import { roleIds } from "../gateway";

let permissions: PermissionConfig = {};
permissions[`${websiteConfig.stationPath}*`] = { roleIds: [roleIds.anonymousRoleId] };

startAdmin({
    port: 6891,
    rootDirectory: __dirname,
    virtualPaths: {
        node_modules: path.join(__dirname, "node_modules"),
    },
    station: {
        gateway: websiteConfig.gateway,
        path: websiteConfig.stationPath,
        permissions
    }
})


