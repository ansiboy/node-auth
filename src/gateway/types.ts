import { ConnectionConfig } from "mysql";
import { Settings as MVCConfig, LogLevel, } from "maishu-node-mvc";
import { WebsiteConfig } from "maishu-admin-scaffold/static/website-config";
import { ConnectionOptions } from "maishu-node-data";
export { WebsiteConfig } from "maishu-admin-scaffold/static/website-config";
export { Station } from "./entities";

export interface RequireConfig {

}
export interface RequireShim {

}

export interface PermissionConfigItem {
    roleIds: string[];
}
export interface PermissionConfig {
    [path: string]: PermissionConfigItem;
}

export interface Settings {
    websiteConfig?: WebsiteConfig;
    port?: number,
    db: ConnectionOptions,
    permissions?: PermissionConfig,
    proxy?: { [targetUrl: string]: string },
    headers?: MVCConfig["headers"],
    // requestFilters?: MVCConfig["requestFilters"],
    logLevel?: LogLevel,
    virtualPaths?: MVCConfig["virtualPaths"],
    bindIP?: string,
}

export type LoginResult = { userId: string, token?: string };