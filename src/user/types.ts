import { ConnectionConfig } from "mysql";
import { WebsiteConfig } from "maishu-chitu-admin";

export interface Settings {
    websiteConfig?: WebsiteConfig;
    port: number,
    db: ConnectionConfig,
    gateway: string,
    virtualPaths?: { [path: string]: string },
}
