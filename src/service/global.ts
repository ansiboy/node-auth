import { ConnectionConfig } from "mysql";
import { ValueStore } from "maishu-chitu-service"
import { StationInfo } from "maishu-chitu-admin";

export let g = {
    logLevel: null as "trace" | "debug" | "info" | "warn" | "error" | "fatal",
    authConn: null as ConnectionConfig,
    stationInfos: new ValueStore<StationInfo[]>([])
};
