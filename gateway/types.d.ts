import { ConnectionConfig } from "mysql";
import { Settings as MVCConfig, LogLevel, ServerContext as BaseServerContext } from "maishu-node-mvc";
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
    bindIP?: string;
}
export declare type LoginResult = {
    userId: string;
    token?: string;
};
export interface ServerContextData {
    db: ConnectionConfig;
    logLevel: LogLevel;
}
export declare type ServerContext = BaseServerContext<ServerContextData>;
