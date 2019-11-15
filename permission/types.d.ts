import { ConnectionConfig } from "mysql";
export interface Settings {
    port: number;
    authServiceURL: string;
    conn: ConnectionConfig;
}
