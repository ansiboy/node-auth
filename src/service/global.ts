import { ConnectionConfig } from "mysql";
import { ValueStore } from "maishu-chitu-service"
import { StationInfo, PermissionConfig } from "maishu-chitu-admin";
import { startServer, Config as MVCConfig } from "maishu-node-mvc";

export interface Settings {
    port: number,
    db: ConnectionConfig,
    permissions?: PermissionConfig,
    proxy?: MVCConfig["proxy"],
    headers?: MVCConfig["headers"],
    actionFilters?: MVCConfig["actionFilters"],
    logLevel?: "trace" | "debug" | "info" | "warn" | "error" | "fatal",
}


export let g = {
    settings: null as Settings,
    authConn: null as ConnectionConfig,
    stationInfos: new ValueStore<(Readonly<StationInfo> & { permissions?: PermissionConfig })[]>([])
};
