import { start as startAdmin, PermissionConfig } from "maishu-chitu-admin";
import path = require("path");
// import { gateway } from "./static/constants";
import websiteConfig from "./website-config";

const anonymousRoleId = "738FB92C-60CF-4280-B5AE-61C376D0AADF";

let permissions: PermissionConfig = {};
permissions[`${websiteConfig.stationPath}*`] = { roleIds: [anonymousRoleId] };

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


