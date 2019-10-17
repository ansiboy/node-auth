import { ConnectionConfig } from "mysql";

export let g = {
    logLevel: null as "trace" | "debug" | "info" | "warn" | "error" | "fatal",
    authConn: null as ConnectionConfig,
};
