import { ConnectionConfig } from "mysql";
import { Settings as MVCConfig, LogLevel } from "maishu-node-mvc";
export interface RequireConfig {
}
export interface RequireShim {
}
export declare type SimpleMenuItem = {
    name: string;
    path?: string;
    icon?: string;
    children?: SimpleMenuItem[];
};
export interface PermissionConfigItem {
    roleIds: string[];
}
export interface PermissionConfig {
    [path: string]: PermissionConfigItem;
}
export declare type WebsiteConfig = {
    requirejs: RequireConfig;
    firstPanelWidth?: number;
    secondPanelWidth?: number;
    menuItems?: SimpleMenuItem[];
    permissions?: PermissionConfig;
};
export interface StationInfo {
    path: string;
    ip: string;
    port: number;
}
export interface Settings {
    port: number;
    db: ConnectionConfig;
    permissions?: PermissionConfig;
    proxy?: {
        [targetUrl: string]: string;
    };
    headers?: MVCConfig["headers"];
    requestFilters?: MVCConfig["requestFilters"];
    logLevel?: LogLevel;
    virtualPaths?: MVCConfig["virtualPaths"];
}
export declare type LoginResult = {
    userId: string;
    roleIds: string[];
    token?: string;
};
