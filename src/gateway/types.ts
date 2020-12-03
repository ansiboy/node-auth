import { ConnectionConfig } from "mysql";
import { Settings as MVCConfig, LogLevel, } from "maishu-node-mvc";
import { WebsiteConfig } from "maishu-chitu-admin";
import { ConnectionOptions } from "maishu-node-data";
export { SimpleMenuItem, WebsiteConfig } from "maishu-chitu-admin";
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

export interface StationInfo {
    path: string;
    ip: string;
    port: number;
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