import { ConnectionConfig } from "mysql";

export interface Settings {
    port: number,
    db: ConnectionConfig,
    gateway: string,
    virtualPaths?: { [path: string]: string }
}
