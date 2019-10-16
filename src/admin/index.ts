import { start as startAdmin } from "maishu-chitu-admin";
import path = require("path");
import { PermissionService } from "maishu-services-sdk";

export interface Config {
    port: number,
    authServiceURL: string,
}

export function start(config: Config) {
    PermissionService.baseUrl = config.authServiceURL;
    return startAdmin({
        port: config.port,
        // staticRootDirectory: path.join(__dirname, "static"),
        // controllerPath: path.join(__dirname, "controllers"),
        // sourceDirectory: path.join(__dirname, "../../src"),
        rootDirectory: __dirname,
        virtualPaths: {
            "node_modules": path.join(__dirname, "../../node_modules")
        }
    })
}