import { ConnectionConfig } from "mysql";
import { ValueStore } from "maishu-chitu-service"
import { StationInfo, PermissionConfig } from "maishu-chitu-admin";
import { Settings as MVCConfig, LogLevel, } from "maishu-node-mvc";

export interface Settings {
    port: number,
    db: ConnectionConfig,
    permissions?: PermissionConfig,
    proxy?: MVCConfig["proxy"],
    headers?: MVCConfig["headers"],
    actionFilters?: MVCConfig["actionFilters"],
    logLevel?: LogLevel,
}


export let g = {
    settings: null as Settings,
    authConn: null as ConnectionConfig,
    stationInfos: new ValueStore<(Readonly<StationInfo> & { permissions?: PermissionConfig })[]>([])
};
