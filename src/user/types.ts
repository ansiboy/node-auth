import { WebsiteConfig } from "maishu-admin-scaffold/static/website-config";
import { ConnectionOptions } from "maishu-node-data";

export interface Settings {
    websiteConfig?: WebsiteConfig;
    port: number,
    db: ConnectionOptions,
    gateway: string,
    virtualPaths?: { [path: string]: string },
}
