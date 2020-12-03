import { ConnectionConfig } from "mysql";
import { WebsiteConfig } from "maishu-chitu-admin";
import { ConnectionOptions } from "maishu-node-data";

export interface Settings {
    websiteConfig?: WebsiteConfig;
    port: number,
    db: ConnectionOptions,
    gateway: string,
    virtualPaths?: { [path: string]: string },
}
