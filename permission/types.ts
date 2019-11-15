import { ConnectionConfig } from "mysql";

export interface Settings {
    port: number,
    conn: ConnectionConfig,
}
